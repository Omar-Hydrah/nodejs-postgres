from node:16
workdir /usr/src/app
copy ["package.json", "package-lock.json", ".env", "./"]
copy ./src ./src
run npm install
cmd npm run start
