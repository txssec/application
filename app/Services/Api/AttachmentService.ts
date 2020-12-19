import { BaseService } from 'App/Services'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { ApiRequestContract } from 'App/Contracts/ApiRequestContract'
import { AttachmentRepository } from 'App/Repositories/AttachmentRepository'

import Event from '@ioc:Adonis/Core/Event'
import Application from '@ioc:Adonis/Core/Application'
import NotFoundException from 'App/Exceptions/NotFoundException'

export class AttachmentService extends BaseService {
  public async getAll(pagination, data?: ApiRequestContract) {
    data?.where?.push({ key: 'applicationId', value: this.Application.id })

    return new AttachmentRepository().getAll(pagination, data)
  }

  public async getOne(id: string, data?: ApiRequestContract) {
    const application = await new AttachmentRepository().getOne(id, data)

    if (!application) {
      throw new NotFoundException()
    }

    return application
  }

  public async create(data) {
    const attachment = await new AttachmentRepository().getOne(null, {
      where: [{ key: 'type', value: data.type }],
    })

    if (attachment) {
      await this.delete(attachment.id)
    }

    data.mime = {}
    data.fromToken = this.Application.token
    data.applicationId = this.Application.id
    if (data.pathBack) {
      const info = await this.upload(data.pathBack)

      data.pathBack = info.url
      Object.assign(data.mime, { path_back: info.mime })
    }

    if (data.pathFront) {
      const info = await this.upload(data.pathFront)

      data.pathFront = info.url
      Object.assign(data.mime, { path_front: info.mime })
    }

    const newAttachment = await new AttachmentRepository().create(data)
    Event.emit('new::attachment', { attachment: newAttachment })

    return newAttachment
  }

  public async delete(id: string) {
    const application = await new AttachmentRepository().delete(id)

    if (!application) {
      throw new NotFoundException()
    }

    return application
  }

  public async upload(file: MultipartFileContract) {
    const fileName = `${new Date().getTime()}-${file.fieldName}-${this.Application.name}.${
      file.extname
    }`

    await file.move(Application.publicPath(`uploads/${this.Application.token}`), {
      name: fileName,
    })

    return {
      url: `${this.Application.token}/${fileName}`,
      mime: { size: file.size, original_name: file.fileName, extension: file.extname },
    }
  }
}
