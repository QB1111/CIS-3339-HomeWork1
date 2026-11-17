import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });
const app = express();
app.use(express.json());
const required = { type: String, required: true, trim: true };
const studentSchema = new mongoose.Schema({ id: { ...required, unique: true }, name: required, phone: required, zip: required }, { versionKey: false });
const courseSchema = new mongoose.Schema({ id: { ...required, unique: true }, title: required }, { versionKey: false });
const enrollmentSchema = new mongoose.Schema({ studentId: required, courseId: required }, { versionKey: false });
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const clean = value => typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
const missing = (res, fields) => res.status(400).json({ error: `Required fields: ${fields.join(', ')}` });

app.get('/api/students', wrap(async (req, res) => res.json(await Student.find().sort({ name: 1 }).lean())));
app.post('/api/students', wrap(async (req, res) => {
  const student = Object.fromEntries(['id','name','phone','zip'].map(k => [k, clean(req.body[k])]));
  const absent = Object.keys(student).filter(k => !student[k]);
  if (absent.length) return missing(res, absent);
  const created = await Student.create(student);
  res.status(201).json({ message: 'Student added successfully', student: created });
}));
app.get('/api/students/search', wrap(async (req, res) => {
  const name = clean(req.query.name);
  if (!name) return missing(res, ['name']);
  const students = await Student.find({ name: { $regex: escapeRegex(name), $options: 'i' } }).sort({ name: 1 }).lean();
  res.json(students);
}));
function escapeRegex(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
app.delete('/api/students/:id', wrap(async (req, res) => {
  const student = await Student.findOneAndDelete({ id: req.params.id });
  if (!student) return res.status(404).json({ error: 'Student not found' });
  await Enrollment.deleteMany({ studentId: student.id });
  res.json({ message: 'Student deleted successfully' });
}));
app.get('/api/courses', wrap(async (req, res) => res.json(await Course.find().sort({ id: 1 }).lean())));
app.post('/api/courses', wrap(async (req, res) => {
  const course = { id: clean(req.body.id), title: clean(req.body.title) };
  const absent = Object.keys(course).filter(k => !course[k]);
  if (absent.length) return missing(res, absent);
  const created = await Course.create(course);
  res.status(201).json({ message: 'Course added successfully', course: created });
}));
app.delete('/api/courses/:id', wrap(async (req, res) => {
  const course = await Course.findOneAndDelete({ id: req.params.id });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  await Enrollment.deleteMany({ courseId: course.id });
  res.json({ message: 'Course deleted successfully' });
}));
app.post('/api/enrollments', wrap(async (req, res) => {
  const studentId = clean(req.body.studentId), courseId = clean(req.body.courseId);
  if (!studentId || !courseId) return missing(res, ['studentId', 'courseId']);
  const [student, course] = await Promise.all([Student.exists({ id: studentId }), Course.exists({ id: courseId })]);
  if (!student || !course) return res.status(400).json({ error: 'Student or course does not exist' });
  await Enrollment.create({ studentId, courseId });
  res.status(201).json({ message: 'Enrollment added successfully' });
}));
app.get('/api/courses/:id/students', wrap(async (req, res) => {
  const course = await Course.exists({ id: req.params.id });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const enrolled = await Enrollment.find({ courseId: req.params.id }).select('studentId -_id').lean();
  res.json(await Student.find({ id: { $in: enrolled.map(e => e.studentId) } }).sort({ name: 1 }).lean());
}));

// Compatibility with the starter project's endpoint names.
app.post('/add-student', (req,res,next) => { req.url='/api/students';app.handle(req,res,next); });
app.post('/find-student', wrap(async (req,res) => {
 const name=clean(req.body.name);
 if (!name) return missing(res,['name']);
 const student=await Student.findOne({name:{$regex:`^${escapeRegex(name)}$`,$options:'i'}}).lean();
 if (!student) return res.status(404).json({error:'Student not found'});
 res.json(student);
}));
app.post('/delete-student', wrap(async(req,res)=>{
 const name=clean(req.body.name);
 if (!name) return missing(res,['name']);
 const student=await Student.findOneAndDelete({name:{$regex:`^${escapeRegex(name)}$`,$options:'i'}});
 if(!student) return res.status(404).json({error:'Student not found'});
 await Enrollment.deleteMany({studentId:student.id});res.json({message:'Student deleted successfully'});
}));
app.get('/all-courses', wrap(async(req,res)=>res.json(await Course.find().lean())));
app.post('/add-course', (req,res,next)=>{req.url='/api/courses';app.handle(req,res,next)});
app.post('/delete-course', wrap(async(req,res)=>{
 const id=clean(req.body.id);const course=await Course.findOneAndDelete({id});
 if(!course)return res.status(404).json({error:'Course not found'});
 await Enrollment.deleteMany({courseId:id});res.json({message:'Course deleted successfully'});
}));
app.post('/enroll',(req,res,next)=>{req.url='/api/enrollments';app.handle(req,res,next)});
app.get('/course-students/:cid',wrap(async(req,res)=>{
 const ids=(await Enrollment.find({courseId:req.params.cid}).lean()).map(e=>e.studentId);
 res.json(await Student.find({id:{$in:ids}}).lean());
}));

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../frontend/dist');
app.use(express.static(dist));
app.get(/.*/, (req, res) => {
 if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API endpoint not found' });
 res.sendFile(path.join(dist, 'index.html'));
});
app.use((err, req, res, next) => {
 console.error(err);
 if (err.code === 11000) return res.status(409).json({ error: 'This ID or enrollment already exists' });
 if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(400).json({ error: err.message });
 res.status(500).json({ error: 'Server error. Please try again.' });
});
const port = Number(process.env.PORT) || 3000;
try {
 await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cis3339_homework1', { serverSelectionTimeoutMS: 5000 });
 await Promise.all([Student.init(), Course.init(), Enrollment.init()]);
 app.listen(port, () => console.log(`Open http://localhost:${port}`));
} catch (error) {
 console.error('MongoDB connection failed. Start local MongoDB Community Edition and check backend/.env:', error.message);
 process.exit(1);
}
