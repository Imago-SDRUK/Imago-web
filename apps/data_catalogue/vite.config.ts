import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import { sentrySvelteKit } from '@sentry/sveltekit'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			org: process.env.SENTRY_ORG,
			project: process.env.SENTRY_PROJECT,
			authToken: process.env.SENTRY_AUTH_TOKEN,
			adapter: 'node'
		}),
		sveltekit()
	],
	server: {
		allowedHosts: ['host.docker.internal']
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					// environment: 'browser',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'firefox' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
})
