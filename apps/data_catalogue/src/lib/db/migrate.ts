import { log } from '$lib/utils/server/logger'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

export async function runMigration() {
	if (!process.env.DATABASE_URL) {
		log.info('no database has been setup')
		return
	}
	const db = drizzle(String(process.env.DATABASE_URL))
	log.info('migration will start now')
	// return await migrate(db, { migrationsFolder: './src/lib/db/migrations' })
	await migrate(db, { migrationsFolder: '/app/apps/data_catalogue/migrations' })
		.then(() => log.info('migration completed'))
		.catch((err) => {
			log.info(`migration failed ${err}`)
			return err
		})
}
