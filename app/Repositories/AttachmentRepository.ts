import { Attachment } from 'App/Models'
import { BaseRepository } from './BaseRepository'

export class AttachmentRepository extends BaseRepository {
  protected Model = Attachment
}
