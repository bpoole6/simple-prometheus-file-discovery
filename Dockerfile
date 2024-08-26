FROM node:12.22.0
COPY first-names.txt /first-names.txt
COPY web.js .
COPY package.json .
RUN npm install
ENTRYPOINT ["npm", "start"]