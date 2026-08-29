import type { IStoragesRepository } from '$lib/server/application/repositories/storages'

let mock: string[] = []

// TODO: implement test interface

const createStorage: IStoragesRepository['createStorage'] = async () => {}
const deleteStorage: IStoragesRepository['deleteStorage'] = async () => {}
const getStorage: IStoragesRepository['getStorage'] = async () => {}
const listStorages: IStoragesRepository['listStorages'] = async () => {}
const updateStorage: IStoragesRepository['updateStorage'] = async () => {}

export const testIStoragesRepositoryInfrastructure: IStoragesRepository = {
	createStorage,
	deleteStorage,
	getStorage,
	listStorages,
	updateStorage
}
