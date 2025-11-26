/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('posts').insert([
    {
      user_id: 1,
      date_added: 1764227880,
      message: '',
      image: 'test-image-1',
      font: '',
      char_limit: 10,
      public: true,
    },
    {
      user_id: 2,
      date_added: 1764213600,
      message: '',
      image: 'test-image-2',
      font: '',
      char_limit: 10,
      public: true,
    },
    {
      user_id: 2,
      date_added: 1764127260,
      message: '',
      image: 'test-image-3',
      font: '',
      char_limit: 10,
      public: true,
    },
    {
      user_id: 3,
      date_added: 1764103260,
      message: '',
      image: 'test-image-4',
      font: '',
      char_limit: 10,
      public: true,
    },
  ])
}
