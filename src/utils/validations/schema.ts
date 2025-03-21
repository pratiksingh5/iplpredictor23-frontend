import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  instaUsername: z
  .string()
  .min(1, "Instagram username is required"),
  email: z.string().email("Invalid email format"),
  password: z
  .string()
  .min(6, "Password must be at least 6 characters long"),
  picturePath: z.string().url().nullable().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  instaUsername: z.string().min(1),
  picturePath: z.string().url().nullable().optional(),
});


export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const updatePasswordSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    OTP: z.string().min(6, "OTP must be at least 4 characters"),
    newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
