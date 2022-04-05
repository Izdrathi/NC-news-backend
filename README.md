# Northcoders News API

## 1. Introduction

Nortcoders news API is used for accessing application data programmatically - this will provide data to the front end.
It's using PSQL for database and node-postgres for interaction between the two.

Hosted version link:
https://nc-news-backend1.herokuapp.com/api

## 2. Git instructions

To clone the repo, navigate to the Code button and copy the link using HTTPS option. In your terminal, go to the location where you want the cloned repo to be. Type `git clone` and then paste the URL you copied earlier and press enter to create your local clone.

`$ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`

cd into the newly created folder and run command below to get all required dependancies

```
npm install
```

## 3. Technologies

Node.js version required:

```
v16.14.2
```

PostgreSQL version required:

```
v12.9
```

## 4. Database connection details

To ensure correct connection to the database create separate .env files - one for testing purposes and one for development purposes. Testing DB has a fraction of data available to make it easier to run queries and debug.

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

-   Testing

```
npm run test
```
