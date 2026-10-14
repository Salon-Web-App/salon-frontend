
set -euo pipefail

REGION="ap-south-1"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
REPO="${REGISTRY}/salon-app"

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is dirty. Commit or stash before pushing." >&2
  exit 1
fi

SHA="$(git rev-parse --short HEAD)"

aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$REGISTRY"

docker build --target runtime --build-arg GIT_SHA="$SHA" \
  -t "${REPO}:frontend-${SHA}" .
docker push "${REPO}:frontend-${SHA}"

echo "Pushed ${REPO}:frontend-${SHA}"