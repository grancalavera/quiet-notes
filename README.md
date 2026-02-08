# quiet notes

## Firebase

You need to setup your own firebase application to run this project. Once you have created
your project, open `.firebaserc` file at the top level directory and replace the default
project id with you own project id:

```json
{
  "projects": {
    "default": "< your project id >"
  }
}
```

This project uses:

- Authentication
- Firestore Database
- Functions
- Hosting

### Firebase Github integration (kind of optional...)

> If you don't want to setup hosting Github integration, you may want to delete the files
> in the `.github` directory.

You can setup [github integration](https://firebase.google.com/docs/hosting/github-integration)
and deploy/preview changes in hosting from pull requests in you own Github repository.

Answer `y` to this prompt:

> `Set up the workflow to run a build script before every deploy? (y/N)`

Answer `yarn build` to this prompt:

> `What script should be run before every deploy?`

Answer `y` to this prompt to override the existing configuration:

> `GitHub workflow file for PR previews exists. Overwrite? firebase-hosting-pull-request.yml`

Answer `y` to this prompt:

> `Set up automatic deployment to your site's live channel when a PR is merged?`

Type the name of the associated branch in this prompt (this project uses `main`):

> `What is the name of the GitHub branch associated with your site's live channel?`

Answer `y` to this prompt to override the existing configuration:

> `The GitHub workflow file for deploying to the live channel already exists. Overwrite? firebase-hosting-merge.yml`

## Running Quiet Notes locally using the Firebase emulators

### Prerequisites

- Node.js >= 18
- pnpm >= 7
- Firebase CLI: `npm install -g firebase-tools`

### Setup and Run

```bash
# 1. Install dependencies
pnpm install

# 2. Bootstrap environment (generates .env files and sets Firebase config)
./bootstrap.sh
# You'll be prompted for default admin email (or press enter for admin@example.com)
# Or run non-interactively with default admin (admin@example.com):
./bootstrap.sh --defaults

# 3. Start Firebase emulators (in one terminal)
./emulate.sh

# 4. Start web app on http://localhost:3000 (in another terminal)
cd quiet-notes-web && pnpm start:emulated
```

### First-time Local Dev Workflow

After the emulators and web app are running:

1. Sign up / log in with the admin email you configured during bootstrap
2. The default admin is automatically granted `admin`, `author`, and `user` roles — you can start creating notes immediately
3. To grant other users access, go to the Admin panel and toggle the `author` role for them
