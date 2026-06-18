/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // 1. Table to store the valid ATM numbers and names
    .createTable('atms', (table) => {
      table.string('atm_number').primary(); // Unique ID like "ATM-001"
      table.string('name').notNullable();    // Location or branch name
    })
    // 2. Table to store user support reports
    .createTable('problem_reports', (table) => {
      table.increments('id').primary();                     // Auto-incrementing ID
      table.bigInteger('telegram_id').notNullable();        // User's Telegram account ID
      table.string('language', 5).notNullable();            // Selected language code (en/ru)
      table.string('atm_number').notNullable();             // Target ATM
      table.string('client_number').notNullable();          // Client identification string
      table.text('problem_description').notNullable();      // Text issue sent by user
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Date & Time of report

      // Link the report's atm_number to our atms table
      table.foreign('atm_number').references('atm_number').inTable('atms').onDelete('CASCADE');
      table.string('card_number', 20).nullable()
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('problem_reports')
    .dropTableIfExists('atms');
};
