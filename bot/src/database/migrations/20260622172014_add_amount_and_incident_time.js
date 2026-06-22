exports.up = function(knex) {
return knex.schema.alterTable('problem_reports', (table) => {
table.decimal('amount', 15, 2).nullable();
table.string('incident_time').nullable();
});
};

exports.down = function(knex) {
return knex.schema.alterTable('problem_reports', (table) => {
table.dropColumn('amount');
table.dropColumn('incident_time');
});
};
