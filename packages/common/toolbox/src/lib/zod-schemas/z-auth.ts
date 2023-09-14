import { z } from 'zod'

export const zEmail = z.string().email('Valid email required')
export const zPassword = z.string().nonempty('Password is required').min(8, 'Password must be at least 8 characters')
export const zAuthToken = z.string().min(6, 'Valid token required')
