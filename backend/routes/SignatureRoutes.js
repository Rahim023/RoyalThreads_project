import express from "express";
import { getAllSignatures, getSignatureById } from "../controllers/SignatureController.js";

const router = express.Router();

router.get("/", getAllSignatures);
router.get("/:id", getSignatureById);

export default router;
