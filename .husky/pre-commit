#!/bin/bash
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit messages
npx commitlint --edit "$1"

docker compose up lint-yaml --exit-code-from lint-yaml
docker compose up lint-filenames --exit-code-from lint-filenames
docker compose up lint-folders --exit-code-from lint-folders
docker compose up lint-dockerfile-app --exit-code-from lint-dockerfile-app
docker compose up lint-dockerfile-docs --exit-code-from lint-dockerfile-docs

npm run lint
npm test

# Shebang files should be executable
find . -type f -iname "*.sh" -exec chmod +x {} \;
