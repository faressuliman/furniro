import * as z from "zod"

export const loginSchema = z.object({
    identifier: z.string().trim().nonempty({ message: "Email is required" }).email({ message: "Invalid email format" }),
    password: z.string().trim().nonempty({ message: "Password is required" })
})

export const registerSchema = z.object({
    first_name: z.string().trim().nonempty({ message: "First Name is required" }),
    last_name: z.string().trim().nonempty({ message: "Last Name is required" }),
    identifier: z.string().trim().nonempty({ message: "Email is required" }).email({ message: "Invalid email format" }),
    password: z.string().trim().nonempty({ message: "Password is required" }).min(6, {message :"Password must be at least 6 characters"})
})