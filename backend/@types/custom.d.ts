declare namespace Express {
  export interface Request {
    user?: import('entity/User').User
  }
}
