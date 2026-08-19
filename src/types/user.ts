export interface User {
  uid: string
  name: string
  mobile: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
}

export type AuthStatus = 'logged-out' | 'loading' | 'logged-in'
