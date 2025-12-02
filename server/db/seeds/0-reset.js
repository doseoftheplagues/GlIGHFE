/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// export async function seed(knex) {
//   // Changed up the format of what was happening before because postgres doesnt like it

//   const tables = ['likes', 'comments', 'posts', 'followers', 'users'];

//   // Truncate all tables and reset their identity counters
//   await knex.raw(`
//     TRUNCATE TABLE
//       ${tables.join(', ')}
//     RESTART IDENTITY CASCADE;
//   `);
// }

// updated in branch ‹feat/follow-unfollow-button› for testing integration with sqlite
export async function seed(knex) {
  // Check if we're using PostgreSQL or SQLite
  const isPostgres = knex.client.config.client === 'pg'

  if (isPostgres) {
    // PostgreSQL: Use TRUNCATE for better performance
    await knex.raw(`
      TRUNCATE TABLE
        likes, comments, posts, followers, users
      RESTART IDENTITY CASCADE
    `)
  } else {
    // SQLite: Use DELETE
    await knex('likes').del()
    await knex('comments').del()
    await knex('posts').del()
    await knex('followers').del()
    await knex('users').del()
  }
}
