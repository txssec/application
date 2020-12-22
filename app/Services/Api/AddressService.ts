import { BaseService } from 'App/Services'
import { AddressRepository } from 'App/Repositories/AddressRepository'
import { ApiRequestContract } from 'App/Contracts/ApiRequestContract'

import Event from '@ioc:Adonis/Core/Event'
import NotFoundException from 'App/Exceptions/NotFoundException'

export class AddressService extends BaseService {
  public async getAll(pagination, data?: ApiRequestContract) {
    data?.where?.push({ key: 'applicationId', value: this.Application.id })

    return new AddressRepository().getAll(pagination, data)
  }

  public async getOne(id: string, data?: ApiRequestContract) {
    const application = await new AddressRepository().getOne(id, data)

    if (!application) {
      throw new NotFoundException()
    }

    return application
  }

  public async create(data) {
    const address = await new AddressRepository().getOne(null, {
      where: [{ key: 'applicationId', value: this.Application.id }],
    })

    if (address) {
      await this.delete(address.id)
    }

    data.fromToken = this.Application.token
    data.applicationId = this.Application.id
    const newAddress = await new AddressRepository().create(data)
    Event.emit('new::address', { application: this.Application, address: newAddress })

    return newAddress
  }

  public async delete(id: string) {
    const application = await new AddressRepository().delete(id)

    if (!application) {
      throw new NotFoundException()
    }

    return application
  }
}
