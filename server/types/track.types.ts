import z from 'zod'

export const ItemUpdateRequestSchema = {
  params: z.object({
    trackId: z.string().openapi({ description: 'primary key of track' })
  }),
  query: z.object({
    hard: z
      .string()
      .transform((v) => v === 'true')
      .optional()
      .openapi({ description: 'Deletes file also' })
  })
}
