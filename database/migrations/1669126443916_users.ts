import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
	  table.string('email', 200).unique()
	  table.string('name', 200)
	  table.string('password', 200)
	  table.string('token', 200)
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropSchemaIfExists(this.tableName)
  }
}
