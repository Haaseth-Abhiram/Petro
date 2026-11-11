const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// 1. Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// 2. Initialize Express application
const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

// 3. CORS Configuration
// Allows requests from Lovable, local dev (5173, 3000, 8080), preview domains, and custom origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:4173",
  "https://petroeng.in",
  "https://www.petroeng.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow any Lovable preview domains (*.lovable.app, *.lovableproject.com)
      if (
        origin.endsWith(".lovable.app") ||
        origin.endsWith(".lovableproject.com") ||
        origin.endsWith(".vercel.app") ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }

      return callback(null, true); // Permissive in dev/staging so Lovable connects seamlessly
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-admin-token"],
  })
);

// 4. Body parsers & Cookie parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// 5. Static uploads directory
app.use("/uploads", express.static(path.resolve(process.cwd(), "public", "uploads")));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// 6. Request Logger
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// 7. Health Check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Petro Engineering Standalone Node.js Backend API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth/*",
      admin: "/api/admin/*",
      careers: "/api/careers/*",
      contact: "/api/contact",
      rfq: "/api/rfq",
      health: "/api/db-check",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", uptime: process.uptime() });
});

// 8. Mount Modular Route Handlers under /api
const authRoutes = require("./routes/auth");
const statsRoutes = require("./routes/stats");
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const quotesRoutes = require("./routes/quotes");
const enquiriesRoutes = require("./routes/enquiries");
const careersRoutes = require("./routes/careers");
const cmsRoutes = require("./routes/cms");
const generalRoutes = require("./routes/general");

app.use("/api/auth", authRoutes);
app.use("/api/admin", statsRoutes);
app.use("/api/admin", productsRoutes);
app.use("/api/admin", categoriesRoutes);
app.use("/api/admin", quotesRoutes);
app.use("/api/admin", enquiriesRoutes);
app.use("/api/admin", cmsRoutes);
app.use("/api/careers", careersRoutes);
app.use("/api/admin/careers", careersRoutes);
app.use("/api", generalRoutes);

// 9. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    suggestion: "Check the API route path or verify the backend server documentation.",
  });
});

// 10. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error occurred.",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// 11. Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Petro Engineering Node.js Backend Running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🔌 Health check: http://localhost:${PORT}/api/db-check`);
    console.log(`🌐 CORS enabled for Lovable & Local Web Clients`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
