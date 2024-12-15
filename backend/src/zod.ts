import { z } from "zod";

export const signupBody = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().refine((value) => /^[0-9]{10}$/.test(value),{ message: "Must be a valid 10-digit number" }),
    password: z.string().min(4),
    role: z.string()
})

export const signinBody = z.object({
    email: z.string().email(),
    password: z.string().min(4)
})