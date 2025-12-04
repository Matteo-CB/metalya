import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "matteo.biyikli3224@gmail.com";
  const password = "Password123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: UserRole.SUPER_ADMIN,
      password: hashedPassword,
    },
    create: {
      email,
      name: "Matteo Biyikli",
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      bio: "Super Administrateur du site Metalya.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
      emailVerified: new Date(),
    },
  });

  console.log("Utilisateur Super Admin configuré :", user.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
