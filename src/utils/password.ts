import bcrypt from 'bcryptjs'
import { z } from 'zod'

export async function password(value: string, ctx: z.RefinementCtx): Promise<void> {
  if (value.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'password must be at least 8 characters',
    })
    return
  }
  if (!value.match(/\d/) || !value.match(/[a-z]/i)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'password must contain at least 1 letter and 1 number',
    })
  }
}

export async function hashPassword(value: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(value, 8)
  return hashedPassword
}