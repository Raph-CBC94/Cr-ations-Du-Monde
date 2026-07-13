# Déploiement Render — Blueprint

Ce projet inclut un `render.yaml` pour déployer en un clic sur Render.

## 1. Créer un repo GitHub

Créez un repo public vide (sans README) sur GitHub et poussez le code.

## 2. Connecter à Render

1. Allez sur [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
2. Cliquez **New Blueprint Instance**
3. Choisissez votre repo GitHub
4. Render détectera automatiquement `render.yaml`

> Note : le site frontend est configuré comme un service `web` avec `runtime: static`, qui est la syntaxe correcte pour les blueprints Render.

## 3. Configurer les variables d'environnement

Pendant le setup, Render demandera les variables marquées `sync: false` :

- Pour `creations-du-monde-api` :
  - `RESEND_API_KEY` : votre clé Resend
- Pour `creations-du-monde-web` :
  - `VITE_PAYPAL_CLIENT_ID` : votre Client ID PayPal Live
  - `VITE_API_URL` : laissez vide — le frontend utilise le rewrite `/api/*` vers l'API

## 4. Mettre à jour ALLOWED_ORIGINS (CORS)

Après le premier déploiement, copiez l'URL finale du site statique et mettez-la à jour dans les variables d'environnement de l'API `creations-du-monde-api` :

```
ALLOWED_ORIGINS=https://creations-du-monde.onrender.com,https://www.tondomaine.com
```

Puis redéployez l'API.

## 5. Tester

- Ouvrez le site
- Faites un paiement test (code promo `famille` pour une commande gratuite)
- Vérifiez que l'email arrive dans les commandes
