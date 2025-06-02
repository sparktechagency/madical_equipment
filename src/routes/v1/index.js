const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const categoryRoute = require("./category.route");
const productRoute = require("./product.route");
const bidRoute = require("./bid.route");
const paymentRoute = require("./payment.route");
const payoutRoute = require("./payout.route");
const reportRoute = require("./report.route");
const contactMessage = require("./contactMessage.route");
const dashboardRoute = require("./dashboard.route");
const settingRoute = require("./setting.route");


const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
 
  {
    path: "/product",
    route: productRoute,
  },
 
  {
    path: "/bid",
    route: bidRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/payout",
    route: payoutRoute,
  },
  {
    path: "/report",
    route: reportRoute,
  },
  {
    path: "/contact",
    route: contactMessage,
  },
  {
    path: "/dashboard",
    route: dashboardRoute,
  },
  {
    path: "/setting",
    route: settingRoute,
  },
 
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
