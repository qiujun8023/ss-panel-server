FROM node:8

ENV APP_ROOT /app
ENV NODE_ENV production

WORKDIR ${APP_ROOT}

COPY package.json package-lock.json src ${APP_ROOT}/
COPY config ${APP_ROOT}/config/

RUN npm install

EXPOSE 8000

CMD ["node", "index.js"]