FROM node:24-alpine

WORKDIR /app

COPY . .

RUN npm ci

ARG WORDPRESS_URL
ENV WORDPRESS_URL=${WORDPRESS_URL}

RUN npm run build -w apps/design-editorial

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4322

EXPOSE 4322

CMD ["npm", "run", "start", "-w", "apps/design-editorial"]
