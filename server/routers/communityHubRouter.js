import { Router } from "express"
const router = Router();

// Global community chat route
router.get("/global", (req, res) => {
    // Handle global community chat logic here
});

// Private community chat route
router.get("/private", (req, res) => {
    // Handle private community chat logic here
});

export default router;
