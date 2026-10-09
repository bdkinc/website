FROM node:24-alpine

WORKDIR /app

COPY . .

RUN npm ci

ARG WORDPRESS_URL
ENV WORDPRESS_URL=${WORDPRESS_URL}

RUN npm run build -w apps/design-systems

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4323

EXPOSE 4323

CMD ["npm", "run", "start", "-w", "apps/design-systems"]
