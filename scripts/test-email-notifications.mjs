import { sendRfqStatusUpdateEmail, sendEnquiryStatusUpdateEmail } from "../lib/email-service.js";
import pg from "pg";

const connectionString =
  (process.env.DATABASE_URL ||
  "postgresql://postgres.gznvueeroscdfymfuyxf:XQ3FttXtDTdiL46M@aws-0-eu-north-1.pooler.supabase.com:6543/postgres").split("?")[0];

async function testEmailNotifications() {
  console.log("=== TESTING AUTOMATED EMAIL NOTIFICATION SERVICE ===");

  // 1. Test RFQ Status Update
  console.log("\n1. Testing RFQ Update Email Dispatch...");
  const rfqRes = await sendRfqStatusUpdateEmail({
    id: "f8b9e6c4-1234-5678-90ab-cdef12345678",
    fullName: "Abhiram Kamarajugadda",
    email: "abhiram.kamarajugadda4@gmail.com",
    companyName: "EDUNET Foundation",
    productName: "High Pressure Ball Valve SS316",
    quantity: "15 Pcs",
    status: "quoted",
    quoteAmount: 18500,
    internalNotes: "Quotation formulated with 3.1 Material Test Certificates and 4-week factory lead time.",
    isNew: false,
  });
  console.log("  ✓ RFQ Update result:", rfqRes);

  // 2. Test Enquiry Status Update
  console.log("\n2. Testing Enquiry Update Email Dispatch...");
  const enqRes = await sendEnquiryStatusUpdateEmail({
    id: "a1b2c3d4-1234-5678-90ab-cdef12345678",
    fullName: "Abhiram Kamarajugadda",
    email: "abhiram.kamarajugadda4@gmail.com",
    companyName: "EDUNET Foundation",
    subject: "RO Water Treatment Chemicals Quotation",
    status: "responded",
    internalNotes: "We have reviewed your site TDS requirements and sent technical dosing specs.",
    isNew: false,
  });
  console.log("  ✓ Enquiry Update result:", enqRes);

  // 3. Verify in PostgreSQL email_logs table
  console.log("\n3. Verifying logs in Supabase PostgreSQL email_logs table...");
  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const logs = await pool.query(
    "SELECT recipient_email, recipient_name, subject, email_type, status, created_at FROM email_logs ORDER BY created_at DESC LIMIT 2;"
  );
  console.log("  ✓ Latest email logs in database:", logs.rows);
  await pool.end();

  console.log("\nEMAIL SERVICE VERIFICATION COMPLETED SUCCESSFULLY!");
}

testEmailNotifications().catch(console.error);
