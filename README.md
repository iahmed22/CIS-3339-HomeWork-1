# CIS 3339 Homework 1

Student, course, and enrollment management app built with Vue 3, Express, and MongoDB.

## Run the app

You need **Node.js 20.19+ or 22.12+**, npm, and **MongoDB Community Edition** installed locally.

1. Start MongoDB Community Edition. On Windows, start the `MongoDB` service from the Services app. On macOS with Homebrew, run `brew services start mongodb-community`. On Linux, run `sudo systemctl start mongod`.
2. Open a terminal in this project folder (the folder containing `package.json`).
3. Install dependencies, build the frontend, and start the server:

   ```bash
   npm install
   npm run build
   npm start
   ```

4. Open **http://localhost:3000**.

Keep the terminal open while using the app. Press `Ctrl+C` there to stop the server.

In PowerShell, if the `npm` command is blocked by script policy, use `npm.cmd` in place of `npm`.

## Database configuration

The included `.env` file is ready for a local MongoDB installation:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
PORT=3000
```

The app connects to MongoDB at startup and creates its collections and unique indexes automatically. No Atlas account, database setup, migration, seed data, or import step is needed. Records remain in MongoDB when the server is restarted.

## Using the app

- **Students:** add a student, search by name or ID, and delete a record. Student IDs must be unique.
- **Courses:** add, view, and delete courses. Course IDs must be unique.
- **Enrollment:** choose a student and course to enroll them, then select a course to view its roster. Duplicate enrollments are rejected.

Deleting a student or a course also deletes the related enrollments.

## Development mode (optional)

Run the backend and frontend in separate terminals from the project folder. Start MongoDB first.

Terminal 1:

```bash
npm start
```

Terminal 2:

```bash
npm run dev
```

Open **http://localhost:5173**. Vite forwards `/api` requests to the backend at `http://localhost:3000`.

## API routes

| Method | Route | Action |
| --- | --- | --- |
| `GET` | `/api/students?search=` | List students or search by name/ID |
| `POST` | `/api/students` | Add a student |
| `DELETE` | `/api/students/:id` | Delete a student and their enrollments |
| `GET` | `/api/courses` | List courses |
| `POST` | `/api/courses` | Add a course |
| `DELETE` | `/api/courses/:id` | Delete a course and its enrollments |
| `GET` | `/api/enrollments?courseId=` | List enrollments, optionally filtered by course |
| `POST` | `/api/enrollments` | Enroll a student in a course |

The API returns `400` for invalid input, `404` when a record is missing, and `409` for a duplicate ID or enrollment.

## Troubleshooting

- **MongoDB connection error:** make sure MongoDB Community Edition is running and the URI in `.env` is correct.
- **Port 3000 is already in use:** stop the other process or change `PORT` in `.env`.
- **Frontend changes do not appear in production:** run `npm run build` again, then restart with `npm start`.

`node_modules/` and `dist/` are ignored by Git. Do not include `node_modules/` in a submission; install it locally with `npm install` when you need to run the app.
