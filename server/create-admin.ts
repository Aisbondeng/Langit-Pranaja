import { storage } from "./storage";

// Gunakan password yang sudah dihash dari skrip kita sebelumnya
const adminData = {
  username: "admin",
  password: "0a5a718eb2572162afa60cddc01a4e2801046a69a87219875c85a3be13e0cdcbc578af67172742e2475949d5d6edb797c8cb110aac3c8452c2260e7a466bd3fa.66d502b3f8000b5e0cb1839807c8c8bb",
  email: "admin@pranajaarishaf.com",
  userType: "admin",
  registeredAt: new Date().toISOString(),
};

// Fungsi untuk membuat akun admin secara langsung
export async function createAdminAccountDirectly() {
  try {
    // Cek apakah admin sudah ada
    const existingAdmin = await storage.getUserByUsername("admin");
    
    if (existingAdmin) {
      console.log("Admin account already exists, updating password...");
      await storage.updateUser(existingAdmin.id, { 
        password: adminData.password 
      });
      console.log("Admin password updated successfully");
    } else {
      console.log("Creating new admin account...");
      await storage.createUser(adminData);
      console.log("Admin account created successfully");
    }
    
    console.log("✅ Admin credential: username='admin' password='adminpass'");
  } catch (error) {
    console.error("Error managing admin account:", error);
  }
}