/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('users').insert([
    { id: 1, name: 'Sofia', bio: '', font: '', profile_picture: '' },
    { id: 2, name: 'Nikola', bio: '', font: '', profile_picture: '' },
    { id: 3, name: 'Patrick', bio: '', font: '', profile_picture: '' },
    { id: 4, name: 'Matt', bio: '', font: '', profile_picture: '' },
    { id: 5, name: 'James', bio: '', font: '', profile_picture: '' },
    { id: 6, name: 'Vaughan', bio: '', font: '', profile_picture: '' },
  ])
}
