import { z } from 'zod'

export type RequestSchema = {
  params?: z.ZodType
  query?: z.ZodType
  body?: z.ZodType
  headers?: z.ZodType
}
