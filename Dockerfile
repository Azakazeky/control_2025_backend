FROM node:18.6 as build

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build

FROM node:18.6

WORKDIR /app
COPY package.json .
COPY assetss ./assetss/
COPY pdfGenerateor ./pdfGenerateor/
COPY uploads/Exams ./uploads/Exams
COPY ashtar-a3c78-1cfaf78133a6.json ./
COPY firbasesec.json ./
COPY nis-control-bucket.json ./
COPY .env .

RUN chmod 777 ./pdfGenerateor
RUN chmod 777 ./uploads/Exams
RUN chmod 777 ./ashtar-a3c78-1cfaf78133a6.json

RUN npm install --only=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist  ./dist

CMD npm run start:prod

