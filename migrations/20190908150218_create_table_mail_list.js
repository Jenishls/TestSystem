
exports.up = async function(knex,Promise) {
  await knex.schema.hasTable('mail_list')

  return await knex.schema.createTable('mail_list',(table) => {
  	table.increments('id')
  	table.string('name').notNullable()
  	table.timestamp('created_at').notNullable().defaultTo(knex.raw('getutcdate()'));
    table.timestamp('updated_at');
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTableIfExists('mail_list')
};


