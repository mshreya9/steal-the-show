export interface User {
  uid: string
  name: string
  mobile: string
  email?: string
}

export type AuthStatus = 'logged-out' | 'loading' | 'logged-in'
