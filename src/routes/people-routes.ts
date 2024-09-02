import express from "express";
import {
  getPeople,
  //   createPeople,
  updatePeople,
} from "../controllers/peopleController";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", auth, getPeople);
router.post("/", auth, updatePeople);
router.put("/:id", auth, updatePeople);

export default router;
