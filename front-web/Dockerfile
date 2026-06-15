FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# Drop the lockfile: it was generated on macOS and is missing the Linux/musl
# optional deps (e.g. @rollup/rollup-linux-*-musl), which breaks the build (npm/cli#4828).
RUN rm -f package-lock.json && npm install
COPY . .

ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
