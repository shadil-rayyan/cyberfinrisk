# Release Process

We use [standard-version](https://github.com/conventional-changelog/standard-version) to automate changelog generation.

## Commit Guidelines
- Use Conventional Commit messages (`feat:`, `fix:`, `docs:`, etc.)
- Breaking changes must include `BREAKING CHANGE:` in the commit body.

## Creating a Release
1. Commit changes using Conventional Commits.
2. Run `npm run release`.
3. Push tags with `git push --follow-tags origin main`.
4. GitHub Actions will publish a new release automatically.
