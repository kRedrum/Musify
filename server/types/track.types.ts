import z from 'zod'

export const ItemUpdateRequestSchema = {
  query: z.object({
    hard: z
      .string()
      .transform((v) => v === 'true')
      .optional()
  })
}
