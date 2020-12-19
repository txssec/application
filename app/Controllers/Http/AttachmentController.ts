import { AttachmentService } from 'App/Services'
import { ApiController } from 'App/Controllers/ApiController'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AttachmentStoreValidator } from 'App/Validators/Api/Attachment/AttachmentStoreValidator'

export default class AttachmentController extends ApiController {
  public async index({ request, response, auth, pagination }: HttpContextContract) {
    const data = request.only(['where', 'orderBy', 'includes'])

    const attachments = await new AttachmentService().setGuard(auth).getAll(pagination, data)

    return this.response(response).withCollection(attachments.toJSON())
  }

  public async show({ request, response, params, auth }: HttpContextContract) {
    const data = request.only(['where', 'orderBy', 'includes'])

    const attachment = await new AttachmentService().setGuard(auth).getOne(params.id, data)

    return this.response(response).withOne(attachment)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = await this.request(request).validate(AttachmentStoreValidator)

    const attachment = await new AttachmentService().setGuard(auth).create(data)

    return this.response(response).withOne(attachment)
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const attachment = await new AttachmentService().setGuard(auth).delete(params.id)

    return this.response(response).withSoftDeleted(attachment.name)
  }
}
