FROM node:alpine

RUN mkdir -p /home/clash-hai-bhai
WORKDIR /home/calsh-hai-bhai

COPY . /home/calsh-hai-bhai/

RUN npm install

RUN npm run build

EXPOSE 3000

CMD npm run start