/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // This reset script is designed for SQLite and is essential for a clean,
  // predictable test and development environment.
  //
  // 1. Foreign key checks are temporarily disabled to allow for the deletion
  //    of all table data without constraint violations.
  //
  // 2. The 'sqlite_sequence' table (which tracks auto-incrementing IDs)
  //    is manually cleared to ensure that primary keys are reset to 1 after
  //    every seed run. This is crucial for predictable and repeatable tests.

  // Changed up the format of what was happening before because postgres doesnt like it
  
  const tables = ['likes', 'comments', 'posts', 'followers', 'users'];

  // Truncate all tables and reset their identity counters
  await knex.raw(`
    TRUNCATE TABLE
      ${tables.join(', ')}
    RESTART IDENTITY CASCADE;
  `);
}