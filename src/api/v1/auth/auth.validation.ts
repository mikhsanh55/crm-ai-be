import { z } from "zod";
import { password, hashPassword } from "@/utils/password";

export const register = z.strictObject({
    name: z.string(),
    email: z.string().email(),
    password: z.string().superRefine(password).transform(hashPassword),
})

export const login = z.strictObject({
    email: z.string().email(),
    password: z.string().min(8)
})