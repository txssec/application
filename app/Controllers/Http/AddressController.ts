import { AddressService } from 'App/Services'
import { ApiController } from 'App/Controllers/ApiController'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AddressStoreValidator } from 'App/Validators/Api/Address/AddressStoreValidator'

export default class AddressController extends ApiController {
  public async index({ request, response, auth, pagination }: HttpContextContract) {
    const data = request.only(['where', 'orderBy', 'includes'])

    const addresses = await new AddressService().setGuard(auth).getAll(pagination, data)

    return this.response(response).withCollection(addresses.toJSON())
  }

  public async show({ request, response, params, auth }: HttpContextContract) {
    const data = request.only(['where', 'orderBy', 'includes'])

    const address = await new AddressService().setGuard(auth).getOne(params.id, data)

    return this.response(response).withOne(address)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = await this.request(request).validate(AddressStoreValidator)

    const address = await new AddressService().setGuard(auth).create(data)

    return this.response(response).withOne(address)
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const address = await new AddressService().setGuard(auth).delete(params.id)

    return this.response(response).withSoftDeleted(address.title)
  }
}
