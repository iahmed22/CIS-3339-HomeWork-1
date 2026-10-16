<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from './components/AppSidebar.vue';
import { useSchoolStore } from './stores/school';

const route = useRoute();
const store = useSchoolStore();
const pageTitle = computed(() => route.meta.title || 'Student Hub');
watch(() => store.notice, (notice) => {
  if (!notice) return;
  window.clearTimeout(window.noticeTimer);
  window.noticeTimer = window.setTimeout(() => store.clearNotice(), 5000);
});
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="main-area">
      <header class="topbar"><div class="breadcrumb"><span>Workspace</span><span class="crumb-slash">/</span><strong>{{ pageTitle }}</strong></div><div class="topbar-user"><span class="campus-avatar">UH</span><span><strong>Cougar Campus</strong><small>Student administration</small></span></div></header>
      <div v-if="store.notice" class="toast" :class="store.notice.type" role="status"><span>{{ store.notice.type === 'success' ? '✓' : '!' }}</span>{{ store.notice.message }}<button aria-label="Dismiss message" @click="store.clearNotice">×</button></div>
      <RouterView v-slot="{ Component, route: viewRoute }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="viewRoute.path" />
        </Transition>
      </RouterView>
      <footer class="footer"><span>Cougar Registrar</span><span>Student · Course · Enrollment</span></footer>
    </main>
  </div>
</template>
