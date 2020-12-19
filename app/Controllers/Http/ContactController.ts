import { ContactService } from 'App/Services'
import { ApiController } from 'App/Controllers/ApiController'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ContactStoreValidator } from 'App/Validators/Api/Contact/ContactStoreValidator'

export default class ContactController extends ApiController {
  public async index({ request, response, auth, pagination }: HttpContextContract) {
    const data = request.only(['where', 'orderBy', 'includes'])

    const contacts = await new ContactService().setGuard(auth).getAll(pagination, data)

    return this.response(response).withCollection(contacts.toJSON())
  }

  public async show({ request, response, params, auth }: HttpContextContract) {
    const data = request.only(['where', 'orderBy', 'includes'])

    const contact = await new ContactService().setGuard(auth).getOne(params.id, data)

    return this.response(response).withOne(contact)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = await this.request(request).validate(ContactStoreValidator)

    const contact = await new ContactService().setGuard(auth).create(data)

    return this.response(response).withOne(contact)
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const contact = await new ContactService().setGuard(auth).delete(params.id)

    return this.response(response).withSoftDeleted(contact.title)
  }
}
