import { z } from "zod"

const brandSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Brand = z.infer<typeof brandSchema>

export const brandListSchema = z.array(brandSchema) 