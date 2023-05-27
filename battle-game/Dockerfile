FROM node:20-alpine
USER root
RUN mkdir -p /opt/app-root
WORKDIR /opt/app-root
COPY . ./
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
