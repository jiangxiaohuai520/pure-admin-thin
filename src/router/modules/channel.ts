export default {
  path: "/channel",
  redirect: "/channel/index",
  meta: {
    icon: "ep:home-filled",
    title: "渠道管理",
    rank: 0
  },
  children: [
    {
      path: "/channel/index",
      name: "Channel",
      component: () => import("@/views/channel/index.vue"),
      meta: {
        title: "渠道管理",
      }
    }
  ]
} satisfies RouteConfigsTable;