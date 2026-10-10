# Fly.io deployment

Pushes to `main` and manual runs of the **Deploy to Fly.io** GitHub Action build
the Vite app and deploy it to Fly.io. The production image serves `dist/` with
Nginx on port 8080, with HTTPS enforced by Fly.io and a `/healthz` health check.
The build runs TypeScript checks before producing assets.

## Initial account setup

```sh
brew install flyctl
flyctl auth login
flyctl apps create idea-grabber
```

If the name is already taken, choose another globally unique app name and update
`app` in `fly.toml`. Select the intended Fly.io organization when prompted.

Authenticate GitHub CLI with `gh auth login` if needed, then set an app-scoped
deployment token directly as a GitHub Actions secret, without saving it to a file:

```sh
flyctl tokens create deploy --app idea-grabber --expiry 8760h |
  gh secret set FLY_API_TOKEN --repo trebizondoculpepper/idea_grabber
```

Renew this token before its one-year expiry. Never commit the token.

Commit the deployment files and push to `main` to trigger the first deployment.
The site is available at https://idea-grabber.fly.dev once deployment succeeds.
If you changed the app name, the hostname changes accordingly.

## Operations

```sh
flyctl status
flyctl logs
flyctl deploy --remote-only --ha=false
gh run list --workflow fly.yml --repo trebizondoculpepper/idea_grabber
```

Builds run on Fly.io's remote builder; no local Docker installation is needed.
The initial deployment uses one 256 MB shared-CPU machine in London. Idle
machines stop automatically and restart on requests, so the first request after
an idle period can take longer. Fly.io bills resources according to your account
plan. Set `min_machines_running = 1` to keep a machine warm if needed.

To check the image locally on this Mac, use Apple's container CLI:

```sh
container build -t idea-grabber .
container run --rm -p 8080:8080 idea-grabber
```

Then open http://localhost:8080 and check http://localhost:8080/healthz.
