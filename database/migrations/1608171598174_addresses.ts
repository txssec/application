import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('application_id').unsigned().index()
      table.foreign('application_id').references('id').inTable('applications').onDelete('cascade')

      table.string('title', 50)
      table.string('icon', 25)
      table.string('street', 100).notNullable()
      table.string('number', 50).notNullable()
      table.string('district', 100).notNullable()
      table.string('complement', 100)
      table.string('city', 100).notNullable()
      table.string('state', 50).notNullable()
      table.string('country', 50).notNullable()
      table.string('zip_code', 15).notNullable()
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
