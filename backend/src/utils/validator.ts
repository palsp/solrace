import { createValidator } from 'express-joi-validation'

export const validate = createValidator({ passError: true })
