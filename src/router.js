import { createRouter, createWebHistory } from 'vue-router';
import StudentsView from './views/StudentsView.vue';
import CoursesView from './views/CoursesView.vue';
import EnrollmentsView from './views/EnrollmentsView.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/students' },
    { path: '/students', component: StudentsView, meta: { title: 'Students' } },
    { path: '/courses', component: CoursesView, meta: { title: 'Courses' } },
    { path: '/enrollments', component: EnrollmentsView, meta: { title: 'Enrollment' } },
    { path: '/:pathMatch(.*)*', redirect: '/students' },
  ],
  scrollBehavior: () => ({ top: 0 }),
});
