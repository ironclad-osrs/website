import Docker from 'dockerode'

const isVitestContainer = container => {
  const prefix = '/progress-quest-integration-tests'

  return container.Names.some(name => name.startsWith(prefix))
}

export const teardown = async () => {
  const docker = new Docker()
  const containers = await docker.listContainers()

  await Promise.all(
    containers
      .filter(isVitestContainer)
      .map(container => docker.getContainer(container.Id).kill())
  )
}
