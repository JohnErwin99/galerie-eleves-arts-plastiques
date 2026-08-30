# Galerie d'art des élèves

Galerie d'art numérique pour le cours d'arts visuels : l'enseignante ajoute les
projets et les œuvres des élèves; les parents et le public consultent librement.

## Démarrage local

```bash
npm install
cp .env.example .env        # puis remplir les valeurs (voir ci-dessous)
npm run seed                # crée la base + 2 projets d'exemple
npm run dev                 # http://localhost:3000
```

### Configuration (.env)

| Variable | Description |
|---|---|
| `DATABASE_PATH` | Chemin du fichier SQLite (`data/app.db` en local) |
| `UPLOADS_DIR` | Dossier des images (`data/uploads` en local) |
| `ADMIN_EMAIL` | Courriel de connexion de l'enseignante |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe |
| `SESSION_SECRET` | Secret de session (32+ caractères) : `openssl rand -hex 32` |
| `RECOVERY_CODE` | Code pour « Mot de passe oublié » : `openssl rand -hex 8` — à conserver par la personne qui gère le site |

Générer le hash du mot de passe :

```bash
npm run hash-password -- "votre mot de passe"
```

⚠️ Dans le fichier `.env`, les `$` du hash doivent être échappés en `\$`
(le script affiche la valeur déjà échappée). Sur Railway/Render, utiliser la
valeur brute sans les `\`.

## Guide de l'enseignante

Aucun lien vers l'espace d'administration n'apparaît sur le site public :
taper directement l'adresse `/admin` dans le navigateur (à mettre en favori).

**Mot de passe oublié?** Sur la page de connexion, cliquer « Mot de passe
oublié? », entrer le code de récupération (`RECOVERY_CODE`, conservé par la
personne qui gère le site) et choisir un nouveau mot de passe. Le mot de passe
défini ainsi est stocké dans la base et remplace celui des variables
d'environnement.

1. Aller sur `/admin` et se connecter.
2. **Nouveau projet** : titre (ex. « Autoportraits — 10e année »), description,
   année scolaire. Décocher « Visible au public » pour travailler en brouillon.
3. Dans la page du projet : **Ajouter une œuvre** — photo (max 15 Mo), prénom de
   l'élève (prénom seulement, par souci de confidentialité), titre, médium, date.
4. La première œuvre devient automatiquement l'image de couverture; on peut en
   choisir une autre avec « Choisir comme couverture ».
5. Cocher « Visible au public » puis Enregistrer pour publier.

Les photos sont automatiquement recadrées, converties en WebP et accompagnées
d'une miniature — on peut téléverser directement les photos du téléphone.

## Déploiement sur Railway

1. Pousser ce dépôt sur GitHub et créer un projet Railway à partir du dépôt
   (le `Dockerfile` est détecté automatiquement).
2. Ajouter un **Volume** monté sur `/data`.
3. Définir les variables d'environnement :
   - `DATABASE_PATH=/data/app.db`
   - `UPLOADS_DIR=/data/uploads`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (valeur brute du hash), `SESSION_SECRET`
4. Générer un domaine public dans les réglages du service (port 3000).

La base et toutes les images vivent dans le volume `/data` : une seule chose à
sauvegarder. (Render fonctionne aussi, mais le disque persistant exige un plan
payant.)

## Pile technique

Next.js (App Router) · SQLite + Drizzle ORM · sharp (images) ·
iron-session + bcrypt (session admin unique) · Tailwind CSS.
Les migrations s'exécutent automatiquement au démarrage.
