import { useParams } from 'react-router'
import { useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAuth0 } from '@auth0/auth0-react'
import {
  useUserProfile,
  useUserPosts,
  useFollowers,
  useFollowing,
  useFollowUser,
  useUnfollowUser,
} from '../hooks/useProfile.js'
import FollowListModal from './FollowListModal'
import Post from './Post.js'
import Loading from './Loading.js'
import { Image } from 'cloudinary-react'

function ProfilePage() {
  const { user, getAccessTokenSilently } = useAuth0()
  const { authId } = useParams<{ authId: string }>()
  const [editMode, setEditMode] = useState(false)
  const currentAuthId = user?.sub

  // Initialise follow/unfollow mutations with current user's authId for cache invalidation
  const followMutation = useFollowUser(currentAuthId)
  const unfollowMutation = useUnfollowUser(currentAuthId)

  // Fetch user data using custom hooks
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useUserProfile(authId || '')

  const {
    data: userPosts,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useUserPosts(authId || '')

  const {
    data: followers,
    isLoading: isFollowersLoading,
    isError: isFollowersError,
    error: followersError,
  } = useFollowers(authId || '')

  const {
    data: following,
    isLoading: isFollowingLoading,
    isError: isFollowingError,
    error: followingError,
  } = useFollowing(authId || '')

  // Manage follow list modal state
  const [modalView, setModalView] = useState<'followers' | 'following' | null>(
    null,
  )

  if (!authId) {
    return <p className="text-red-500">Error: User ID not provided in URL.</p>
  }

  if (
    isProfileLoading ||
    isPostsLoading ||
    isFollowersLoading ||
    isFollowingLoading
  ) {
    return <Loading />
  }

  // Handle errors from any data fetching hook
  const errorStates = [
    { isError: isProfileError, error: profileError, label: 'profile' },
    { isError: isPostsError, error: postsError, label: 'posts' },
    { isError: isFollowersError, error: followersError, label: 'followers' },
    {
      isError: isFollowingError,
      error: followingError,
      label: 'following list',
    },
  ]

  const firstError = errorStates.find((s) => s.isError)

  if (firstError) {
    return (
      <p className="text-red-500">
        Error loading {firstError.label}:{' '}
        {firstError.error instanceof Error
          ? firstError.error.message
          : 'Unknown error'}
      </p>
    )
  }

  if (!userProfile) {
    return <p className="text-red-500">User profile not found.</p>
  }

  // Check if current user is following this profile
  const isFollowing = followers?.some((f) => f.auth_id === currentAuthId)

  // Follow button handler
  const handleFollow = async () => {
    try {
      const token = await getAccessTokenSilently()
      if (!authId) return
      followMutation.mutate({ authIdToFollow: authId, token })
    } catch (error) {
      console.error('Failed to follow user:', error)
    }
  }

  // Unfollow button handler
  const handleUnfollow = async () => {
    try {
      const token = await getAccessTokenSilently()
      if (!authId) return
      unfollowMutation.mutate({ authIdToUnfollow: authId, token })
    } catch (error) {
      console.error('Failed to unfollow user:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Profile Header */}
      <div className="mb-6 flex items-center justify-between space-x-4 rounded-lg bg-gray-800 p-6 shadow-md">
        <div className="flex gap-4">
          {/* Profile Picture */}
          <div className="flex h-48 w-48 items-center space-x-4 overflow-hidden rounded-full bg-gray-900 p-2 shadow-md">
            {userProfile.profile_picture && (
              <Image
                className="rounded-full"
                cloudName="dfjgv0mp6"
                publicId={userProfile.profile_picture}
                width="300"
                height="300"
                crop="fill"
              />
            )}
          </div>
          <div className="flex flex-col justify-center">
            {/* Name and Bio */}
            <h1 className="text-3xl font-bold text-white">
              {userProfile.name}
            </h1>
            <p className="italic text-gray-300">
              {userProfile.bio || 'No bio provided.'}
            </p>

            {/* Followers, Following, and Follow/Unfollow buttons */}
            <div className="mt-2 flex space-x-4">
              {/* Followers/Following modal buttons */}
              <div className="flex space-x-4">
                <button
                  className="flex items-center space-x-1 text-white hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  onClick={() => setModalView('followers')}
                  aria-label="View Followers"
                >
                  <i className="bi bi-people text-2xl"></i>
                </button>
                <button
                  className="flex items-center space-x-1 text-white hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  onClick={() => setModalView('following')}
                  aria-label="View Following"
                >
                  <i className="bi bi-person-check text-2xl"></i>
                </button>
              </div>

              {/* Follow/Unfollow button - only shown when viewing another user's profile */}
              {currentAuthId && currentAuthId !== authId && (
                <button
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  disabled={
                    followMutation.isPending || unfollowMutation.isPending
                  }
                  className={`ml-4 rounded px-4 py-2 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    isFollowing
                      ? 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {followMutation.isPending || unfollowMutation.isPending ? (
                    '...'
                  ) : isFollowing ? (
                    <i className="bi bi-person-dash text-2xl"></i>
                  ) : (
                    <i className="bi bi-person-add text-2xl"></i>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Edit button - only visible on own profile */}
        <div className="flex flex-col justify-start self-start">
          {user?.sub === authId && (
            <button>
              <i className="bi bi-pencil-fill text-2xl text-white "></i>
            </button>
          )}
        </div>
      </div>

      {/* Posts Section */}
      {userPosts && userPosts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {userPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No posts yet.</p>
      )}

      {/* Follow List Modals */}
      {followers && (
        <FollowListModal
          isOpen={modalView === 'followers'}
          onClose={() => setModalView(null)}
          title="Followers"
          users={followers}
        />
      )}

      {following && (
        <FollowListModal
          isOpen={modalView === 'following'}
          onClose={() => setModalView(null)}
          title="Following"
          users={following}
        />
      )}
    </div>
  )
}

export default ProfilePage
