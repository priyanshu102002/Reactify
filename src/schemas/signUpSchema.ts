import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(2, "Username must be at least 2 characters long")
	.max(20, "Must be at most 20 characters long")
	.regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers");

export const signupSchema = z.object({
	username: usernameValidation,
	email: z
		.string()
		.email({ message: "Please provide a valid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});
