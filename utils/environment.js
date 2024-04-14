const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV

console.debug('environment ~> %s', environment)

export const DEVELOPMENT = environment === 'development'
export const PREVIEW = environment === 'preview'
export const PRODUCTION = environment === 'production'
