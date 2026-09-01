# Manual Deployment Guide — FreeBrain Website

Since you're on Vercel's Hobby Plan and want to deploy from your local terminal, here's how to do it without the team collaboration requirement:

---

## Option 1: Git Push → Vercel Auto-Deploy (Simplest)

### Setup (One-Time)

1. Go to your Vercel project: https://vercel.com/orangedrum/freebrainsite
2. Go to **Settings → Git Integrations**
3. Verify it's connected to `https://github.com/orangedrum/freebrainsite`
4. Under **Deploy on Push**, make sure it's **Enabled**

### Workflow

Every time you push to GitHub, Vercel auto-deploys:

```bash
# From your local machine (no Docker required)
cd /Users/orangedrum/Dropbox/ProductShift/jobs/FreetheBrains/site/freebrainsite

# 1. Make changes and commit
git add .
git commit -m "Update homepage"

# 2. Push to main (production)
git push origin main
# → Vercel auto-deploys to freethebrains.com in ~1-2 min

# OR push to stage (staging)
git push origin stage
# → Vercel auto-deploys to staging.freethebrains.com in ~1-2 min
```

### Watch It Deploy

1. Push code from terminal
2. Go to https://vercel.com/orangedrum/freebrainsite/deployments
3. Watch the deployment status in real-time
4. When it says "Ready", your site is live

---

## Option 2: Vercel CLI (Requires Node.js Installation)

If you want to install Vercel CLI locally on your Mac:

```bash
# Install globally (requires npm)
npm install -g vercel

# Or via Homebrew
brew install vercel-cli

# Then link your project
cd /Users/orangedrum/Dropbox/ProductShift/jobs/FreetheBrains/site/freebrainsite
vercel link

# Deploy main to production
vercel --prod

# Deploy stage to preview
vercel
```

**Note:** This requires Node.js installed on your Mac globally, which you don't have (by design).

---

## Recommended: Use Option 1 (Git Push)

**Why?** 
- No additional setup needed
- Works from any terminal
- Git is your single source of truth
- Vercel watches GitHub automatically
- You see all deployments at https://vercel.com/orangedrum/freebrainsite/deployments

**Workflow:**

```bash
# 1. Develop locally with Docker
docker compose up
# Edit files at http://localhost:8080
# Test changes

# 2. Commit to your feature branch
git add .
git commit -m "Add new feature"
git push -u origin feature/my-feature

# 3. Create PR to develop on GitHub

# 4. Merge to develop (approved)
git checkout develop
git merge feature/my-feature
git push origin develop

# 5. Test in staging when ready
git checkout stage
git merge develop --no-ff
git push origin stage
# → Auto-deploys to staging.freethebrains.com
# → Watch at https://vercel.com/orangedrum/freebrainsite/deployments

# 6. Approve and release to production
git checkout main
git merge stage --no-ff
git push origin main
# → Auto-deploys to freethebrains.com
# → Watch deployment in real-time

# 7. Sync develop back to production
git checkout develop
git merge main --no-ff
git push origin develop
```

---

## Troubleshooting

### Deployment Blocked — "Commit author did not have contributing access"

**Cause:** Your GitHub account isn't a collaborator on the Vercel project.

**Solution:** Use Git Push (Option 1). Vercel deploys from the **repo**, not the **user**. As long as your code is on GitHub, Vercel will deploy it.

### Deployment Still Blocked

Go to https://vercel.com/orangedrum/freebrainsite/settings/git-integrations and verify:
- ✅ GitHub is connected
- ✅ Deploy on Push is **Enabled**
- ✅ The repo shows `orangedrum/freebrainsite`

### Can't See Deployments

Go to https://vercel.com/orangedrum/freebrainsite/deployments — you should see all your deploys from all branches here.

---

## Summary

**You need to do:**
1. Git commit locally
2. `git push origin main` (or `stage`, or feature branch)
3. Watch https://vercel.com/orangedrum/freebrainsite/deployments

That's it. Vercel handles the rest automatically.
