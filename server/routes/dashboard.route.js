import { Router } from "express";
import { getDashboardStats, getRecentActivities  } from "../controllers/dashboard.controller.js";
import { validateToken } from "../middleware/validateToken.js";

const dashboardRouter = Router()

dashboardRouter.route("/stats").get(validateToken, getDashboardStats )
dashboardRouter.route("/recent").get(validateToken, getRecentActivities)

export default dashboardRouter