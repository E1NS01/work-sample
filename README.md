# Backend Engineer Work Sample

This project is a basic express setup with endpoints for user management and testing.

## Features

-   User creation and retrieval endpoints
-   Test endpoints
-   Error handling middleware
-   Connection to MongoDB database
-   Unit tests with Jest

## Getting Started

These instructions will get you a copy of this project up and running on yout local machine.

### Prerequisites

-   Node.js
-   MongoDB
-   Docker

### Installation

1. Clone the repository
2. Install dependencies with `npm install` or `yarn install`
3. Copy `.env.example` to `.env` and fill in your MongoDB connection details and desired port

### Running the Application

-   To start the server, run `npm start` or `yarn start`

-   To start the delopment server, run `npm dev`or `yarn dev`

### Running the Tests

-   To execute tests, run `npm test` or `yarn test`

## Endpoints

-   POST /users: Accepts a user and stores it in the database, it should have a name and a email address.
-   GET /users: Returns all users from the database. This endpoint can recieve a query parameter `created`, which sorts users by creation date ascending or descending

### Endpoints for testing

-   GET /test: returns a `test` message.
-   Get /test-error: Throws an error for testing error handling.

## Example Usage

### Creating a user

To create a user, make a POST request to the `/users` endpoint with a JSON body containing the user's name and email address:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"name":"John Doe", "email":"john@example.com}' http://localhost:3111/users
```

### Retrieve Users

To retrieve all users make a GET request to the `/users` endpoint:

```sh
curl -X GET http://localhost:3111/users
```

You can also sort users by breation date by adding a `created` query parameter (accepts `ascending` and `descending`). For example:

```sh
curl -X GET http://localhost:3111/users?created=decscending
```

## Goal

1. Adjust POST /users that it accepts a user and stores it in a database.
    - The user should have a unique id, a name, a unique email address and a creation date
2. Adjust GET /users that it returns (all) users from the database.
    - This endpoint should be able to receive a query parameter `created` which sorts users by creation date ascending or descending.
