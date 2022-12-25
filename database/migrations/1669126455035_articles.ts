import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
	  table.string('title', 200)
	  table.text('description').nullable()
	  table.string('image', 200)
      table.integer('user_id')
			.unsigned()
			.references('users.id')
			.onDelete('CASCADE')
      table.timestamps()
      table.boolean('delete_status').defaultTo(false)
    })
  }

  public async down () {
    this.schema.dropSchemaIfExists(this.tableName)
  }
}
