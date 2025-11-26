/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('likes').insert([
    { user_id: 1, post_id: 1, reply_id: 1 },
    { user_id: 2, post_id: 2, reply_id: 2 },
  ])
}
