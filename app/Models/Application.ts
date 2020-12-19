import { DateTime } from 'luxon'
import { Token } from '@secjs/core'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  hasMany,
  HasMany,
  BaseModel,
  beforeCreate,
  manyToMany,
  ManyToMany,
  beforeSave,
  afterCreate,
} from '@ioc:Adonis/Lucid/Orm'

import { Role } from './Role'
import { Issue } from './Issue'
import { Attachment } from './Attachment'
import { ApplicationToken } from './ApplicationToken'
import { Contact } from './Contact'
import { Address } from './Address'

export { Application }

export default class Application extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public token: string

  @column()
  public status: 'pendent' | 'pendent_issue' | 'approved' | 'reproved' | 'deleted'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @manyToMany(() => Role, { pivotTable: 'role_application' })
  public roles: ManyToMany<typeof Role>

  @hasMany(() => ApplicationToken)
  public applicationTokens: HasMany<typeof ApplicationToken>

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  @hasMany(() => Contact)
  public contacts: HasMany<typeof Contact>

  @hasMany(() => Attachment)
  public attachments: HasMany<typeof Attachment>

  @hasMany(() => Issue)
  public issues: HasMany<typeof Issue>

  @beforeSave()
  public static async hashPassword(application: Application) {
    if (application.$dirty.password) application.password = await Hash.make(application.password)
  }

  @beforeSave()
  public static async trimEmail(application: Application) {
    if (application.$dirty.email) application.email = application.email.toLowerCase()
  }

  @beforeCreate()
  public static async generateId(application: Application) {
    application.id = new Token().generate()
  }

  @beforeCreate()
  public static async generateToken(application: Application) {
    application.token = new Token().generate('app')
  }

  @afterCreate()
  public static async defaultRole(application: Application) {
    const applicationRole = await Role.findByOrFail('slug', 'application')

    await application.related('roles').attach([applicationRole.id])
  }

  @afterCreate()
  public static async generateConfirmToken(application: Application) {
    const today = new Date()
    const tommorow = new Date(today.setDate(today.getDate() + 1))

    await application.related('applicationTokens').create({
      name: 'Confirmation Token',
      type: 'confirmation_token',
      token: new Token().generate('utk'),
      expiresAt: DateTime.fromJSDate(tommorow),
    })
  }

  @afterCreate()
  public static async generateIssues(application: Application) {
    await application.related('issues').createMany([
      {
        key: 'EMPTY_ATTACHMENT',
        description: 'An attachment is required to continue using the application.',
        required: true,
        inputType: 'file',
        resourceType: 'id',
        fromToken: application.token,
      },
      {
        key: 'EMPTY_CONTACT',
        description: 'Your contact is required to continue using the application.',
        required: true,
        inputType: 'text',
        fromToken: application.token,
      },
      {
        key: 'EMPTY_CELLPHONE',
        description: 'Your cellphone is required to continue using the application.',
        required: true,
        inputType: 'text',
        resourceType: 'cellphone',
        fromToken: application.token,
      },
      {
        key: 'EMPTY_ADDRESS',
        description: 'Please complete your registration, provide your address.',
        required: false,
        inputType: 'object',
        fromToken: application.token,
      },
    ])
  }
}
