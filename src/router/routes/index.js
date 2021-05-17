import { lazy } from "react";

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/home";

// ** Merge Routes
const Routes = [
  {
    path: "/home",
    component: lazy(() => import("../../views/Home")),
  },
  {
    path: "/registration",
    component: lazy(() => import("../../views/Registration")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/add-advertisement",
    exact: true,
    component: lazy(() => import("../../views/CreateUpdateAdvertisement")),
  },
  {
    path: "/update-advertisement/:id",
    exact: true,
    component: lazy(() => import("../../views/CreateUpdateAdvertisement")),
  },

  {
    path: "/advertisement",
    component: lazy(() => import("../../views/ViewAdvertisement")),
  },
  {
    path: "/forgot-password",
    component: lazy(() => import("../../views/ForgotPassword")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/reset-password",
    component: lazy(() => import("../../views/ResetPassword")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },

  {
    path: "/my-profile-edit",
    component: lazy(() => import("../../views/EditProfile")),
  },
  {
    path: "/my-profile",
    component: lazy(() => import("../../views/ViewProfile")),
  },
  {
    path: "/login",
    component: lazy(() => import("../../views/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/error",
    component: lazy(() => import("../../views/Error")),
    layout: "BlankLayout",
  },
];

export { DefaultRoute, TemplateTitle, Routes };
