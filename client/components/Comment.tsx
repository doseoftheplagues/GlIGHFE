import { useNavigate } from 'react-router'
import { CommentWithAuthor } from '../../models/comment'
import { Image } from 'cloudinary-react'

export function Comment({ commentData }: { commentData: CommentWithAuthor }) {
  const publicId = commentData.profilePicture
  const navigate = useNavigate()

  function handleProfileClick() {
    navigate(`/profile/${commentData.userId}`)
  }

  return (
    <div className="mb-2 flex flex-row gap-4 rounded-lg border bg-white p-2">
      <div className="flex h-14 max-h-14 w-14 max-w-14 items-center justify-center overflow-hidden rounded-full  p-1 shadow-sm">
        <button onClick={handleProfileClick}>
          <Image
            className="h-14 max-h-14 w-14 max-w-14 rounded-full border-2 border-[#9cc574]"
            cloudName="dfjgv0mp6"
            publicId={publicId}
            alt={commentData.userName + "'s profile"}
            crop="fill"
          />
        </button>
      </div>

      {commentData.message && (
        <p className="flex items-center justify-center">
          {commentData.message}
        </p>
      )}
    </div>
  )
}
export default Comment
