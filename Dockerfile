FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*

COPY . /usr/share/nginx/html

EXPOSE 80
