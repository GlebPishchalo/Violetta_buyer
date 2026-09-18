/**
 * Usage: pnpm hash-password [plainPassword]
 * Prints a bcrypt hash suitable for Admin.passwordHash.
 */
import { hash } from "bcryptjs";

async function main() {
  const plain = process.argv[2] ?? "changeme";
  const rounds = 12;
  const passwordHash = await hash(plain, rounds);
  console.log(passwordHash);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
