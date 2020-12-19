import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttachmentsSchema extends BaseSchema {
  protected tableName = 'attachments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('application_id').unsigned().index()
      table.foreign('application_id').references('id').inTable('applications').onDelete('cascade')

      table.enu('type', ['avatar', 'rg', 'cnh', 'id', 'proof_of_address', 'mock'])
      table.string('name').notNullable()
      table.string('icon').notNullable()

      table.string('path_front', 255).nullable()
      table.string('path_back', 255).nullable()

      // {
      //  path_front: { size: 10mb, original_name: 'original', extension: 'png' },
      //  path_back: null
      // }
      table.json('mime').notNullable()

      // {
      //  document: { emission: '1234523432', expiration_date: '1231231231' }
      // }
      table.json('document').nullable()

      table.string('token', 255).notNullable().unique()
      table.string('from_token', 255).nullable()

      table.enu('status', ['pendent', 'approved', 'reproved', 'deleted']).defaultTo('pendent')
      table.timestamps(true)
      table.dateTime('deleted_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
