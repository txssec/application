import { Address } from 'App/Models'
import { BaseRepository } from './BaseRepository'

export class AddressRepository extends BaseRepository {
  protected Model = Address
}
