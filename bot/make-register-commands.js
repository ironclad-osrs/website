const { buildSync } = require('esbuild')
const { config } = require('dotenv')

config({ path: '../.env.local' })

const define = {}

for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

const options = {
  entryPoints: ['./register-commands.js'],
  outfile: './dist/register-commands.js',
  bundle: true,
  platform: 'node',
  define
}

buildSync(options)
