# CIS 3339 Homework 1 — Cougar Student Hub

A full stack student management application built with Vue 3, Vue Router, Pinia, Express, and MongoDB Community Edition. The app provides student search and management, a course catalog, and course enrollment rosters.

## Requirements

- Node.js 20.19+ or 22.12+ and npm
- MongoDB Community Edition running locally

The committed `.env` uses `mongodb://127.0.0.1:27017/cis3339_homework1` and port `3000`. Change these values only if your local MongoDB uses a different address or port. No cloud database or credentials are required.

## Start MongoDB

Install MongoDB Community Edition for your operating system and start its local service. On Windows, the default MSI installation normally registers MongoDB as a Windows service; start the **MongoDB Server** service from Services if it is not already running. On macOS with Homebrew, run `brew services start mongodb-community`. On Linux, run `sudo systemctl start mongod`.

## Install and run

From the project root:

```bash
npm install
npm run build
npm start
```

Open **http://localhost:3000**. Express serves the compiled Vue application and API from the same origin. The MongoDB collections and unique indexes are initialized automatically on startup, including when the database is empty. Student, course, and enrollment records persist in MongoDB after restarting the server.

For frontend development, use two terminals after installing dependencies:

```bash
npm start
```

```bash
npm run dev
```

Vite runs at **http://localhost:5173** and proxies `/api` requests to Express on port 3000.

## Features

- Add, search by name or ID, list, and delete students. Student IDs must be unique.
- Add, list, and delete courses. Course IDs must be unique.
- Enroll existing students in existing courses, prevent duplicate enrollments, and view course rosters.
- Deleting a student or course removes its related enrollments.
- Responsive Vue Router views share server data through a Pinia store and show loading, empty, success, validation, and error states.
- MongoDB is the only persistence layer. `backend/students.json` from the starter is not used.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/students?search=` | List/search students by name or exact ID |
| POST | `/api/students` | Add student (`name`, `id`, `phone`, `zip`) |
| DELETE | `/api/students/:id` | Delete a student and their enrollments |
| GET | `/api/courses` | List courses |
| POST | `/api/courses` | Add course (`courseId`, `name`) |
| DELETE | `/api/courses/:id` | Delete a course and its enrollments |
| GET | `/api/enrollments?courseId=` | List enrollments or filter by course |
| POST | `/api/enrollments` | Enroll (`studentId`, `courseId`) |

Duplicate IDs and enrollments return HTTP 409. Invalid input returns HTTP 400; missing records return HTTP 404.

## Project layout

```text
src/                 Vue app, router, views, reusable navigation, Pinia store
backend/server.js    Express API, Mongoose schemas, and production static hosting
.env                 Local MongoDB connection and port
vite.config.js       Vite build and development API proxy
```
