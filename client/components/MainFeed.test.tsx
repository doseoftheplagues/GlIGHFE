/**
 * @vitest-environment jsdom
 */

import '../tests/setup'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import MainFeed from './MainFeed'
import { usePosts } from '../hooks/usePosts'
import { Post } from '../../models/post'

// Mock the usePosts hook to control its behavior in tests
vi.mock('../hooks/usePosts', () => ({
  usePosts: vi.fn(),
}))

describe('MainFeed component', () => {
  it('should display a loading message when posts are loading', () => {
    // Arrange: Mock usePosts to return isLoading: true
    vi.mocked(usePosts).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
    } as ReturnType<typeof usePosts>) // Cast to satisfy TypeScript

    // Act: Render the MainFeed component
    render(<MainFeed />)

    // Assert: Check if the loading message is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should display an error message when fetching posts fails', () => {
    // Arrange: Mock usePosts to return isError: true
    vi.mocked(usePosts).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isSuccess: false,
    } as ReturnType<typeof usePosts>)

    // Act: Render the MainFeed component
    render(<MainFeed />)

    // Assert: Check if the error message is displayed
    expect(screen.getByText('Error fetching posts')).toBeInTheDocument()
  })

  it('should display a list of posts when data is successfully fetched', async () => {
    // Arrange: Mock usePosts to return a list of posts
    const mockPosts: Post[] = [
      {
        id: 1,
        userId: 1,
        userName: 'Sofia',
        imageUrl: 'http://example.com/image1.jpg',
        message: 'First post!',
        dateAdded: 1678886400,
      },
      {
        id: 2,
        userId: 2,
        userName: 'Nikola',
        imageUrl: 'http://example.com/image2.jpg',
        message: 'Second post here.',
        dateAdded: 1678886500,
      },
    ]

    vi.mocked(usePosts).mockReturnValue({
      data: mockPosts,
      isLoading: false,
      isError: false,
      isSuccess: true,
    } as ReturnType<typeof usePosts>)

    // Act: Render the MainFeed component
    render(<MainFeed />)

    // Assert: Check if the post content is displayed
    // Use waitFor to handle potential async rendering after data is loaded
    await waitFor(() => {
      expect(screen.getByText('Main Feed')).toBeInTheDocument() // Check for the header
      expect(screen.getByText('Sofia')).toBeInTheDocument()
      expect(screen.getByText('First post!')).toBeInTheDocument()
      expect(screen.getByText('Nikola')).toBeInTheDocument()
      expect(screen.getByText('Second post here.')).toBeInTheDocument()
      expect(screen.getAllByRole('img')).toHaveLength(2) // Check for images
    })
  })
})
