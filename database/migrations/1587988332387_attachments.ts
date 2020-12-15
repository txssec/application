import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttachmentsSchema extends BaseSchema {
  protected tableName = 'attachments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('application_id').unsigned().index()
      table.foreign('application_id').references('id').inTable('applications').onDelete('cascade')

      table.enu('type', ['avatar', 'rg', 'cnh', 'id'])
      table.string('name').notNullable()
      table.string('icon').notNullable()
      table.string('path', 255).notNullable()
      table.string('size', 255).unsigned().notNullable()
      table.string('original_name', 100).notNullable()
      table.string('extension', 10).notNullable()
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
