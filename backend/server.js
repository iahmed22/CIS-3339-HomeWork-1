const path = require('node:path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();
app.use(express.json());

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  id: { type: String, required: true, trim: true, unique: true },
  phone: { type: String, required: true, trim: true },
  zip: { type: String, required: true, trim: true },
}, { timestamps: true });
const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, trim: true, unique: true },
  name: { type: String, required: true, trim: true },
}, { timestamps: true });
const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const notFound = (res, entity) => res.status(404).json({ error: `${entity} not found.` });

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/students', asyncRoute(async (req, res) => {
  const term = String(req.query.search || '').trim();
  const filter = term ? { $or: [
    { name: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
    { id: term },
  ] } : {};
  res.json(await Student.find(filter).sort({ name: 1 }));
}));
app.post('/api/students', asyncRoute(async (req, res) => {
  const { name, id, phone, zip } = req.body;
  if (![name, id, phone, zip].every((v) => typeof v === 'string' && v.trim())) return res.status(400).json({ error: 'Name, student ID, phone, and ZIP code are required.' });
  const student = await Student.create({ name, id, phone, zip });
  res.status(201).json(student);
}));
app.delete('/api/students/:id', asyncRoute(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return notFound(res, 'Student');
  await Enrollment.deleteMany({ student: student._id });
  res.json({ message: 'Student deleted.', student });
}));
app.get('/api/courses', asyncRoute(async (req, res) => res.json(await Course.find().sort({ courseId: 1 }))));
app.post('/api/courses', asyncRoute(async (req, res) => {
  const { courseId, name } = req.body;
  if (![courseId, name].every((v) => typeof v === 'string' && v.trim())) return res.status(400).json({ error: 'Course ID and course name are required.' });
  res.status(201).json(await Course.create({ courseId, name }));
}));
app.delete('/api/courses/:id', asyncRoute(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return notFound(res, 'Course');
  await Enrollment.deleteMany({ course: course._id });
  res.json({ message: 'Course deleted.', course });
}));
app.get('/api/enrollments', asyncRoute(async (req, res) => {
  const filter = req.query.courseId ? { course: req.query.courseId } : {};
  res.json(await Enrollment.find(filter).populate('student').populate('course').sort({ createdAt: -1 }));
}));
app.post('/api/enrollments', asyncRoute(async (req, res) => {
  const { studentId, courseId } = req.body;
  if (!studentId || !courseId) return res.status(400).json({ error: 'Choose both a student and a course.' });
  const [student, course] = await Promise.all([Student.findById(studentId), Course.findById(courseId)]);
  if (!student || !course) return res.status(404).json({ error: 'The selected student or course no longer exists.' });
  const enrollment = await Enrollment.create({ student: student._id, course: course._id });
  res.status(201).json(await enrollment.populate(['student', 'course']));
}));

app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*path', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err?.code === 11000) return res.status(409).json({ error: 'That ID is already in use.' });
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) return res.status(400).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'The server could not complete that request.' });
});

const port = Number(process.env.PORT) || 3000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cis3339_homework1')
  .then(() => Promise.all([Student.init(), Course.init(), Enrollment.init()]))
  .then(() => app.listen(port, () => console.log(`Cougar Student Hub is running at http://localhost:${port}`)))
  .catch((error) => { console.error('Could not connect to local MongoDB:', error.message); process.exit(1); });
