FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
# prisma.config.ts requires DATABASE_URL to be set, even though `prisma generate`
# doesn't connect to the database. The real value is provided at runtime.
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
RUN npx prisma generate

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["node", "src/server.js"]
