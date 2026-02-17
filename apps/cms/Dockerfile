FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/bdkinc/package.json apps/bdkinc/package.json
COPY apps/cms/package.json apps/cms/package.json
COPY packages/design-system/package.json packages/design-system/package.json

RUN npm ci

COPY . .

RUN npm run build -w apps/cms

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["npm", "run", "start", "-w", "apps/cms"]
