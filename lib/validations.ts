import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(120, "Company name cannot exceed 120 characters"),
  email: z
    .string()
    .email("Please provide a valid corporate email address")
    .max(100, "Email cannot exceed 100 characters"),
  phone: z
    .string()
    .min(7, "Please enter a valid telephone or mobile number")
    .max(25, "Phone number cannot exceed 25 characters"),
  subject: z
    .string()
    .min(3, "Subject line is required")
    .max(150, "Subject cannot exceed 150 characters"),
  message: z
    .string()
    .min(10, "Please provide sufficient details (minimum 10 characters)")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const rfqFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name cannot exceed 100 characters"),
  companyName: z
    .string()
    .min(2, "Company / Organization name is required")
    .max(120, "Company name cannot exceed 120 characters"),
  email: z
    .string()
    .email("Please provide a valid business email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number with country/area code"),
  industry: z
    .string()
    .min(1, "Please select your primary industry"),
  productCategory: z
    .string()
    .min(1, "Please select an industrial product category"),
  productName: z
    .string()
    .min(2, "Please specify the product or equipment name / part number"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .regex(/^[0-9]+(\.[0-9]+)?$/, "Please enter a numeric quantity"),
  unitOfMeasurement: z
    .string()
    .min(1, "Please select a unit of measurement (e.g., Pcs, Meters, Kg, Drums)"),
  technicalSpecifications: z
    .string()
    .min(5, "Please describe the required pressure, size, material, or chemistry parameters"),
  deliveryLocation: z
    .string()
    .min(2, "Please provide the delivery destination city, port, or site address"),
  requiredDeliveryDate: z
    .string()
    .min(1, "Please provide an estimated delivery timeline or required date"),
  additionalComments: z
    .string()
    .max(1500, "Additional comments cannot exceed 1500 characters")
    .optional(),
  attachmentName: z.string().optional(),
});

export type RFQFormData = z.infer<typeof rfqFormSchema>;

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
