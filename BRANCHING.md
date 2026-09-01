# FreeBrain Website — Branching & Deployment Strategy

## Branch Structure

| Branch | Purpose | Deployed To | Auto-Deploy |
|--------|---------|-------------|------------|
| `main` | **Production** — stable, tested code | freethebrains.com | ✅ Yes |
| `stage` | **Staging** — pre-production testing | staging.freethebrains.com | ✅ Yes |
| `develop` | **Development** — integration branch | local/testing only | ❌ No |

---

## Workflow

### 1. Feature Development
```bash
# Always branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Make changes, commit
git add .
git commit -m "Add feature description"
git push -u origin feature/your-feature-name
```

### 2. Create Pull Request (PR)
- Create PR from `feature/your-feature-name` → `develop`
- Describe changes clearly
- Wait for review/approval
- Merge to develop

### 3. Test in Development
- Your changes are now in `develop`
- Test locally with `docker compose up`
- Verify all features work

### 4. Promote to Staging
When ready to test in staging environment:
```bash
git checkout stage
git pull origin stage
git merge develop --no-ff
git push origin stage
```
- Vercel auto-deploys to staging.freethebrains.com
- Test there with real Supabase/Resend/Vercel setup
- Get approval from team

### 5. Release to Production
When staging is approved and tested:
```bash
git checkout main
git pull origin main
git merge stage --no-ff
git push origin main
```
- Vercel auto-deploys to freethebrains.com (production)
- Done!

### 6. Sync Main Back to Develop
After production release:
```bash
git checkout develop
git pull origin develop
git merge main --no-ff
git push origin develop
```
This ensures develop stays in sync with production.

---

## Branch Protection Rules (Set Up on GitHub)

### `main` Branch
1. **Require pull request reviews**: ✅ Yes
   - Require 1 approval before merge
2. **Require status checks to pass**: ✅ Yes (if using CI)
   - Build must pass
3. **Require up-to-date PR branches**: ✅ Yes
4. **Allow force pushes**: ❌ No
5. **Require code owner review**: ✅ (optional for extra safety)

### `stage` Branch
1. **Require pull request reviews**: ✅ Yes (1 approval)
2. **Require status checks to pass**: ✅ Yes (if using CI)
3. **Allow force pushes**: ❌ No
4. **Auto-delete head branches**: ✅ Yes (cleanup merged branches)

### `develop` Branch
- No protection — devs can push directly

---

## How to Set Up Branch Protection on GitHub

1. Go to repo **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. **Branch name pattern**: `main`
4. Check:
   - ☑ Require a pull request before merging
   - ☑ Require approvals (1)
   - ☑ Require branches to be up to date before merging
   - ☑ Restrict who can push to matching branches (optional)
5. Click **Create**

Repeat for `stage` branch.

---

## Vercel Deployment Configuration

### Production (`main` → freethebrains.com)
- **Deployment**: Automatic on push to `main`
- **Environment**: Production
- **URL**: https://freethebrains.com

### Staging (`stage` → staging.freethebrains.com)
- **Deployment**: Automatic on push to `stage`
- **Environment**: Preview
- **URL**: https://staging.freethebrains.com (or configured custom domain)

### Development (`develop`)
- **Deployment**: Manual or disabled
- **Environment**: Local development only

---

## Important Notes

- **Never** commit directly to `main` or `stage` — always use PRs
- **Always** test locally before pushing to develop
- Use `--no-ff` flag on merge commits to keep history clean
- Write descriptive commit messages
- Keep commits atomic (one feature per commit when possible)

---

## Rollback (Emergency Only)

If production is broken:
```bash
git checkout main
git revert HEAD  # Reverts the last commit
git push origin main
```

Vercel will auto-deploy the revert. This is safer than force-pushing.
