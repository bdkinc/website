FROM node:24-alpine

WORKDIR /app

COPY . .

RUN npm ci

ARG WORDPRESS_URL
ENV WORDPRESS_URL=${WORDPRESS_URL}

RUN npm run build -w apps/bdkinc

ENV NODE_ENV=production
ENV PORT=4321

EXPOSE 4321

CMD ["npm", "run", "start", "-w", "apps/bdkinc"]
