import { Request } from 'express'
import { z } from 'zod'
import { logger } from './logger'
import { RequestSchema } from './types/base.types'

export const validateRequest = <T extends RequestSchema> (req: Request, schema: T) => {
  const validationResult = z.object(schema).safeParse({
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers
  })

  if (!validationResult.success) {
    const issues = validationResult.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.code}`)
      .join(', ')

    logger.warn(`[Validation]: Request validation failed for ${req.method} ${req.url}: ${issues}`)

    return undefined
  }

  return validationResult.data
}

