FROM node:latest
RUN mkdir -p /usr/src/Passport
WORKDIR /usr/src/Passport
COPY package.json /usr/src/Passport
RUN npm install
COPY . /usr/src/Passport
EXPOSE 80
EXPOSE 443
CMD ['npm','start']


