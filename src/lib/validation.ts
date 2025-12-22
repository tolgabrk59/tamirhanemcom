import { z } from 'zod';

/**
 * Common validation schemas for the application
 */

// Turkish phone number validation
const turkishPhoneRegex = /^(\+90|0)?[5][0-9]{9}$/;

// Email validation
const emailSchema = z.string().email('Geçerli bir e-posta adresi giriniz');

// Phone validation with normalization
export const phoneSchema = z.string()
  .transform((val) => val.replace(/[\s\-\(\)]/g, '')) // Remove spaces, dashes, parentheses
  .refine((val) => turkishPhoneRegex.test(val), {
    message: 'Geçerli bir Türkiye cep telefonu numarası giriniz',
  });

// Year validation
const currentYear = new Date().getFullYear();
export const yearSchema = z.coerce.number()
  .int()
  .min(1990, 'Yıl 1990 veya sonrası olmalıdır')
  .max(currentYear + 1, `Yıl ${currentYear + 1} veya öncesi olmalıdır`);

// Safe text input (prevents XSS)
export const safeTextSchema = z.string()
  .transform((val) => val.trim())
  .transform((val) => val.replace(/<[^>]*>/g, '')) // Strip HTML tags
  .transform((val) => val.replace(/[<>\"\']/g, '')); // Remove potentially dangerous chars

// Name validation
export const nameSchema = z.string()
  .min(2, 'Ad en az 2 karakter olmalıdır')
  .max(100, 'Ad en fazla 100 karakter olabilir')
  .transform((val) => val.trim())
  .transform((val) => val.replace(/<[^>]*>/g, ''));

// Vehicle brand validation
export const brandSchema = z.string()
  .min(1, 'Marka seçiniz')
  .max(50, 'Marka adı çok uzun')
  .transform((val) => val.trim());

// Vehicle model validation
export const modelSchema = z.string()
  .min(1, 'Model seçiniz')
  .max(100, 'Model adı çok uzun')
  .transform((val) => val.trim());

// City validation
export const citySchema = z.string()
  .min(2, 'Şehir seçiniz')
  .max(50, 'Şehir adı çok uzun')
  .transform((val) => val.trim());

// Notes/description validation
export const notesSchema = z.string()
  .max(500, 'Açıklama en fazla 500 karakter olabilir')
  .optional()
  .transform((val) => val?.trim())
  .transform((val) => val?.replace(/<[^>]*>/g, ''));

// OBD code validation
export const obdCodeSchema = z.string()
  .min(1, 'OBD kodu giriniz')
  .max(10, 'OBD kodu çok uzun')
  .transform((val) => val.trim().toUpperCase());

/**
 * Form Schemas
 */

// Waitlist form
export const waitlistSchema = z.object({
  email: emailSchema.optional().nullable(),
  phone: phoneSchema.optional().nullable(),
  name: nameSchema.optional().nullable(),
}).refine((data) => data.email || data.phone, {
  message: 'E-posta veya telefon numarası gereklidir',
});

// Randevu (Appointment) form
export const randevuSchema = z.object({
  phone: phoneSchema,
  name: nameSchema.optional(),
  city: citySchema,
  brand: brandSchema,
  model: modelSchema,
  year: yearSchema.optional(),
  category: z.string().min(1, 'Kategori seçiniz'),
  notes: notesSchema,
});

// Vehicle selection form
export const vehicleSelectSchema = z.object({
  brand: brandSchema,
  model: modelSchema,
  year: yearSchema.optional(),
  paket: z.string().optional(),
});

// AI research request
export const aiResearchSchema = z.object({
  brand: brandSchema,
  model: modelSchema,
  year: yearSchema,
  paket: z.string().optional(),
});

// OBD search request
export const obdSearchSchema = z.object({
  code: obdCodeSchema.optional(),
  query: z.string().max(200).optional(),
  brand: brandSchema.optional(),
  model: modelSchema.optional(),
});

// Admin login
export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Şifre gereklidir'),
});

/**
 * Validation helper function
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodIssue[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error.issues };
}

/**
 * Format Zod errors for API response
 */
export function formatValidationErrors(errors: z.ZodIssue[]): string {
  return errors.map((err) => err.message).join(', ');
}

export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type RandevuInput = z.infer<typeof randevuSchema>;
export type VehicleSelectInput = z.infer<typeof vehicleSelectSchema>;
export type AIResearchInput = z.infer<typeof aiResearchSchema>;
export type OBDSearchInput = z.infer<typeof obdSearchSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
