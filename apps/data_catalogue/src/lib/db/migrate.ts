import { log } from '$lib/utils/server/logger'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

export async function runMigration() {
	if (!process.env.DATABASE_URL) {
		log.error('no database has been setup')
		throw Error('no database has been setup')
	}
	const db = drizzle(String(process.env.DATABASE_URL))
	log.info('Migration will start now')
	const folder = '/app/apps/data_catalogue/migrations'
	// const folder = './src/lib/db/migrations'
	// const folder = '/app/apps/data_catalogue/migrations'
	// return await migrate(db, { migrationsFolder: folder })
	await migrate(db, { migrationsFolder: folder })
		.then(() => log.info('Migration completed'))
		.catch((err) => {
			log.error(`Migration failed`)
			log.error(err)
			return err
		})
}
