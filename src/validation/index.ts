import * as z from "zod"

export const loginSchema = z.object({
    email: z.string().trim().nonempty({ message: "Email is required" }).email({ message: "Invalid email format" }),
    password: z.string().trim().nonempty({ message: "Password is required" })
})

export const registerSchema = z.object({
    first_name: z.string().trim().nonempty({ message: "First Name is required" }),
    last_name: z.string().trim().nonempty({ message: "Last Name is required" }),
    email: z.string().trim().nonempty({ message: "Email is required" }).email({ message: "Invalid email format" }),
    password: z.string().trim().nonempty({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" })
})

export const forgotPasswordSchema = z.object({
    email: z.string().trim().nonempty({ message: "Email is required" }).email({ message: "Invalid email format" }),
})

export const resetPasswordSchema = z.object({
    password: z.string().trim().nonempty({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z.string().trim().nonempty({ message: "Confirm Password is required" }),
}).refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
})

export const checkoutSchema = z.object({
    first_name: z.string().trim().nonempty({ message: "First Name is required" }),
    last_name: z.string().trim().nonempty({ message: "Last Name is required" }),
    email: z.string().trim().nonempty({ message: "Email is required" }).email({ message: "Invalid email format" }),
    phone: z.string().trim().nonempty({ message: "Phone is required" }),
    address: z.string().trim().nonempty({ message: "Address is required" }),
    city: z.string().trim().nonempty({ message: "City is required" }),
    postal_code: z.string().trim().optional(),
    order_notes: z.string().trim().optional(),
    card_number: z.string().trim().optional(),
    payment_method: z.enum(["card", "cod"]),
})
    .refine(
        (data) =>
            data.payment_method !== "card" ||
            (data.card_number !== undefined && data.card_number !== ""),
        {
            path: ["card_number"],
            message: "Card number is required when paying by card",
        }
    )