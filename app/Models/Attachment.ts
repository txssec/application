import { DateTime } from 'luxon'
import { Token } from '@secjs/core'
import { column, BaseModel, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { Application } from './Application'

import Config from '@ioc:Adonis/Core/Config'

export class Attachment extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'application_id' })
  public applicationId: string

  @column()
  public name: string

  @column()
  public icon: string

  @column()
  public type: 'avatar' | 'rg' | 'cnh' | 'id' | 'proof_of_address' | 'mock'

  @column({
    columnName: 'path_front',
    serialize: (value: string) => {
      return value ? `${Config.get('app.url')}/uploads/${value}` : value
    },
  })
  public pathFront: string

  @column({
    columnName: 'path_back',
    serialize: (value: string) => {
      return value ? `${Config.get('app.url')}/uploads/${value}` : value
    },
  })
  public pathBack?: string

  @column()
  public mime: JSON

  @column()
  public document?: JSON

  @column()
  public token: string

  @column({ columnName: 'from_token' })
  public fromToken?: string

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
  public static async generateId(attachment: Attachment) {
    attachment.id = new Token().generate()
  }

  @beforeCreate()
  public static async generateToken(attachment: Attachment) {
    attachment.token = new Token().generate('atc')
  }
}
