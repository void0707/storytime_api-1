FROM node:14
RUN mkdir -p /src/user/app
WORKDIR /src/user/app
COPY package*json ./
copy . . 
RUN npm install
RUN npm install -g typescript
CMD ["npx","tsx","index.ts"]