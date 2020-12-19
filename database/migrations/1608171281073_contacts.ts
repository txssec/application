import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Contacts extends BaseSchema {
  protected tableName = 'contacts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('application_id').unsigned().index()
      table.foreign('application_id').references('id').inTable('applications').onDelete('cascade')

      table.string('title', 25)
      table.string('icon', 25)
      table
        .enu('type', [
          'email',
          'phone',
          'cellphone',
          'facebook',
          'instagram',
          'linkedin',
          'site',
          'github',
        ])
        .notNullable()
      table.string('contact', 100)
      table.string('token', 255).notNullable().unique()
      table.string('from_token', 255).nullable()

      table.enu('status', ['pendent', 'approved', 'reproved', 'deleted']).defaultTo('pendent')

      table.timestamps()
      table.dateTime('deleted_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
