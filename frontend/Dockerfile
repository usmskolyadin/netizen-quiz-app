from node:20

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]

EXPOSE 3000