FROM ubuntu:18.04 AS alexandreclayton-myzap2-dev
WORKDIR /usr/src/app
EXPOSE 3332

RUN apt-get update && apt-get install -y \
	gconf-service \
	libasound2 \
	libatk1.0-0 \
	libc6 \
	libcairo2 \
	libcups2 \
	libexpat1 \
	libfontconfig1 \
	libgcc1 \
	libgconf-2-4 \
	libgdk-pixbuf2.0-0 \
	libglib2.0-0 \
	libgtk-3-0 \
	libnspr4 \
	libpango-1.0-0 \
	libpangocairo-1.0-0 \
	libstdc++6 \
	libx11-6 \
	libx11-xcb1 \
	libxcb1 \
	libxcomposite1 \
	libxcursor1 \
	libxdamage1 \
	libxext6 \
	libxfixes3 \
	libxi6 \
	libxrandr2 \
	libxrender1 \
	libxss1 \
	libxtst6 \
	ca-certificates \
	fonts-liberation \
	libappindicator1 \
	libnss3 \
	lsb-release \
	xdg-utils \
	wget \
	build-essential \
	apt-transport-https \
	libgbm-dev \
	git

RUN apt-get install curl -y \
	&& curl -sL https://deb.nodesource.com/setup_16.x | bash - \
	&& apt-get install -y nodejs

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
	&& apt install -y ./google-chrome-stable_current_amd64.deb

#CMD node index.js
CMD npm install ; node index.js

#FROM alexandreclayton-myzap2-dev AS alexandreclayton-myzap2-prod
#WORKDIR /usr/src/app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN rm -rf .env
#COPY .env.prod ./.env
#EXPOSE 3332
#CMD node index.js

#
# Build Image & Run
#
# Builder
# docker build --tag=alexandreclayton-myzap2:dev .
# Run Container
# docker run -p 3333:3333 --rm --name alexandreclayton-myzap2-dev -v /home/sette/Projects/MyZap/alexandreclayton-myzap:/usr/src/app alexandreclayton-myzap2:dev
