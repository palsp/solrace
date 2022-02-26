import Boom from '@hapi/boom'

interface ErrorPayload {
  statusCode: number
  payload: any
}

export function getErrorAndStatusCode(err): ErrorPayload {
  if (Boom.isBoom(err)) {
    return { statusCode: err.output.statusCode, payload: err.output.payload }
  }

  if (err.error?.isJoi) {
    return {
      statusCode: 400,
      payload: { type: err.type, message: err.error.toString() },
    }
  }

  return {
    statusCode: err.status || 500,
    payload: { status: 'error', error: 'Something went wrong.' },
  }
}
