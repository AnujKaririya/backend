import { Router } from 'express';
import {
    clearWatchHistory,
    getChannelStats,
    getChannelVideos,
    getWatchHistory,
} from "../controllers/dashboard.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);
router.route("/watchHistory").get(getWatchHistory)
router.route("/clearWatchHistory").get(clearWatchHistory)

export default router