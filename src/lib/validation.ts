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

/**
 * Çıkma Parça Pazaryeri Schemas
 */

// Turkish license plate validation (format: 34 ABC 123 or 06 A 1234)
const turkishPlakaRegex = /^(0[1-9]|[1-7][0-9]|8[01])\s?[A-Z]{1,3}\s?\d{1,4}$/i;

export const plakaSchema = z.string()
  .transform((val) => val.toUpperCase().replace(/\s+/g, ' ').trim())
  .refine((val) => turkishPlakaRegex.test(val.replace(/\s/g, '')), {
    message: 'Geçerli bir Türkiye plakası giriniz (örn: 34 ABC 123)',
  });

// Çıkma Parça kategorileri
const cikmaParcaCategoryValues = [
  'motor', 'fren', 'suspansiyon', 'elektrik', 'sogutma',
  'sanziman', 'egzoz', 'yakit', 'kaporta', 'ic-aksesuar', 'diger'
] as const;

// Parça durumu
const parcaConditionValues = ['cok-iyi', 'iyi', 'orta', 'onarima-ihtiyaci-var'] as const;

// Çıkma Parça ilan formu
export const cikmaParcaSchema = z.object({
  title: z.string()
    .min(5, 'Başlık en az 5 karakter olmalıdır')
    .max(150, 'Başlık en fazla 150 karakter olabilir')
    .transform((val) => val.trim()),
  description: z.string()
    .min(20, 'Açıklama en az 20 karakter olmalıdır')
    .max(2000, 'Açıklama en fazla 2000 karakter olabilir')
    .transform((val) => val.trim())
    .transform((val) => val.replace(/<[^>]*>/g, '')),
  category: z.enum(cikmaParcaCategoryValues, {
    message: 'Kategori seçiniz',
  }),
  brand: brandSchema,
  model: modelSchema,
  yearFrom: z.coerce.number().int().min(1970).max(currentYear + 1).optional(),
  yearTo: z.coerce.number().int().min(1970).max(currentYear + 1).optional(),
  price: z.coerce.number()
    .positive('Fiyat pozitif olmalıdır')
    .max(10000000, 'Fiyat çok yüksek'),
  condition: z.enum(parcaConditionValues, {
    message: 'Parça durumunu seçiniz',
  }),
  oemCode: z.string().max(50).optional(),
  location: citySchema,
});

// Parça teklif formu
export const cikmaParcaTeklifSchema = z.object({
  parcaId: z.coerce.number().int().positive('Geçerli bir parça seçiniz'),
  senderName: nameSchema,
  senderPhone: phoneSchema,
  message: z.string()
    .min(10, 'Mesaj en az 10 karakter olmalıdır')
    .max(1000, 'Mesaj en fazla 1000 karakter olabilir')
    .transform((val) => val.trim())
    .transform((val) => val.replace(/<[^>]*>/g, '')),
  offeredPrice: z.coerce.number().positive().optional(),
});

/**
 * Park Mesaj (Hatalı Park Bildirimi) Schemas
 */

const parkMesajTypeValues = ['cift-park', 'engel', 'is-yeri-onunde', 'diger'] as const;

// Park mesajı gönderme formu
export const parkMesajSchema = z.object({
  targetPlaka: plakaSchema,
  senderPhone: phoneSchema,
  messageType: z.enum(parkMesajTypeValues, {
    message: 'Mesaj türü seçiniz',
  }),
  message: z.string()
    .min(10, 'Mesaj en az 10 karakter olmalıdır')
    .max(500, 'Mesaj en fazla 500 karakter olabilir')
    .transform((val) => val.trim())
    .transform((val) => val.replace(/<[^>]*>/g, '')),
  locationDescription: z.string().max(200).optional(),
});

// Plaka kayıt formu
export const plakaKayitSchema = z.object({
  plaka: plakaSchema,
  ownerPhone: phoneSchema,
  ownerEmail: emailSchema.optional(),
  brand: brandSchema.optional(),
  model: modelSchema.optional(),
  year: yearSchema.optional(),
  kvkkConsent: z.boolean().refine((val) => val === true, {
    message: 'KVKK onayı gereklidir',
  }),
});

export type CikmaParcaInput = z.infer<typeof cikmaParcaSchema>;
export type CikmaParcaTeklifInput = z.infer<typeof cikmaParcaTeklifSchema>;
export type ParkMesajInput = z.infer<typeof parkMesajSchema>;
export type PlakaKayitInput = z.infer<typeof plakaKayitSchema>;
