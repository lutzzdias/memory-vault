import { FastifyInstance } from 'fastify'

import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

// TODO: use file upload servide (google cloud storage, cloudfare r2, amazon..., etc)
export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    // limits does not stop from receiving a file larger, it only cuts file when it reaches 5Mb
    // TODO: deal with larger files
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

    // get the url of server (made this way so it's not static and will not have to be manually changed)
    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    // create file specific url with the fullUrl variable as the base (eg.: 'http://localhost:3333/uploads/faldsjfldsjfi239042jre.png')
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return { fileUrl }
  })
}
