export default {
  path: "/customer",
  redirect: "/customer/index",
  meta: {
    icon: "ep:home-filled",
    title: "客户管理",
    rank: 0
  },
  children: [
    {
      path: "/customer/index",
      name: "Customer",
      component: () => import("@/views/channel/index.vue"),
      meta: {
        title: "客户管理",
      }
    }
  ]
} satisfies RouteConfigsTable;