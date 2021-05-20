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
    component: lazy(() => import("../../views/users/Registration")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/advertisement/add-advertisement",
    exact: true,
    component: lazy(() => import("../../views/advertisement/CreateUpdateAdvertisement")),
  },
  {
    path: "/advertisement/update-advertisement/:id",
    exact: true,
    component: lazy(() => import("../../views/advertisement/CreateUpdateAdvertisement")),
  },

  {
    path: "/advertisement",
    component: lazy(() => import("../../views/advertisement/ViewAdvertisement")),
  },
  {
    path: "/forgot-password",
    component: lazy(() => import("../../views/password/ForgotPassword")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/reset-password",
    component: lazy(() => import("../../views/password/ResetPassword")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },

  {
    path: "/my-profile/edit",
    component: lazy(() => import("../../views/users/EditProfile")),
  },
  {
    path: "/my-profile",
    component: lazy(() => import("../../views/users/ViewProfile")),
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
