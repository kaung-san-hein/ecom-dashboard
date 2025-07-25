import { z } from "zod"

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Category = z.infer<typeof categorySchema>

export const categoryListSchema = z.array(categorySchema)