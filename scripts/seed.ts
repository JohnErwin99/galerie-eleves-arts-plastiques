import { db, projects } from "../src/db";

async function main() {
  const existing = await db.select().from(projects);
  if (existing.length > 0) {
    console.log("La base contient déjà des projets, rien à faire.");
    return;
  }
  await db.insert(projects).values([
    {
      title: "Autoportraits (10e année)",
      description: "Exploration de l'identité à travers l'autoportrait, techniques mixtes.",
      schoolYear: "2025-2026",
    },
    {
      title: "Natures mortes (11e année)",
      description: "Étude de la lumière et de la composition en peinture acrylique.",
      schoolYear: "2025-2026",
    },
  ]);
  console.log("2 projets d'exemple créés.");
}

main();
