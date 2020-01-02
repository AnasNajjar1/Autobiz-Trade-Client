FROM node:10 as node_build
COPY ./ /app
WORKDIR /app
RUN npm install && npm rebuild node-sass && npm run-script build 

FROM nginx:alpine
COPY ./container/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node_build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
