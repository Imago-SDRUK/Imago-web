import { defineConfig } from 'vitepress'
import typedocSidebar from '../vitepress/md/typedoc-sidebar.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	srcDir: 'vitepress/md',
	title: 'Imago Web - Documentation',
	description: 'Imago web documentation',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [{ text: 'Home', link: '/' }],
		sidebar: [
			{
				text: 'API',
				items: typedocSidebar
			}
		],
		search: {
			provider: 'local'
		},

		socialLinks: [{ icon: 'github', link: 'https://github.com/Imago-SDRUK/Imago-web' }]
	}
})
