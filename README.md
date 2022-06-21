[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/artem30801/ficai-web/master.svg)](https://results.pre-commit.ci/latest/github/artem30801/ficai-web/master)

# Fic-ai (ficai-web)

Collaborative tagging.

## Running locally

Depends on [ficai-signals-server], follow the instructions there to run it in
docker-compose.

To run everything here inside docker:

```bash
docker-compose up -d --build nginx quasar-spa
```

---

If you'd prefer to run outside of docker, only start `nginx` and then follow
the instructions below:

```bash
docker-compose up -d nginx
```

Open `http://localhost:9000` in your browser.

---

To build browser extension:

```bash
docker-compose up --build quasar-build-bex
```
Built extension will at `./dist/bex/`


## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev -p 8000
```

### Start the app in development mode for BEX (auto-rebuilding, error reporting, etc.)
BEX = Browser EXtension
```bash
quasar dev -m bex
```

### Pre-commit hooks
Install:
```bash
pip install pre-commit
```

Run after you staged files to commit in git:
```bash
pre-commit run
```

Run on all files (staged or not):
```bash
pre-commit run --all-files
```

Install as git pre-commit hooks (will run automatically on git commit and prevent commit if failed)
```bash
pre-commit install
```

### Lint the files (use pre-commit instead)

```bash
yarn lint
# or
npm run lint
```

### Format the files (use pre-commit instead)

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

[ficai-signals-server]: https://github.com/ypoluektovich/ficai-signals-server/
