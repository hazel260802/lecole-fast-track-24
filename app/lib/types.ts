import { z } from "zod";

// 1. Define the User schema
export const userSchema = z.object({
  id: z.number().int().positive(), // id should be a positive integer
  username: z.string().min(1, "Username is required"), // Username cannot be empty
  email: z.string().email("Invalid email address"), // Must be a valid email
  roles: z.array(z.string()).nonempty("At least one role is required"), // Roles must be a non-empty array of strings
  secret_phrase: z.string().min(8, "Secret phrase must be at least 8 characters long"), // Secret phrase with minimum length
  isActive: z.boolean(), // Boolean to indicate active status
});

export type User = z.infer<typeof userSchema>;
