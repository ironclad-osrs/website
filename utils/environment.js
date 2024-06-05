const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV

export const TEST = environment === 'test'
export const DEVELOPMENT = environment === 'development'
export const PREVIEW = environment === 'preview'
export const PRODUCTION = environment === 'production'
