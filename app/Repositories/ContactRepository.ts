import { Contact } from 'App/Models'
import { BaseRepository } from './BaseRepository'

export class ContactRepository extends BaseRepository {
  protected Model = Contact
}
