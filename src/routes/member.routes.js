const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createMember,
  getMembers,
  getMemberById,
} = require("../controllers/member.controller");

router.post(
  "/",
  upload("membersPhoto").single("photo"),
  createMember
);

router.get("/", getMembers);

router.get("/:id", getMemberById);

module.exports = router;