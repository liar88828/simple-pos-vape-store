import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional(),
});
// 2. Infer TypeScript type (optional but useful)
export type LoginFormData = z.infer<typeof loginSchema>;
// 3. Inside your component

export const registerSchema = z
.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Minimum 6 characters"),
})
.superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: [ "confirmPassword" ], // <- tell Zod where the error should go
        });
    }
});
export type RegisterFormData = z.infer<typeof registerSchema>;