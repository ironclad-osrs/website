import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['verbose'],
    globalSetup: './vitest.teardown.js',
    coverage: {
      include: [
        'actions/**/*.js',
        'app/**/*.js',
        'bot/**/*.js',
        'utils/*.js'
      ],
      exclude: [
        'app/**/_test/utils/*.js',
        'bot/**/_test-utils.js',
        'utils/test/**.js',
        //
        'bot/make-register-commands.js'
      ]
    }
  },
  resolve: {
    alias: {
      '@': __dirname
    }
  }
})
