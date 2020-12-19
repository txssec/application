import { DateTime } from 'luxon'
import { Token } from '@secjs/core'
import { column, BaseModel, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { Application } from './Application'

export class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'application_id' })
  public applicationId: string

  @column()
  public title: string

  @column()
  public icon: string

  @column()
  public type:
    | 'email'
    | 'phone'
    | 'cellphone'
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'site'
    | 'github'

  @column()
  public contact: string

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
  public static async generateId(contact: Contact) {
    contact.id = new Token().generate()
  }

  @beforeCreate()
  public static async generateToken(contact: Contact) {
    contact.token = new Token().generate('ctc')
  }
}
