import { z } from 'zod';

export const newsletterEmailSchema = z.string().trim().email().max(254);