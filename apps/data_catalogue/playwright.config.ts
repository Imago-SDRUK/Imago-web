import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	use: {
		video: {
			mode: 'on',
			size: {
				width: 1920,
				height: 1080
			}
		}
	},
	projects: [
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] }
		}
	],
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'e2e'
})
