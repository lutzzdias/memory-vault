import { FastifyInstance } from 'fastify'

import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_000, // 5Mb
      }
    })

    // return error if file was not provided
    if(!upload) {
      return reply.status(400).send()
    }

    // regex to check if the file mimeType is image or video
    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    // check if received file is image or video
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    // return error if file is not image or video
    if(!isValidFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    // filename = random UUID + received file extension (eg.: faldsjfldsjfi239042jre.png)
    const fileName = fileId.concat(extension)

    // create stream that will write the received file to uploads directory on the root of the project
    const writeStream = createWriteStream(resolve(__dirname, '../../uploads/', fileName))

    // idk, make stream actually do the upload
    await pump(upload.file, writeStream)

    return { ok: true }
  })
}
