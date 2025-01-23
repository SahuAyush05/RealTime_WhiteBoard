const express =require("express");
const {createProject,joinProject}=require("../controllers/projectController");

const router = express.Router();

router.post("/create-project",createProject);
router.get("/join-project",joinProject);

module.exports=router;