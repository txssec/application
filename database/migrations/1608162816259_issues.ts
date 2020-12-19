import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Issues extends BaseSchema {
  protected tableName = 'issues'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('application_id').unsigned().index()
      table.foreign('application_id').references('id').inTable('applications').onDelete('cascade')

      table.string('key').notNullable()
      table.string('description').nullable()
      table.boolean('required').notNullable()

      table.enu('input_type', ['text', 'file', 'date', 'object', 'none']).defaultTo('none')
      table
        .enu('resource_type', [
          'avatar',
          'rg',
          'cnh',
          'id',
          'proof_of_address',
          'email',
          'phone',
          'cellphone',
          'facebook',
          'instagram',
          'linkedin',
          'site',
          'github',
          'mock',
          'none',
        ])
        .defaultTo('none')

      table.string('response').nullable()
      table.string('response_file').nullable()
      table.string('cancelation_reason').nullable()
      table.string('reprovation_reason').nullable()
      table.string('token', 255).notNullable().unique()
      table.string('from_token', 255).nullable()

      table
        .enu('status', ['pendent', 'approved', 'answered', 'reproved', 'canceled', 'deleted'])
        .defaultTo('pendent')

      table.dateTime('reproved_at').nullable()
      table.dateTime('approved_at').nullable()

      table.timestamps()
      table.dateTime('deleted_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
