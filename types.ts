export interface Post {
  id: number
  userId: string
  name: string
  image: string
  text: string
  picture: string
  createdAt: string
  likes: Like[]
}

export interface Like {
  id: number
  userId: string
  postId: number
  createdAt: string
}
