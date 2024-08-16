### These are the steps to initialise this repo locally

1) clone the repo
2) run npm install in both frontend and backend
3) create the .env files for enviornment variables
4) run postgres instance 
```
docker run postgres -d -e POSTGRES_PASSWORD=whateversupersecretpassword -p 5432:5432 posgtres
```
5) After setting up postgress locally , go to the backend/db directory in your terminal and type the code below to migrate the database:
```
npx prisma migrate dev
```
5) After migrating the database , you would need to generate the prisma client 
```
npx prisa generate
```
6) This will generate the client and you are good to go
7) For backend to start , run:  /if you dont have typescript installed already , run : npm install -g typescript
```
tsc -b
node dist/index.js
```
8) For frontend run:
```
npm run dev
```

