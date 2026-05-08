# Build stage
FROM denoland/deno:alpine AS builder
WORKDIR /app
COPY . .
# Install dependencies (use just `deno install` if deno.json has imports)
RUN deno install --entrypoint src/main.ts

# Production stage
FROM denoland/deno:alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-env", "--allow-net", "--allow-read", "--allow-write", "src/main.ts"]
