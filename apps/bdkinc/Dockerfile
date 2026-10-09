FROM node:24-alpine

WORKDIR /app

COPY . .

RUN npm ci

ARG WORDPRESS_URL
ENV WORDPRESS_URL=${WORDPRESS_URL}
ARG BDK_GA4_ID
ENV BDK_GA4_ID=${BDK_GA4_ID}

RUN npm run build -w apps/bdkinc

ENV NODE_ENV=production
ENV PORT=4321

EXPOSE 4321

CMD ["npm", "run", "start", "-w", "apps/bdkinc"]
