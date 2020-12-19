import { DateTime } from 'luxon'
import { Token } from '@secjs/core'
import { column, BaseModel, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { Application } from './Application'

export class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'application_id' })
  public applicationId: string

  @column()
  public title: string

  @column()
  public icon: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public country: string

  @column({ columnName: 'zip_code' })
  public zipCode: string

  @column()
  public street: string

  @column()
  public number: string

  @column()
  public district: string

  @column()
  public complement: string

  @column()
  public token: string

  @column({ columnName: 'from_token' })
  public fromToken: string

  @column()
  public status: 'pendent' | 'approved' | 'reproved' | 'deleted'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => Application)
  public application: BelongsTo<typeof Application>

  @beforeCreate()
  public static async generateId(address: Address) {
    address.id = new Token().generate()
  }

  @beforeCreate()
  public static async generateToken(address: Address) {
    address.token = new Token().generate('adr')
  }
}
