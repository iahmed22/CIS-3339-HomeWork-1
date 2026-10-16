import { defineStore } from 'pinia';

async function request(path, options) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

export const useSchoolStore = defineStore('school', {
  state: () => ({ students: [], courses: [], enrollments: [], loading: false, notice: null }),
  actions: {
    async loadStudents(search = '') { this.students = await request(`/students${search ? `?search=${encodeURIComponent(search)}` : ''}`); },
    async loadCourses() { this.courses = await request('/courses'); },
    async loadEnrollments(courseId = '') { this.enrollments = await request(`/enrollments${courseId ? `?courseId=${encodeURIComponent(courseId)}` : ''}`); },
    async addStudent(student) { const row = await request('/students', { method: 'POST', body: JSON.stringify(student) }); this.students.push(row); return row; },
    async deleteStudent(id) { await request(`/students/${id}`, { method: 'DELETE' }); this.students = this.students.filter((student) => student._id !== id); this.enrollments = this.enrollments.filter((item) => item.student?._id !== id); },
    async addCourse(course) { const row = await request('/courses', { method: 'POST', body: JSON.stringify(course) }); this.courses.push(row); return row; },
    async deleteCourse(id) { await request(`/courses/${id}`, { method: 'DELETE' }); this.courses = this.courses.filter((course) => course._id !== id); this.enrollments = this.enrollments.filter((item) => item.course?._id !== id); },
    async addEnrollment(studentId, courseId) { const row = await request('/enrollments', { method: 'POST', body: JSON.stringify({ studentId, courseId }) }); this.enrollments.unshift(row); return row; },
    success(message) { this.notice = { type: 'success', message }; },
    failure(error) { this.notice = { type: 'error', message: error.message || String(error) }; },
    clearNotice() { this.notice = null; },
  },
});
