exports.up = async (knex, Promise) => {
  // Create the 'roles' table first because
  // the 'members' table has a foreign key to it
  return knex.schema
    .createTable('roles', table => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('type').notNullable()
    })

    .createTable('members', table => {
      table.increments('id')
      table.string('first_name')
      table.string('last_name')
      table
        .string('email')
        .unique()
        .notNullable()
      table.boolean('email_validated').defaultTo(false)
      table.string('email_validation_token')
      table.string('password_reset_token')
      table.string('password').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
      table
        .string('role_id')
        .notNullable()
        .defaultTo('1')
        .references('id')
        .inTable('roles')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
}

exports.down = async (knex, Promise) => {
  await knex.raw('DROP TABLE roles CASCADE')
  await knex.raw('DROP TABLE members CASCADE')
  return
}
