<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useSchoolStore } from '../stores/school';
const store = useSchoolStore();
const form = ref({ studentId: '', courseId: '' });
const selectedCourse = ref('');
const busy = ref(false);
const roster = computed(() => selectedCourse.value ? store.enrollments.filter((row) => row.course?._id === selectedCourse.value) : store.enrollments);
async function refresh() {
  busy.value = true;
  try { await Promise.all([store.loadStudents(), store.loadCourses(), store.loadEnrollments(selectedCourse.value)]); }
  catch (error) { store.failure(error); }
  finally { busy.value = false; }
}
async function enroll() {
  busy.value = true;
  try { const row = await store.addEnrollment(form.value.studentId, form.value.courseId); selectedCourse.value = row.course._id; form.value.studentId = ''; store.success(`${row.student.name} enrolled in ${row.course.courseId}.`); await refresh(); }
  catch (error) { store.failure(error); }
  finally { busy.value = false; }
}
watch(selectedCourse, async (id) => { try { await store.loadEnrollments(id); } catch (error) { store.failure(error); } });
onMounted(refresh);
</script>

<template>
  <section class="page-content">
    <div class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> CLASS ROSTERS</div><h1>Enrollment</h1><p>Enroll students in courses and review class rosters.</p></div><div class="heading-stamp"><span>✦</span> University of Houston</div></div>
    <div class="stat-strip"><div class="stat-card"><span class="stat-icon coral">⇄</span><div><small>TOTAL ENROLLMENTS</small><strong>{{ store.enrollments.length }}</strong></div><span class="stat-note">in selected roster</span></div><div class="stat-card"><span class="stat-icon blue">♙</span><div><small>STUDENTS AVAILABLE</small><strong>{{ store.students.length }}</strong></div><span class="stat-note">ready to enroll</span></div><div class="stat-card"><span class="stat-icon mint">▤</span><div><small>COURSES AVAILABLE</small><strong>{{ store.courses.length }}</strong></div><span class="stat-note">in course catalog</span></div></div>
    <div class="enrollment-layout">
      <section class="panel form-panel enrollment-form-panel"><div class="panel-heading"><div><div class="section-kicker">NEW ENROLLMENT</div><h2>Enroll a student</h2></div><span class="form-badge">⇄</span></div><p class="panel-intro">Select a student and a course to create an enrollment.</p>
        <form class="field-stack" @submit.prevent="enroll"><label>Student <span class="required">*</span><select v-model="form.studentId" required><option value="" disabled>Select a student</option><option v-for="student in store.students" :key="student._id" :value="student._id">{{ student.name }} · {{ student.id }}</option></select></label><label>Course <span class="required">*</span><select v-model="form.courseId" required><option value="" disabled>Select a course</option><option v-for="course in store.courses" :key="course._id" :value="course._id">{{ course.courseId }} · {{ course.name }}</option></select></label><div v-if="!store.students.length || !store.courses.length" class="form-hint"><span>ⓘ</span> Add at least one student and one course before enrolling.</div><button class="primary-button" type="submit" :disabled="busy || !store.students.length || !store.courses.length"><span>＋</span> {{ busy ? 'Saving…' : 'Create enrollment' }} <span class="button-arrow">→</span></button></form>
        <div class="privacy-note"><span aria-hidden="true">✓</span><p><strong>Duplicate enrollments are prevented</strong><small>A student can only be enrolled once per course.</small></p></div>
      </section>
      <section class="panel roster-panel"><div class="panel-heading"><div><div class="section-kicker">COURSE ROSTER</div><h2>Enrolled students <span class="count-badge">{{ roster.length }}</span></h2></div></div><label class="roster-filter">View roster for<select v-model="selectedCourse"><option value="">All courses</option><option v-for="course in store.courses" :key="course._id" :value="course._id">{{ course.courseId }} · {{ course.name }}</option></select></label>
        <div v-if="busy && !store.enrollments.length" class="state-box"><span class="spinner"></span><p>Loading roster…</p></div>
        <div v-else-if="roster.length" class="table-wrap"><table><caption class="sr-only">Enrolled students</caption><thead><tr><th scope="col">STUDENT</th><th scope="col">STUDENT ID</th><th scope="col">COURSE</th></tr></thead><TransitionGroup name="list" tag="tbody"><tr v-for="row in roster" :key="row._id"><td><div class="person-cell"><span class="person-avatar">{{ row.student?.name?.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase() }}</span><span><strong>{{ row.student?.name }}</strong><small>Enrolled student</small></span></div></td><td><span class="mono-id">{{ row.student?.id }}</span></td><td><span class="course-chip">{{ row.course?.courseId }}</span></td></tr></TransitionGroup></table></div>
        <div v-else class="state-box empty-state"><span class="empty-icon">⇄</span><strong>No enrollments yet</strong><p>{{ selectedCourse ? 'There are no students in this course roster.' : 'Enroll a student to see them listed here.' }}</p></div>
        <div class="table-foot"><span>Showing <strong>{{ roster.length }}</strong> {{ roster.length === 1 ? 'student' : 'students' }}</span><span class="sync-note"><i></i> Roster updates automatically</span></div>
      </section>
    </div>
  </section>
</template>
