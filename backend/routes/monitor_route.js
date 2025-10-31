import express from "express";
import { getMonitoringData } from "../controllers/monitoring.js";

const router = express.Router();

router.get("/", getMonitoringData);

export default router;