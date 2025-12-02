import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import knex from 'knex'
import config from './knexfile'
import * as db from './users'

const testDb = knex(config.test)

// Run migrations once before all tests
beforeAll(async () => {
  await testDb.migrate.latest()
})

// Seed the database before each test
beforeEach(async () => {
  // Clear tables in correct order (respecting foreign keys)
  await testDb('followers').del()
  await testDb('posts').del()
  await testDb('users').del()

  // Seed only the data needed for these tests
  await testDb('users').insert([
    {
      id: 1,
      auth_id: '1',
      name: 'Sofia',
      bio: '',
      font: '',
      profile_picture: 'kitten',
    },
    {
      id: 2,
      auth_id: '2',
      name: 'Nikola',
      bio: '',
      font: '',
      profile_picture: 'uploads/kittenturtle-1764290190072',
    },
    {
      id: 3,
      auth_id: '3',
      name: 'Patrick',
      bio: '',
      font: '',
      profile_picture: '',
    },
    {
      id: 4,
      auth_id: '4',
      name: 'Matt',
      bio: '',
      font: '',
      profile_picture: 'uploads/kittenburger-1764290785759',
    },
    {
      id: 7,
      auth_id: 'google-oauth2|116118796709799810524',
      name: 'Matt v2',
      bio: 'Just a regular Matt, enjoying the G(ood)-life.',
      font: '',
      profile_picture: '',
    },
  ])

  // Seed posts (Sofia has 1 post)
  await testDb('posts').insert([
    {
      id: 1,
      user_id: '1',
      image: '',
      message: 'Sofia post',
      date_added: '1678886400',
    },
  ])

  // Seed followers
  await testDb('followers').insert([
    { follower_id: '2', following_id: '1' }, // Nikola follows Sofia
    { follower_id: '3', following_id: '1' }, // Patrick follows Sofia
    { follower_id: 'google-oauth2|116118796709799810524', following_id: '1' }, // Matt v2 follows Sofia
    { follower_id: '2', following_id: '3' }, // Nikola follows Patrick
  ])
})

// Close the database connection after all tests
afterAll(async () => {
  await testDb.destroy()
})

describe('getUserProfile', () => {
  it('should return a user profile for a given authId', async () => {
    const authId = 'google-oauth2|116118796709799810524' // Matt v2's authId from seed
    const user = await db.getUserProfile(authId, testDb)

    expect(user).toBeDefined()
    expect(user.name).toBe('Matt v2')
  })

  it('should return undefined for a non-existent authId', async () => {
    const authId = 'non-existent-id'
    const user = await db.getUserProfile(authId, testDb)

    expect(user).toBeUndefined()
  })
})

describe('getUserPosts', () => {
  it('should return all posts for a user with a given authId', async () => {
    // User 'Sofia' (auth_id: '1') has 1 post in the seed data
    const authId = '1'
    const posts = await db.getUserPosts(authId, testDb)

    expect(posts).toHaveLength(1)
    expect(posts[0].userName).toBe('Sofia')
  })

  it('should return an empty array if a user has no posts', async () => {
    // User 'Matt v2' has no posts in the seed data
    const authId = 'google-oauth2|116118796709799810524'
    const posts = await db.getUserPosts(authId, testDb)

    expect(posts).toHaveLength(0)
  })
})

describe('getFollowers', () => {
  it('should return followers for a given authId', async () => {
    // Sofia (auth_id: '1') is followed by Nikola (id:2), Patrick (id:3), and Matt v2 (id:7)
    const authId = '1'
    const followers = await db.getFollowers(authId, testDb)

    expect(followers).toBeDefined()
    expect(followers).toHaveLength(3)
    expect(followers.map((f) => f.name)).toEqual(
      expect.arrayContaining(['Nikola', 'Patrick', 'Matt v2']),
    )
  })

  it('should return an empty array if no followers are found', async () => {
    // User 4 (Matt) has no followers in the seed data
    const authId = '4'
    const followers = await db.getFollowers(authId, testDb)

    expect(followers).toBeDefined()
    expect(followers).toHaveLength(0)
  })
})

describe('getFollowing', () => {
  it('should return users a given authId is following', async () => {
    // Nikola (auth_id: '2') follows Sofia (id:1) and Patrick (id:3)
    const authId = '2'
    const following = await db.getFollowing(authId, testDb)

    expect(following).toBeDefined()
    expect(following).toHaveLength(2)
    expect(following.map((f) => f.name)).toEqual(
      expect.arrayContaining(['Sofia', 'Patrick']),
    )
  })

  it('should return an empty array if no users are being followed', async () => {
    // User 4 (Matt) is not following anyone in the seed data
    const authId = '4'
    const following = await db.getFollowing(authId, testDb)

    expect(following).toBeDefined()
    expect(following).toHaveLength(0)
  })
})
