interface UserProfile {
  id: number
  username: string
  email: string
  profilePicture: string | null
  createdAt?: string
  updatedAt?: string
}

export type { UserProfile }