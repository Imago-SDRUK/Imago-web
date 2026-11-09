FROM node:24-slim AS base
ENV NODE_ENV=production
ENV TURBO_TELEMETRY_DISABLED=1
ENV BUILDING=true
ENV CI=true

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"

RUN corepack enable
RUN corepack enable && \
  pnpm add -g turbo

FROM base AS builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN turbo prune data_catalogue --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN --mount=type=secret,id=TURBO_API \
  --mount=type=secret,id=TURBO_TEAM \
  --mount=type=secret,id=TURBO_TOKEN \
  --mount=type=secret,id=SENTRY_ORG \
  --mount=type=secret,id=SENTRY_PROJECT \
  --mount=type=secret,id=SENTRY_AUTH_TOKEN \
  --mount=type=secret,id=BRANCH \
  --mount=type=secret,id=SENTRY_RELEASE \
  export TURBO_API=$(cat /run/secrets/TURBO_API) && \
  export TURBO_TEAM=$(cat /run/secrets/TURBO_TEAM) && \
  export TURBO_TOKEN=$(cat /run/secrets/TURBO_TOKEN) && \
  export SENTRY_ORG=$(cat /run/secrets/SENTRY_ORG) && \
  export SENTRY_PROJECT=$(cat /run/secrets/SENTRY_PROJECT) && \
  export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) && \
  export BRANCH=$(cat /run/secrets/BRANCH) && \
  export SENTRY_RELEASE=$(cat /run/secrets/SENTRY_RELEASE) && \
  export SENTRY_LOG_LEVEL=debug && \
  pnpm build

# RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
# RUN rm -rf ./**/*/src


FROM base AS sveltekit
WORKDIR /app/apps/data_catalogue/

# installed as root, before dropping to non-root 'svelte' user, as apt-get needs root
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && \
  curl -sL https://aka.ms/InstallAzureCLIDeb | bash && \
  rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --home /home/svelte --ingroup nodejs svelte
USER svelte

COPY --chown=svelte:nodejs --from=installer /app/node_modules /app/node_modules
COPY --chown=svelte:nodejs --from=installer /app/apps/data_catalogue/node_modules ./node_modules

COPY --chown=svelte:nodejs --from=installer /app/apps/data_catalogue/build ./build
COPY --chown=svelte:nodejs --from=builder /app/apps/data_catalogue/src/lib/db/migrations ./migrations

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
