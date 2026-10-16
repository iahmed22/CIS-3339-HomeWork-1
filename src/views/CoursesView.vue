<script setup>
import { computed, onMounted, ref } from 'vue';
import { useSchoolStore } from '../stores/school';
const store = useSchoolStore();
const form = ref({ courseId: '', name: '' });
const busy = ref(false);
const sortedCourses = computed(() => [...store.courses].sort((a, b) => a.courseId.localeCompare(b.courseId)));
async function load() { busy.value = true; try { await store.loadCourses(); } catch (error) { store.failure(error); } finally { busy.value = false; } }
async function addCourse() {
  busy.value = true;
  try { const name = form.value.name.trim(); await store.addCourse({ courseId: form.value.courseId.trim(), name }); store.success(`${name} was added to the course catalog.`); form.value = { courseId: '', name: '' }; await load(); }
  catch (error) { store.failure(error); }
  finally { busy.value = false; }
}
async function removeCourse(course) {
  if (!window.confirm(`Delete ${course.courseId} — ${course.name}? Enrollments in this course will also be removed.`)) return;
  try { await store.deleteCourse(course._id); store.success(`${course.courseId} was deleted.`); }
  catch (error) { store.failure(error); }
}
onMounted(load);
</script>

<template>
  <section class="page-content">
    <div class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> ACADEMIC CATALOG</div><h1>Courses</h1><p>Maintain the courses available to your students.</p></div><div class="heading-stamp"><span>✦</span> University of Houston</div></div>
    <div class="stat-strip"><div class="stat-card"><span class="stat-icon coral">▤</span><div><small>COURSES IN CATALOG</small><strong>{{ store.courses.length }}</strong></div><span class="stat-note">available courses</span></div><div class="stat-card"><span class="stat-icon blue">↗</span><div><small>CATALOG ORDER</small><strong class="stat-word">By course ID</strong></div><span class="stat-note">Easy to browse</span></div><div class="stat-card"><span class="stat-icon mint">＋</span><div><small>CATALOG STATUS</small><strong class="stat-word">Up to date</strong></div><span class="status-pill"><i></i> Live</span></div></div>
    <div class="content-grid students-grid">
      <section class="panel directory-panel">
        <div class="panel-heading"><div><div class="section-kicker">COURSE CATALOG</div><h2>All courses <span class="count-badge">{{ store.courses.length }}</span></h2></div><button class="subtle-button" @click="load" :disabled="busy">↻ <span>Refresh</span></button></div>
        <div v-if="busy && !store.courses.length" class="state-box"><span class="spinner"></span><p>Loading courses…</p></div>
        <div v-else-if="sortedCourses.length" class="table-wrap"><table><caption class="sr-only">Course catalog</caption><thead><tr><th scope="col">COURSE</th><th scope="col">COURSE ID</th><th scope="col">ENROLLMENT</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><TransitionGroup name="list" tag="tbody"><tr v-for="(course, index) in sortedCourses" :key="course._id"><td><div class="course-cell"><span class="course-index">{{ String(index + 1).padStart(2, '0') }}</span><span><strong>{{ course.name }}</strong><small>Academic course</small></span></div></td><td><span class="course-chip">{{ course.courseId }}</span></td><td><span class="enrollment-label"><span class="enrollment-dot"></span> Available</span></td><td class="action-cell"><button class="icon-button delete-button" :aria-label="`Delete ${course.courseId}`" title="Delete course" @click="removeCourse(course)">⌫</button></td></tr></TransitionGroup></table></div>
        <div v-else class="state-box empty-state"><span class="empty-icon">▤</span><strong>No courses yet</strong><p>Add a course to start building your catalog.</p></div>
        <div class="table-foot"><span><strong>{{ store.courses.length }}</strong> {{ store.courses.length === 1 ? 'course' : 'courses' }} in the catalog</span><span class="sync-note"><i></i> Synced with course database</span></div>
      </section>
      <section class="panel form-panel">
        <div class="panel-heading"><div><div class="section-kicker">NEW COURSE</div><h2>Add a course</h2></div><span class="form-badge">＋</span></div>
        <p class="panel-intro">Create a course entry for the academic catalog.</p>
        <form class="field-stack" @submit.prevent="addCourse">
          <label>Course ID <span class="required">*</span><input v-model.trim="form.courseId" placeholder="e.g. CIS 3339" required maxlength="30" /></label>
          <label>Course name <span class="required">*</span><input v-model.trim="form.name" placeholder="e.g. Enterprise Applications Development" required maxlength="120" /></label>
          <div class="form-hint"><span>ⓘ</span> Both fields are required. Course IDs must be unique.</div>
          <button class="primary-button" type="submit" :disabled="busy"><span>＋</span> {{ busy ? 'Saving…' : 'Add course' }} <span class="button-arrow">→</span></button>
        </form>
        <div class="privacy-note"><span aria-hidden="true">▤</span><p><strong>Course catalog</strong><small>Courses are listed by course ID.</small></p></div>
      </section>
    </div>
  </section>
</template>
