export interface User {
  email: string,
  password: string,
}

export interface Category {
  name: string,
  imageSrc?: string,
  user?: string,
  _id?: string,
}

export interface Message {
  message: string,
}

export interface Position {
  name: string,
  cost: number,
  category: string,
  _id?: string,
  user?: string,
}
