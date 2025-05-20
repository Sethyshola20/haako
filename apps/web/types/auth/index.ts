import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export const registerSchema = loginSchema.extend({
    firstName: z.string().min(3, {message: 'Name must be at least 3 characters'}),
    lastName: z.string().min(3, {message: 'Name must be at least 3 characters'}),
    email: z.string().email({message: 'Invalid email address'}),
    password: z
        .string()
        .min(8, { message: "Password needs to have at least 8 characters" })
        .regex(passwordRegex, {
            message:
                "Password needs to have at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character",
        }),
    confirmPassword: z.string(),
    city: z.string(),
    country: z.string(),
    address1: z.string(),
    dateOfBirth: z.string(),
    state: z.string(),
    ssn: z.string(),
    postalCode: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
export type LoginFormDataType = z.infer<typeof loginSchema>
export type RegisterFormDataType = z.infer<typeof registerSchema>