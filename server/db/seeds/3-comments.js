/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('comments').insert([
    {
      user_id: '1',
      post_id: 1,
      message: 'test-message-1',
      image: '',
      font: '',
    },
    {
      user_id: '2',
      post_id: 2,
      message: 'test-message-2',
      image: '',
      font: '',
    },
  ])
}
