import { DateTime } from 'luxon'
import { Token } from '@secjs/core'
import { Application } from './Application'
import { column, BaseModel, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export class Issue extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'application_id' })
  public applicationId: string

  @column()
  public key: string

  @column()
  public token: string

  @column({ columnName: 'from_token' })
  public fromToken: string

  @column()
  public description: string

  @column()
  public required: boolean

  @column({ columnName: 'input_type' })
  public inputType: 'text' | 'file' | 'date' | 'object' | 'none'

  @column({ columnName: 'resource_type' })
  public resourceType:
    | 'avatar'
    | 'rg'
    | 'cnh'
    | 'id'
    | 'proof_of_address'
    | 'email'
    | 'phone'
    | 'cellphone'
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'site'
    | 'github'
    | 'mock'
    | 'none'

  @column()
  public response?: string

  @column({ columnName: 'response_file' })
  public responseFile?: string

  @column({ columnName: 'cancelation_reason' })
  public cancelationReason?: string

  @column({ columnName: 'reprovation_reason' })
  public reprovationReason?: string

  @column()
  public status: 'pendent' | 'approved' | 'answered' | 'reproved' | 'canceled' | 'deleted'

  @column.dateTime()
  public reprovedAt?: DateTime

  @column.dateTime()
  public approvedAt?: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt?: DateTime

  @belongsTo(() => Application)
  public application: BelongsTo<typeof Application>

  @beforeCreate()
  public static async generateId(issue: Issue) {
    issue.id = new Token().generate()
  }

  @beforeCreate()
  public static async generateToken(issue: Issue) {
    issue.token = new Token().generate('isu')
  }
}
