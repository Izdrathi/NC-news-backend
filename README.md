# Northcoders News API

## 1. Introduction

Nortcoders news API is used for accessing application data programmatically - this will provide data to the front end.
It's using PSQL for database and node-postgres for interaction between the two.

It was created during my time with Nortcoders as my backend solo project.

Hosted version link:
https://nc-news-backend1.herokuapp.com/api

## 2. Git instructions

Clone the repository from github using below code in your desired folder location.

`$ git clone https://github.com/Izdrathi/NC-news-backend`

cd into the newly created folder and run command below to get all required dependancies

```
npm install
```

## 3. Required technologies

Node.js version:

```
v16.14.2
```

PostgreSQL version:

```
v12.9
```

## 4. Database connection details

To ensure local connection to the database create separate .env files - one for testing purposes and one for development purposes. Testing DB has a fraction of data available to make it easier to run queries and debug.

```
touch .env.test
touch .env.development
```

Each of them should include:

```
PGDATABASE=<database_name_here>
```

**Ensure these files are added into the .gitignore file.**

## 5. DB seeding and testing

Package.json includes several scripts:

-   DB setup

```
npm run setup-dbs
```

-   DB seeding for testing/development

```
npm run seed
```

-   DB seeding for production

```
npm run seed:prod
```

-   Testing via Jest

```
npm run test
```

## 6. Starting the server

Run `npm start` in your terminal to start the server - you can view it locally via [http://localhost:9090/api](http://localhost:9090/api) in your web browser - this address will provide all the endpoints available and can be further expanded within endpoints.json.
