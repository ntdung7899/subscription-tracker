import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "ntdung899@gmail.com";
  const password = "123456789";
  const name = "Nguyen Tien Dung";

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // console.log(`User with email ${email} already exists!`);
    // console.log("User ID:", existingUser.id);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      emailVerified: new Date(),
    },
  });

  //   console.log('✅ User created successfully!')
  //   console.log('Email:', user.email)
  //   console.log('Name:', user.name)
  //   console.log('ID:', user.id)
  //   console.log('Created At:', user.createdAt)
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
