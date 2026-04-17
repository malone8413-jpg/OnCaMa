# Online Career Manager - version GitHub Pages

Cette version retire la dépendance à l'hébergement Base44 pour le **frontend** et permet un déploiement public sur **GitHub Pages**.

## Important

- Le site est maintenant préparé pour être hébergé sur GitHub Pages.
- Les **données existantes** (clubs, effectifs, comptes, etc.) ne sont **pas migrées** hors Base44 dans ce projet.
- L'application continue donc à utiliser le **backend Base44 existant** pour la connexion, les données et les actions métier.
- Si votre backend Base44 n'est plus accessible à cause des crédits, le site pourra s'afficher sur GitHub, mais les fonctions dynamiques (connexion, lecture/écriture des données) ne fonctionneront plus tant qu'un backend de remplacement n'est pas mis en place.

## Variables d'environnement

Créer un fichier `.env.local` pour le développement :

```env
VITE_BASE44_APP_ID=your_base44_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
VITE_BASE44_FUNCTIONS_VERSION=prod
```

## Lancer en local

```bash
npm install
npm run dev
```

## Déployer sur GitHub Pages

1. Poussez ce projet sur GitHub.
2. Dans le dépôt GitHub, ouvrez **Settings > Secrets and variables > Actions**.
3. Ajoutez les secrets :
   - `VITE_BASE44_APP_ID`
   - `VITE_BASE44_APP_BASE_URL`
4. Activez **GitHub Pages** avec **GitHub Actions** comme source de déploiement.
5. Poussez sur `main` ou lancez manuellement le workflow.

## Connexion e-mail / mot de passe

Le code actuel conserve le système de connexion déjà géré côté Base44.
Aucune nouvelle interface d'authentification n'a été ajoutée pour ne pas modifier le site au-delà du strict nécessaire.
