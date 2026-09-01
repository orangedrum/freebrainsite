# FreeBrain Website — Setup Checklist

## ✅ Completed

- [x] Created `develop` branch
- [x] Created `stage` branch
- [x] Pushed all branches to GitHub
- [x] Documented branching workflow in `BRANCHING.md`

## 🔄 Next Steps (Manual — On GitHub UI)

### 1. Set Up Branch Protection for `main`
1. Go to https://github.com/orangedrum/freebrainsite/settings/branches
2. Click **Add rule**
3. Branch name pattern: `main`
4. Check these boxes:
   - ☑ Require a pull request before merging
   - ☑ Require 1 approval
   - ☑ Require branches to be up to date before merging
   - ☑ Restrict who can push to matching branches (set to: Only allow specified actors)
5. Click **Create**

### 2. Set Up Branch Protection for `stage`
1. Click **Add rule** again
2. Branch name pattern: `stage`
3. Check same boxes as `main` (but only require 0 approvals if you want faster staging deploys)
4. Click **Create**

### 3. Configure Vercel Deployments
1. Go to your Vercel project settings: https://vercel.com/orangedrum/freebrainsite/settings
2. Under **Deployments**, verify:
   - **Production branch**: `main` → deploys to freethebrains.com
   - **Preview branches**: Include `stage` for staging.freethebrains.com

*Note: Vercel usually auto-detects this, but verify it's correct.*

---

## 📋 Your Branch Structure (Now Live)

```
main (production)
  ├── Protected: Requires PR + 1 approval
  ├── Auto-deploys to: freethebrains.com
  └── Status: Ready

stage (staging)
  ├── Protected: Requires PR
  ├── Auto-deploys to: staging.freethebrains.com
  └── Status: Ready

develop (integration)
  ├── Protected: No
  ├── Auto-deploys: No
  └── Status: Ready for feature branching
```

---

## 🚀 Typical Workflow

```bash
# 1. Create feature from develop
git checkout develop
git checkout -b feature/my-feature

# 2. Commit work
git add .
git commit -m "Add my feature"
git push -u origin feature/my-feature

# 3. Open PR to develop on GitHub
# Wait for approval/tests

# 4. Merge to develop
git checkout develop
git merge feature/my-feature
git push origin develop

# 5. When ready to test in staging
git checkout stage
git merge develop --no-ff
git push origin stage
# → Auto-deploys to staging.freethebrains.com

# 6. When approved for production
git checkout main
git merge stage --no-ff
git push origin main
# → Auto-deploys to freethebrains.com
```

---

## 📝 Local Development (Unchanged)

You still run locally with Docker:
```bash
cd /Users/orangedrum/Dropbox/ProductShift/jobs/FreetheBrains/site/freebrainsite
docker compose up
# Visit http://localhost:8080
```

This works on any branch — `main`, `develop`, `stage`, or feature branches.

---

## ⚠️ Important Reminders

- **Never push directly to `main` or `stage`** — always use PRs
- **Test on `develop` locally** before promoting to `stage`
- **Test on `stage` in production-like environment** before promoting to `main`
- **All environment variables** (Supabase, Resend, etc.) should be the same across all branches (just different Supabase projects if needed)

---

Done! Your branching strategy is now set up. Just complete the GitHub branch protection rules (Step 1-2 above) and you're all set.
