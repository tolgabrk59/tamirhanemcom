import { z } from "zod";

// Phone validation (Turkish mobile)
export const phoneSchema = z.string()
  .regex(/^[5][0-9]{9}$/, "Geçersiz telefon numarası formatı")
  .transform(val => val.replace(/[\s\-\+]/g, "").replace(/^90/, ""));

// Name validation
export const nameSchema = z.string()
  .min(2, "İsim en az 2 karakter olmalı")
  .max(100, "İsim çok uzun")
  .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "İsim sadece harflerden oluşmalı");

// OTP code validation
export const otpCodeSchema = z.string()
  .length(6, "Doğrulama kodu 6 haneli olmalı")
  .regex(/^[0-9]+$/, "Sadece rakam giriniz");

// Year validation
export const yearSchema = z.number()
  .int("Yıl tam sayı olmalı")
  .min(1990, "Yıl 1990'dan büyük olmalı")
  .max(new Date().getFullYear() + 1, "Geçersiz yıl");

// City validation
export const citySchema = z.string()
  .min(2, "Şehir adı gerekli")
  .max(50, "Şehir adı çok uzun");

// District validation
export const districtSchema = z.string()
  .min(2, "İlçe adı gerekli")
  .max(50, "İlçe adı çok uzun");

// Brand validation
export const brandSchema = z.string()
  .min(1, "Marka gerekli")
  .max(50, "Marka adı çok uzun");

// Model validation
export const modelSchema = z.string()
  .min(1, "Model gerekli")
  .max(50, "Model adı çok uzun");

// Category validation
export const categorySchema = z.string()
  .min(1, "Kategori gerekli")
  .max(100, "Kategori adı çok uzun")
  .optional();

// Notes validation
export const notesSchema = z.string()
  .max(1000, "Notlar çok uzun")
  .optional();

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// === API Request Schemas ===

// OTP Send Request
export const otpSendSchema = z.object({
  phone: z.string().min(10, "Telefon numarası gerekli"),
});

// OTP Verify Request
export const otpVerifySchema = z.object({
  phone: z.string().min(10, "Telefon numarası gerekli"),
  code: otpCodeSchema,
  name: nameSchema.optional(),
});

// Chat Request
export const chatSchema = z.object({
  message: z.string()
    .min(1, "Mesaj gerekli")
    .max(2000, "Mesaj çok uzun"),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(2000),
  })).max(20).optional(),
  userId: z.string().max(100).optional(),
  vehicleInfo: z.object({
    brand: z.string().max(50).optional(),
    model: z.string().max(50).optional(),
    year: z.number().int().optional(),
  }).optional(),
});

// Admin Login Request
export const adminLoginSchema = z.object({
  password: z.string().min(1, "Şifre gerekli"),
});

// Validate helper function
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): 
  { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const firstError = result.error.issues[0];
  return { success: false, error: firstError?.message || "Geçersiz veri" };
}
