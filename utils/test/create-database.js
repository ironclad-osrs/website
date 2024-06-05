import Docker from 'dockerode'
import getPort from 'get-port'
import { uid } from 'uid'

import * as stream from 'node:stream'

export const createDatabase = async () => {
  const port = await getPort()

  const docker = new Docker()
  const image = 'postgres:14'

  // --

  const pullStream = await docker.pull(image)

  await new Promise((resolve, reject) =>
    docker.modem.followProgress(pullStream, (err) => (err ? reject(err) : resolve(err)))
  )

  // --

  const container = await docker.createContainer({
    Image: image,
    Env: ['POSTGRES_PASSWORD=postgres', 'POSTGRES_USER=postgres', 'POSTGRES_DB=postgres'],
    name: `progress-quest-integration-tests-${uid()}`,
    HostConfig: {
      AutoRemove: true,
      PortBindings: {
        '5432/tcp': [{ HostPort: `${port}` }]
      }
    }
  })

  await container.start()

  await new Promise(resolve => {
    const logStream = new stream.PassThrough()

    logStream.on('data', chunk => {
      const entry = chunk.toString('utf8')

      if (entry.includes('database system is ready to accept connections')) {
        resolve()
      }
    })

    container.logs({ stdout: true, follow: true, details: true }, async (_, stream) => {
      container.modem.demuxStream(stream, logStream, logStream)
    })
  })

  // --

  process.env.DATABASE_URL = `postgres://postgres:postgres@localhost:${port}/postgres`

  await new Promise(resolve => setTimeout(resolve, 250))
  await import('@/database/index.js')

  return container.id
}
