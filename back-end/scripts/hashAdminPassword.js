const bcrypt = require("bcryptjs");

const plainPassword = process.argv[2];

if (!plainPassword) {
  console.error("Usage: node scripts/hashAdminPassword.js <your-password>");
  process.exit(1);
}

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log("\nBcrypt hash (copy this into .env as ADMIN_PASSWORD_HASH):\n");
  console.log(hash);
  console.log();
});
