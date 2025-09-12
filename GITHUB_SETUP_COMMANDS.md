# GitHub Setup Commands

After creating your repository on GitHub, run these commands:

```bash
# Add GitHub remote (replace 'yourusername' with your actual GitHub username)
git remote add origin https://github.com/yourusername/qhop.git

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
# Add GitHub remote with SSH
git remote add origin git@github.com:yourusername/qhop.git

# Push to GitHub
git push -u origin main
```

## Verify Upload

After pushing, you should see all your files on GitHub at:
`https://github.com/yourusername/qhop`

## Future Updates

To push future changes:

```bash
# Stage changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push
```

## Branch Management

For feature development:

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Push new branch to GitHub
git push -u origin feature/new-feature
```
