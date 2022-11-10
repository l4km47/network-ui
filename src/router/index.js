import { createRouter, createWebHistory } from "vue-router";
import NetworkGraph from "../views/NetworkGraph.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "network-graph",
      component: NetworkGraph,
    },
  ],
});

export default router;
