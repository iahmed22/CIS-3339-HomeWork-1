<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const links = [
  { to: '/students', label: 'Students', hint: 'People directory', icon: 'people' },
  { to: '/courses', label: 'Courses', hint: 'Academic catalog', icon: 'book' },
  { to: '/enrollments', label: 'Enrollment', hint: 'Class rosters', icon: 'arrows' },
];
</script>
<template>
  <aside class="sidebar">
    <RouterLink to="/students" class="brand" aria-label="Cougar Registrar home">
      <span class="brand-mark">UH</span><span class="brand-copy"><strong>Cougar Registrar</strong><small>STUDENT SERVICES</small></span>
    </RouterLink>
    <div class="nav-caption">RECORDS</div>
    <nav aria-label="Main navigation" class="side-nav">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link" :class="{ active: route.path === link.to }">
        <svg v-if="link.icon === 'people'" class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19v-1.2A4.8 4.8 0 0 1 8.3 13h1.4a4.8 4.8 0 0 1 4.8 4.8V19M16 5.4a3 3 0 0 1 0 5.8M17 13.2a4.8 4.8 0 0 1 3.5 4.6V19"/></svg>
        <svg v-else-if="link.icon === 'book'" class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4.5h13.5A1.5 1.5 0 0 1 20 6v14H6a2 2 0 0 1-2-2V5.5a1 1 0 0 1 1-1Z"/><path d="M4 17a2 2 0 0 1 2-2h14M8 8h8M8 11h6"/></svg>
        <svg v-else class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7h12l-3-3M17 17H5l3 3M19 7l-3 3M5 17l3-3"/></svg>
        <span class="nav-text"><strong>{{ link.label }}</strong><small>{{ link.hint }}</small></span><span v-if="route.path === link.to" class="nav-current" aria-hidden="true"></span>
      </RouterLink>
    </nav>
    <div class="sidebar-bottom"><span class="campus-seal">C</span><div><strong>CIS 3339 · Homework 1</strong><small>Student management system</small></div></div>
  </aside>
</template>
