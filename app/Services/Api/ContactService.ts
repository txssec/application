import { BaseService } from 'App/Services'
import { ContactRepository } from 'App/Repositories/ContactRepository'
import { ApiRequestContract } from 'App/Contracts/ApiRequestContract'

import Event from '@ioc:Adonis/Core/Event'
import NotFoundException from 'App/Exceptions/NotFoundException'

export class ContactService extends BaseService {
  public async getAll(pagination, data?: ApiRequestContract) {
    data?.where?.push({ key: 'applicationId', value: this.Application.id })

    return new ContactRepository().getAll(pagination, data)
  }

  public async getOne(id: string, data?: ApiRequestContract) {
    const application = await new ContactRepository().getOne(id, data)

    if (!application) {
      throw new NotFoundException()
    }

    return application
  }

  public async create(data) {
    const contact = await new ContactRepository().getOne(null, {
      where: [{ key: 'contact', value: data.contact.toLowerCase() }],
    })

    if (contact) {
      await this.delete(contact.id)
    }

    data.fromToken = this.Application.token
    data.applicationId = this.Application.id
    const newContact = await new ContactRepository().create(data)
    Event.emit('new::contact', {
      key: 'EMPTY_CONTACT',
      application: this.Application,
      contact: newContact,
    })

    return newContact
  }

  public async delete(id: string) {
    const application = await new ContactRepository().delete(id)

    if (!application) {
      throw new NotFoundException()
    }

    return application
  }
}
