import assert from "node:assert";
import { z } from "zod";

// Test Contact Form Validation Schema
const contactFormSchema = z.object({
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

// Test RFQ Form Validation Schema
const rfqFormSchema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  industry: z.string().min(1),
  productCategory: z.string().min(1),
  productName: z.string().min(2),
  quantity: z.string().min(1).regex(/^[0-9]+(\.[0-9]+)?$/),
  unitOfMeasurement: z.string().min(1),
  technicalSpecifications: z.string().min(5),
  deliveryLocation: z.string().min(2),
  requiredDeliveryDate: z.string().min(1),
  additionalComments: z.string().optional(),
  attachmentName: z.string().optional(),
});

console.log("=== RUNNING PETRONEX TEST SUITE ===");

// TEST 1: Contact Form Valid
console.log("Testing: Contact Form Validation (Valid)...");
const validContact = {
  fullName: "John Doe",
  companyName: "Acme Industrial Corp",
  email: "john@acme.com",
  phone: "+91 98765 43210",
  subject: "Inquiry on RO Antiscalants",
  message: "We need 2000 kg of broad spectrum RO antiscalant for our cooling plant.",
};
const contactResult = contactFormSchema.safeParse(validContact);
assert.strictEqual(contactResult.success, true, "Valid contact should pass validation");
console.log("  ✓ Contact Form Valid test passed");

// TEST 2: Contact Form Invalid Email
console.log("Testing: Contact Form Validation (Invalid Email)...");
const invalidContactEmail = {
  ...validContact,
  email: "not-an-email",
};
const invalidEmailResult = contactFormSchema.safeParse(invalidContactEmail);
assert.strictEqual(invalidEmailResult.success, false, "Invalid email should fail");
console.log("  ✓ Invalid Email rejected as expected");

// TEST 3: Contact Form Short Message
console.log("Testing: Contact Form Validation (Short Message)...");
const invalidMessage = {
  ...validContact,
  message: "Too short",
};
const invalidMsgResult = contactFormSchema.safeParse(invalidMessage);
assert.strictEqual(invalidMsgResult.success, false, "Short message should fail");
console.log("  ✓ Short message rejected as expected");

// TEST 4: RFQ Form Valid
console.log("Testing: RFQ Form Validation (Valid)...");
const validRFQ = {
  fullName: "Priya Sharma",
  companyName: "Gujarat Petrochem Ltd",
  email: "procurement@petrochem.com",
  phone: "+91 98220 12345",
  industry: "Petrochemical & Refining",
  productCategory: "Manifold Valves",
  productName: "5-Way Differential Pressure Manifold",
  quantity: "25",
  unitOfMeasurement: "Pieces (Pcs)",
  technicalSpecifications: "SS316 forged body, 6000 PSI rating, 1/2-inch NPT connections",
  deliveryLocation: "Dahej Site, Gujarat",
  requiredDeliveryDate: "Within 4 weeks",
  attachmentName: "datasheet-spec.pdf",
};
const rfqResult = rfqFormSchema.safeParse(validRFQ);
assert.strictEqual(rfqResult.success, true, "Valid RFQ should pass validation");
console.log("  ✓ RFQ Form Valid test passed");

// TEST 5: RFQ Non-numeric Quantity
console.log("Testing: RFQ Form Validation (Non-numeric Quantity)...");
const invalidQuantityRFQ = {
  ...validRFQ,
  quantity: "ten pieces",
};
const invalidQtyResult = rfqFormSchema.safeParse(invalidQuantityRFQ);
assert.strictEqual(invalidQtyResult.success, false, "Non-numeric quantity should fail");
console.log("  ✓ Non-numeric quantity rejected as expected");

// Admin Login Schema definition
const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid administrator email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

// TEST 6: Admin Login Valid
console.log("Testing: Admin Login Validation (Valid)...");
const validAdmin = {
  email: "admin@petroeng.in",
  password: "superSecretPassword123!",
  rememberMe: true,
};
const adminResult = adminLoginSchema.safeParse(validAdmin);
assert.strictEqual(adminResult.success, true, "Valid admin login should pass");
console.log("  ✓ Admin Login Valid test passed");

// TEST 7: Admin Login Invalid Email
console.log("Testing: Admin Login Validation (Invalid Email)...");
const invalidAdminEmail = {
  email: "invalid-admin-format",
  password: "validPassword123",
};
const invalidAdminEmailResult = adminLoginSchema.safeParse(invalidAdminEmail);
assert.strictEqual(invalidAdminEmailResult.success, false, "Invalid email should fail");
console.log("  ✓ Admin Invalid Email rejected as expected");

// TEST 8: Admin Login Short Password
console.log("Testing: Admin Login Validation (Short Password)...");
const invalidAdminPass = {
  email: "admin@petroeng.in",
  password: "123",
};
const invalidAdminPassResult = adminLoginSchema.safeParse(invalidAdminPass);
assert.strictEqual(invalidAdminPassResult.success, false, "Short password should fail");
console.log("  ✓ Admin Short Password rejected as expected");

console.log("\nALL VALIDATION TESTS PASSED SUCCESSFULLY! (8/8)");
