<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const links = [
  { to: '/students', label: 'Students', icon: '♙', hint: 'Manage records' },
  { to: '/courses', label: 'Courses', icon: '▤', hint: 'Course catalog' },
  { to: '/enrollments', label: 'Enrollment', icon: '⇄', hint: 'Class rosters' },
];
const activePath = computed(() => route.path);
</script>

<template>
  <aside class="sidebar">
    <RouterLink to="/students" class="brand">
      <span class="brand-mark">C</span>
      <span class="brand-copy"><strong>Cougar</strong><small>STUDENT HUB</small></span>
    </RouterLink>
    <div class="nav-caption">WORKSPACE</div>
    <nav aria-label="Main navigation" class="side-nav">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link" :class="{ active: activePath === link.to }">
        <span class="nav-icon" aria-hidden="true">{{ link.icon }}</span>
        <span class="nav-text"><strong>{{ link.label }}</strong><small>{{ link.hint }}</small></span>
        <span v-if="activePath === link.to" class="nav-current" aria-hidden="true">›</span>
      </RouterLink>
    </nav>
    <div class="sidebar-bottom"><div class="online-dot"></div><div><strong>Local workspace</strong><small>MongoDB connected at run time</small></div></div>
  </aside>
</template>
