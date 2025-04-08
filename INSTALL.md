> [!IMPORTANT] 
> This text file should explain how to deploy your website.
> You should write detailed description on:
> 1. All the packages you need to install
> 2. How to configure various servers (e.g., Nginx, Apache, etc)

# Table of Contents
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
- [Development Mode](#development-mode)
  - [Requirements](#requirements)
  - [Installing the required packages](#installing-the-required-packages)
  - [Initializing the backend](#initializing-the-backend)

# Getting Started

The following guide will walk you through deploying this web app for production.


`TODO: FINISH PROD DOCUMENTATION`


# Development Mode

The following guide will walk you through starting up an instance of this web app for development purposes.

## Requirements

Before you begin, ensure you have the following installed on your system:

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Node.js](https://nodejs.org/en/download)

## Installing the required packages

`cd` into the root directory and perform the following:

```sh
cd ./frontend && npm i
cd ../backend && npm i
```

The following packages were added:
  - axios for routing
  - bootstrap and react-bootstrap for easier front-end development
  - qrcode.react for the displaying of QR codes

To install, simply follow the instructions above.

## Initializing the backend

This project uses prisma for its database. To initialize, `cd` into `/backend` and perform the following:

```sh
# /backend
npx prisma generate
npx prisma db push
```

- Optionally, seed the database with pre-made mock data:

    ```sh
    node prisma/seed.js
    ```

> [!TIP]
> Run `npx prisma studio` in `/backend` to open a visual editor for the data in your database

To start up the backend and begin accepting API requests, in a new terminal, run `index.js`:

```sh
node . PORT_NUM
```
- Replace `PORT_NUM` with a port you would like to run the backend on
- For example, port `3000` is commonly used: 

    ```sh
    node . 3000
    ```

At this point, your backend should be fully functional for development and testing purposes.
