const fs = require("fs");
const path = require("path");

// Initial database state
const initialData = {
  users: [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      password: "adminpassword", // In a real app, this would be hashed
      role: "ADMIN",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ],
  products: [
    {
      id: "1",
      name: "Sample Product",
      description: "This is a sample product description.",
      price: 19.99,
      imageUrl: "https://via.placeholder.com/300",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Path to the database file
const dbPath = path.join(__dirname, "../data/db.json");

// Write the initial data to the database file
try {
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), "utf8");
  console.log("✅ Database seeded successfully!");
  console.log("👤 Admin User:");
  console.log("   Email: admin@example.com");
  console.log("   Password: adminpassword");
} catch (error) {
  console.error("❌ Error seeding database:", error);
}
