import { page } from '$app/state'
import { linear } from 'svelte/easing'
import { Tween } from 'svelte/motion'

export type FileMetadata = {
	filename: string
	size: number
	type: string
	last_modified: number
	description?: string
	id?: string
}

export type FilePreview = FileMetadata & {
	id?: number
	thumbnail: string | ArrayBuffer
	url?: string
}

export type FileUpload = {
	status: 'idle' | 'completed' | 'error' | 'uploading'
	progress: Tween<number>
	value: string
	// fn: ({
	// 	file,
	// 	headers
	// }: FilePreUpload & { headers?: Record<string, string> }) => Promise<CkanResource>
}

export type FilePreUpload = FilePreview & {
	file: File
	upload?: FileUpload
}

export type FileReaderHandler = ({
	file,
	filename,
	size,
	last_modified,
	type
}: {
	file: File
} & FileMetadata) => (this: FileReader, ev: ProgressEvent<FileReader>) => unknown

export const readURL = (file: File) => {
	return new Promise((res, rej) => {
		const reader = new FileReader()
		reader.onload = (e) => res(e.target?.result)
		reader.onerror = (e) => rej(e)
		reader.readAsDataURL(file)
	})
}

export const readFile = ({
	file,
	file_reader,
	handleFileReader
}: {
	file: File
	file_reader?: FileReader
	handleFileReader: FileReaderHandler
}) => {
	const reader = file_reader ?? new FileReader()
	if (reader && file) {
		reader.readAsDataURL(file)
		reader.onload = handleFileReader({
			filename: file.name,
			size: file.size,
			last_modified: file.lastModified,
			type: file.type.split('/')[1],
			file: file
		})
	}
}

export const readFilePromise = ({ file }: { file?: File }): Promise<string | ArrayBuffer | null> =>
	new Promise((resolve) => {
		if (file === undefined) {
			return resolve(null)
		}
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = function (e) {
			if (e.target && e.target.result) {
				return resolve(e.target.result)
			}
		}
	})

export const getFileUploadUrl = async ({ file }: { file: File }) => {
	const res = await fetch('/api/v1/resources?action=signed_url', {
		method: 'POST',
		body: JSON.stringify({ filename: file.name })
	})
	const { url } = (await res.json()) as { url: string }
	return url
}

export const handleFileType = async (file: File) => {
	if (file.type) {
		return file
	}
	const arr = await file.arrayBuffer()
	return new File([arr], file.name, { type: 'application/octet-stream' })
}

export const upload = async ({
	file,
	url,
	upload,
	headers = {},
	description,
	type,
	filename
}: FilePreUpload & { url: string; headers?: Record<string, string> }) => {
	const uploaded_url = await xhrUpload({ file, url, upload, headers })
	const res = await fetch('/api/v1/resources?action=create', {
		method: 'POST',
		body: JSON.stringify({
			size: file.size,
			url: uploaded_url.url,
			id: page.params.id,
			description,
			type,
			mimetype: file.type,
			name: filename
		})
	})

	const resource = await res.json()
	return resource
}

export const xhrUpload = ({
	file_preupload,
	url,
	headers = {}
}: {
	file_preupload: FilePreUpload
	url: string
	headers?: Record<string, string>
}): Promise<{ url: string }> => {
	let xhr: XMLHttpRequest | undefined = undefined
	return new Promise((resolve, reject) => {
		const { file, upload } = file_preupload
		if (!url) {
			return reject({
				error: `Url is missing`
			})
		}
		const size = file.size
		xhr = new XMLHttpRequest()
		xhr.upload.addEventListener('progress', (event) => {
			if (event.lengthComputable) {
				if (upload) {
					upload.progress.target = Math.round((event.loaded / event.total) * 100)
					upload.status = 'uploading'
				}
			}
		})

		xhr.addEventListener('loadend', () => {
			if (xhr) {
				if (upload) {
					upload.status = xhr.status > 0 && xhr.status < 400 ? 'completed' : 'error'
					upload.value = xhr.responseText
				}
				return resolve({
					url
				})
			}
		})
		xhr.upload.addEventListener('error', () => {
			if (upload) {
				upload.status = 'error'
				upload.progress.target = 0
			}
			return reject({
				error: xhr?.responseText ?? `There's been an error uploading this file, please try again.`
			})
		})
		xhr.open('PUT', url)
		for (const [name, value] of Object.entries({ ...headers, 'Content-Length': String(size) })) {
			xhr.setRequestHeader(name, value)
		}
		xhr.send(file)
	})
}

export const addFiles: ({ previews }: { previews: FilePreUpload[] }) => FileReaderHandler =
	({ previews }) =>
	({ filename, size, last_modified, type, file }) =>
	(ev) => {
		const target = ev.target
		if (target && target.result) {
			previews.push({
				file,
				thumbnail: '',
				size: size,
				filename: filename,
				last_modified: last_modified,
				type: type,
				description: '',
				upload: {
					status: 'idle',
					progress: new Tween(0, {
						easing: linear
					}),
					value: '',
					fn: async (_file) =>
						await getFileUploadUrl({ file: file }).then((url) => upload({ ..._file, url: url }))
				}
			})
		}
	}
