# base image
FROM node:slim

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN apt-get update
RUN apt-get -y install libgtk2.0-0 libgtk-3-0 libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1

# install R
RUN apt-get -y install r-base

COPY . /app
COPY startup.sh /app

# start app
CMD sh -C '/app/startup.sh'
