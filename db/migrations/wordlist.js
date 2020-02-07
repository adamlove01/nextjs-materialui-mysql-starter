exports.up = async (knex, Promise) => {
  // Create the 'types' table first because
  // the 'words' table has a foreign key to it
  return knex.schema
    .createTable('types', table => {
      table.increments('id')
      table.text('name').notNullable()
    })
    .createTable('words', table => {
      table.increments('id')
      table.text('word').notNullable()
      table
        .integer('type_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('types')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
}

exports.down = async (knex, Promise) => {
  await knex.raw('DROP TABLE wordlist.types CASCADE')
  await knex.raw('DROP TABLE wordlist.words CASCADE')
  return
}
