export interface CommentData {
  postId: number
  userId: string
  message: string
  image: string
  font: string
}

export interface Comment extends CommentData {
  id: number
}

export interface CommentWithAuthor extends Comment {
  userName: string
  profilePicture: string
}
