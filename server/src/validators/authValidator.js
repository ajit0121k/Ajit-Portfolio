import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or identifier is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

export const sendOtpSchema = z.object({
  identifier: z.string().min(1, 'Mobile number or Email is required'),
  method: z.enum(['mobile', 'email']).optional(),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().optional(),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  tempToken: z.string().optional(),
});

export const refreshSchema = z.object({});
