import express from "express";
import { getPeople, createPeople } from "../controllers/peopleController";
import auth from "../middleware/auth";
import { createPeopleValidator } from "../validators/people-validators";

const router = express.Router();

router.get("/", auth, getPeople);
router.post("/", auth, createPeopleValidator, createPeople);

export default router;
