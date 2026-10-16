<script setup>
import { computed, onMounted, ref } from 'vue';
import { useSchoolStore } from '../stores/school';

const store = useSchoolStore();
const query = ref('');
const form = ref({ name: '', id: '', phone: '', zip: '' });
const busy = ref(false);
const searched = ref(false);
const visibleStudents = computed(() => store.students);

async function refresh() {
  busy.value = true;
  try { await store.loadStudents(query.value); searched.value = true; }
  catch (error) { store.failure(error); }
  finally { busy.value = false; }
}
async function addStudent() {
  busy.value = true;
  try {
    await store.addStudent({ ...form.value });
    store.success(`${form.value.name.trim()} was added to the student directory.`);
    form.value = { name: '', id: '', phone: '', zip: '' };
    await store.loadStudents(query.value);
  } catch (error) { store.failure(error); }
  finally { busy.value = false; }
}
async function removeStudent(student) {
  if (!window.confirm(`Delete ${student.name}? Their enrollments will also be removed.`)) return;
  try { await store.deleteStudent(student._id); store.success(`${student.name} was deleted.`); }
  catch (error) { store.failure(error); }
}
onMounted(() => refresh());
</script>

<template>
  <section class="page-content">
    <div class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> DIRECTORY</div><h1>Student management</h1><p>Find, add, and manage student records in one place.</p></div><div class="heading-stamp"><span>✦</span> University of Houston</div></div>
    <div class="stat-strip"><div class="stat-card"><span class="stat-icon coral">♙</span><div><small>STUDENTS IN VIEW</small><strong>{{ visibleStudents.length }}</strong></div><span class="stat-note">{{ query ? 'matching results' : 'directory records' }}</span></div><div class="stat-card"><span class="stat-icon blue">⌕</span><div><small>QUICK SEARCH</small><strong class="stat-word">By name or ID</strong></div><span class="stat-note">Instant lookup</span></div><div class="stat-card"><span class="stat-icon mint">＋</span><div><small>DIRECTORY STATUS</small><strong class="stat-word">Up to date</strong></div><span class="status-pill"><i></i> Live</span></div></div>
    <div class="content-grid students-grid">
      <section class="panel directory-panel">
        <div class="panel-heading"><div><div class="section-kicker">STUDENT DIRECTORY</div><h2>Student records <span class="count-badge">{{ visibleStudents.length }}</span></h2></div><button class="subtle-button" @click="refresh" :disabled="busy">↻ <span>Refresh</span></button></div>
        <form class="search-bar" @submit.prevent="refresh"><span class="search-symbol" aria-hidden="true">⌕</span><label class="sr-only" for="student-search">Search by student name or ID</label><input id="student-search" v-model="query" placeholder="Search by student name or ID..." /><button type="submit" :disabled="busy">Search</button></form>
        <div v-if="busy && !searched" class="state-box"><span class="spinner"></span><p>Loading student directory…</p></div>
        <div v-else-if="visibleStudents.length" class="table-wrap"><table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>PHONE</th><th>ZIP CODE</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody><tr v-for="student in visibleStudents" :key="student._id"><td><div class="person-cell"><span class="person-avatar">{{ student.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase() }}</span><span><strong>{{ student.name }}</strong><small>Student</small></span></div></td><td><span class="mono-id">{{ student.id }}</span></td><td>{{ student.phone }}</td><td>{{ student.zip }}</td><td class="action-cell"><button class="icon-button delete-button" :aria-label="`Delete ${student.name}`" title="Delete student" @click="removeStudent(student)">⌫</button></td></tr></tbody></table></div>
        <div v-else class="state-box empty-state"><span class="empty-icon">⌕</span><strong>{{ query ? 'No matching students' : 'No students yet' }}</strong><p>{{ query ? 'Try a different name or student ID.' : 'Add your first student using the form.' }}</p><button v-if="query" class="text-button" @click="query = ''; refresh()">Clear search</button></div>
        <div class="table-foot"><span>Showing <strong>{{ visibleStudents.length }}</strong> {{ visibleStudents.length === 1 ? 'record' : 'records' }}</span><span class="sync-note"><i></i> Synced with student database</span></div>
      </section>
      <section class="panel form-panel">
        <div class="panel-heading"><div><div class="section-kicker">NEW RECORD</div><h2>Add a student</h2></div><span class="form-badge">＋</span></div>
        <p class="panel-intro">Enter the student’s details to add them to the directory.</p>
        <form class="field-stack" @submit.prevent="addStudent">
          <label>Full name <span class="required">*</span><input v-model.trim="form.name" autocomplete="name" placeholder="e.g. Jordan Lee" required maxlength="100" /></label>
          <label>Student ID <span class="required">*</span><input v-model.trim="form.id" inputmode="numeric" placeholder="e.g. 1001" required maxlength="30" /></label>
          <div class="two-fields"><label>Phone number <span class="required">*</span><input v-model.trim="form.phone" type="tel" autocomplete="tel" placeholder="555-123-4567" required maxlength="30" /></label><label>ZIP code <span class="required">*</span><input v-model.trim="form.zip" inputmode="numeric" autocomplete="postal-code" placeholder="77004" required maxlength="12" /></label></div>
          <div class="form-hint"><span>ⓘ</span> All fields are required. Student IDs must be unique.</div>
          <button class="primary-button" type="submit" :disabled="busy"><span>＋</span> {{ busy ? 'Saving…' : 'Add student' }} <span class="button-arrow">→</span></button>
        </form>
        <div class="privacy-note"><span aria-hidden="true">▣</span><p><strong>Student information is secure</strong><small>Records are stored in your local MongoDB database.</small></p></div>
      </section>
    </div>
  </section>
</template>
