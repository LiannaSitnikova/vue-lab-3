export interface UserName {
  title?: string
  first: string
  last: string
}

export interface UserLocation {
  street?: {
    number: number
    name: string
  }
  city: string
  state?: string
  country: string
  postcode?: number | string
}

export interface UserDob {
  date: string
  age: number
}

export interface User {
  id: number
  gender: 'male' | 'female'
  name: UserName
  location: UserLocation | string
  email: string
  phone: string
  cell?: string
  picture: string
  dob: UserDob
  hobbies?: string[]
  details?: string
}