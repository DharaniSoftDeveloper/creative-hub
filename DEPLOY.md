# Creative Hub Deployment Guide

This project can be published as a **static website**.

For the current version, the easiest setup is:

- Host the frontend only.
- Let **EmailJS** handle the contact form.
- Do **not** deploy the API server unless you want SMTP mail backup later.

## What You Upload

You have two deployment styles:

1. **Git-based deployment**
   Upload the project source to GitHub.
   Do not upload `node_modules` or build output manually.

2. **Manual deployment**
   Build the site locally, then upload only:
   `artifacts/creative-hub/dist/public`

You do **not** upload the whole repository for manual static hosting.

## Create the Upload Package

From the project root, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish-static.ps1
```

That creates:

- Static files folder:
  `artifacts/creative-hub/dist/public`
- Ready-to-upload zip:
  `artifacts/creative-hub/publish/creative-hub-static.zip`

## Recommended Free Publish Option: Render

This repo already includes:

- `render.yaml`

So Render is the easiest option if you want automatic deploys from GitHub.

### Step by Step

1. Create a GitHub repository.
2. Push this project to GitHub.
3. Go to Render:
   https://render.com/
4. Sign in and choose **New** > **Blueprint** or **Static Site**.
5. Connect your GitHub repo.
6. If Render detects `render.yaml`, use that configuration.
7. Deploy.
8. After deploy, Render gives you a free URL like:
   `https://your-site-name.onrender.com`

### Important

The existing `render.yaml` already sets:

- Static hosting
- Build command
- Publish folder
- SPA rewrite to `index.html`

## Manual Free Publish Option: Cloudflare Pages

Good if you do not want GitHub auto-deploy right away.

Official docs:

- Overview:
  https://developers.cloudflare.com/pages/
- Direct upload:
  https://developers.cloudflare.com/pages/get-started/direct-upload/

### Step by Step

1. Run the packaging script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish-static.ps1
```

2. Open Cloudflare Pages:
   https://dash.cloudflare.com/
3. Go to **Workers & Pages**.
4. Create a new **Pages** project.
5. Choose **Direct Upload**.
6. Upload the contents of:
   `artifacts/creative-hub/dist/public`
   or upload:
   `artifacts/creative-hub/publish/creative-hub-static.zip`
7. Publish.
8. Cloudflare gives you a free URL like:
   `https://your-project.pages.dev`

## Another Easy Free Option: Netlify

Official docs:

- Manual deploys:
  https://docs.netlify.com/site-deploys/create-deploys/
- Domains overview:
  https://docs.netlify.com/manage/domains/domains-fundamentals/understand-domains/

### Step by Step

1. Build the package with the PowerShell script.
2. Open:
   https://app.netlify.com/drop
3. Drag `artifacts/creative-hub/dist/public` or the zip file.
4. Netlify publishes it and gives you a free URL like:
   `https://your-site-name.netlify.app`

## Free Domain Options

The safest free domain option is a **platform subdomain**.

Examples:

- Render: `your-site.onrender.com`
- Cloudflare Pages: `your-site.pages.dev`
- Netlify: `your-site.netlify.app`
- Vercel: `your-site.vercel.app`

## About Custom Domains

Custom domains like `yourbrand.com` are usually **not free**.
Hosting can be free, but the domain itself normally costs money.

If you want a proper branded domain later, buy one from a registrar and connect it to your hosting platform.

## Best Recommendation For You

Use one of these:

1. **Render**
   Best if you want GitHub auto-deploy and you already have `render.yaml`.
2. **Cloudflare Pages**
   Best if you want a fast free site and simple upload.
3. **Netlify Drop**
   Best if you want the easiest drag-and-drop publish.

## For This Project Specifically

Your current live-ready frontend is:

- `artifacts/creative-hub`

Your contact form can work on static hosting because the frontend already has EmailJS config in:

- `artifacts/creative-hub/.env.production`

So for the first publish, you only need the static frontend.
