# base image
FROM node:jessie

# install dependencies
RUN apt-get update
RUN apt-get -y install \
    libgtk2.0-0 libgtk-3-0 libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1 \
    curl \
    make \
    gcc \
    g++ \
    gfortran \
    libcurl4-gnutls-dev \
    libxml2-dev \
    default-jdk \
    openssl
    #texlive-*

# install R
ENV R_VERSION 3.6.2
RUN curl -O https://cran.rstudio.com/src/base/R-3/R-${R_VERSION}.tar.gz
RUN tar -xzvf R-${R_VERSION}.tar.gz && cd R-${R_VERSION} && \
    ./configure \
    --prefix=/opt/R/${R_VERSION} \
    --enable-memory-profiling \
    --enable-R-shlib \
    --with-blas \
    --with-lapack && \
    make && make install

RUN ln -s /R-${R_VERSION}/bin/R /usr/local/bin/R
RUN ln -s /R-${R_VERSION}/bin/Rscript /usr/local/bin/Rscript

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install

COPY . /app
COPY startup.sh /app

# start app
CMD sh -C '/app/startup.sh'
