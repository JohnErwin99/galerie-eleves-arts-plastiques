# Galerie d'art des élèves

Galerie d'art numérique pour présenter les projets des élèves du cours d'arts visuels.
L'enseignante (administratrice) ajoute des projets et téléverse les photos des œuvres;
les parents et le public consultent la galerie librement.

## Fonctionnement

- **Public** : page d'accueil avec les projets publiés → page d'un projet → visionneuse plein écran (flèches ←/→, Échap pour fermer).
- **Espace enseignante** (`/admin`) : connexion par courriel/mot de passe, création et modification de projets, téléversement des photos d'œuvres (prénom de l'élève seulement, titre, médium, date, description), choix de l'image de couverture, statut publié/brouillon.
- Les images sont automatiquement optimisées (WebP, grande taille + vignette) et stockées avec la base de données SQLite dans le dossier `data/` — une seule chose à sauvegarder.

## Développement local

```bash
npm install
cp .env.example .env
# Générer le hash du mot de passe et le secret de session :
npm run hash-password -- "votreMotDePasse"   # → coller dans ADMIN_PASSWORD_HASH
openssl rand -hex 32                          # → coller dans SESSION_SECRET
npm run seed        # (optionnel) crée 2 projets d'exemple
npm run dev         # http://localhost:3000
```

La base de données et ses tables sont créées automatiquement au premier démarrage.

## Déploiement sur Railway

1. Pousser ce dépôt sur GitHub et créer un projet Railway à partir du dépôt (le `Dockerfile` est détecté automatiquement).
2. Ajouter un **Volume** au service, monté sur `/data` (le Dockerfile pointe déjà `DATABASE_PATH=/data/app.db` et `UPLOADS_DIR=/data/uploads`).
3. Définir les variables d'environnement : `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` (voir `.env.example`).
4. Générer un domaine public dans les réglages du service.

**Sauvegarde** : copier le contenu du volume `/data` (base + images) régulièrement.

## Guide rapide pour l'enseignante

1. Aller sur `/admin` et se connecter.
2. « Nouveau projet » : donner un titre (ex. « Autoportraits — 10e année »), une description, l'année scolaire.
3. Dans la page du projet, téléverser les photos des œuvres une à une (une photo de téléphone convient très bien).
4. La première œuvre devient la couverture du projet; on peut en choisir une autre avec « Choisir comme couverture ».
5. Décocher « Visible au public » pour garder un projet en brouillon.
6. Par souci de confidentialité, n'inscrire que le **prénom** des élèves.
