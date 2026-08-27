// Usage: npm run hash-password -- "monMotDePasse"
// Affiche le hash prêt à coller dans .env (les $ sont échappés car Next.js
// interprète $VAR dans les fichiers .env). Sur Railway/Render, utiliser la
// valeur brute (sans les \).
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage : npm run hash-password -- "votre mot de passe"');
  process.exit(1);
}
const hash = bcrypt.hashSync(password, 12);
console.log("Pour le fichier .env :");
console.log(`ADMIN_PASSWORD_HASH=${hash.replace(/\$/g, "\\$")}`);
console.log("\nPour Railway/Render (valeur brute) :");
console.log(hash);
