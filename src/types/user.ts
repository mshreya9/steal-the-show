export interface User {
  name: string
  mobile?: string
  email?: string
  authMethod: 'mobile' | 'email' | 'google' | 'apple'
}

export type AuthStatus = 'logged-out' | 'verifying-mobile' | 'verifying-email' | 'logged-in'
