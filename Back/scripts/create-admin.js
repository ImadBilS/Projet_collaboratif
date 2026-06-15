const { prisma } = require("../src/db/prisma");
const { hashPassword } = require("../src/utils/password");

async function main() {
  const mail = process.env.ADMIN_EMAIL ?? "admin@resources-relationnelles.local";
  const plainPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";

  const adminData = {
    firstname: process.env.ADMIN_FIRSTNAME ?? "Admin",
    lastname: process.env.ADMIN_LASTNAME ?? "Prototype",
    birth: new Date(process.env.ADMIN_BIRTH ?? "1990-01-01"),
    mail,
    password: await hashPassword(plainPassword),
    role: "Administrateur",
    sex: process.env.ADMIN_SEX ?? "Autre",
    street_number: Number.parseInt(process.env.ADMIN_STREET_NUMBER ?? "1", 10),
    street_type: process.env.ADMIN_STREET_TYPE ?? "Rue de l'Administration",
    postal_code: Number.parseInt(process.env.ADMIN_POSTAL_CODE ?? "75001", 10),
    address_complement: process.env.ADMIN_ADDRESS_COMPLEMENT ?? null,
    city: process.env.ADMIN_CITY ?? "Paris",
    country: process.env.ADMIN_COUNTRY ?? "France",
  };

  const existingUser = await prisma.user.findUnique({
    where: { mail },
  });

  if (existingUser) {
    const updatedUser = await prisma.user.update({
      where: { mail },
      data: {
        ...adminData,
        refresh_token_hash: null,
        refresh_token_expires_at: null,
        is_anonymized: false,
        deleted_at: null,
      },
    });

    console.log("Administrateur mis à jour :", {
      user_id: updatedUser.user_id,
      mail: updatedUser.mail,
      role: updatedUser.role,
      password: plainPassword,
    });
    return;
  }

  const createdUser = await prisma.user.create({
    data: adminData,
  });

  console.log("Administrateur créé :", {
    user_id: createdUser.user_id,
    mail: createdUser.mail,
    role: createdUser.role,
    password: plainPassword,
  });
}

main()
  .catch((error) => {
    console.error("Impossible de créer l'administrateur :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
