const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

let projects = [ 
  { id:1 , name: "Project one"},
  { id:2 , name: "Project two"}
];
// GET
app.get("/api/projects",(req,res) =>{
   res.json({ status: "success", projects });
});
app.get("/api/projects/count",(req,res) =>{
  res.json({ status: "success", count: projects.length });
});

//POST
app.post("/api/projects",(req,res) =>{
  const {name} = req.body;
  if (!name) return res.status(400).json({ status: "error", message: "Project name is required"});    
  if (name.length < 3 ) return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters"});
  if (projects.some(p => p.name.toLowerCase() === name.toLowerCase())){
    console.log("Duplicate detected:", name); 
    return res.status(400).json({ status: "error", message: "Project name must be unique"});
  }
  const newId = Math.max(...projects.map(p => p.id), 0) + 1;
  const newProject = { id: newId, name };
  projects.push(newProject);
  res.status(201).json({ status: "success", project: newProject });
});

//PUT
app.put("/api/projects/:id",(req,res) =>{
  const {name} = req.body;
  const {id} = req.params;
  const projectId = parseInt(id);

  if (!name) return res.status(400).json({ status: "error", message: "Project name is required"});    
  if (name.length < 3 ) return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters"});
  if (projects.some(p => p.id !== projectId && p.name.toLowerCase() === name.toLowerCase())){
      return res.status(400).json({ status: "error", message:"Project name must be unique"});
  }
  const project = projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ status:"success", message: "Project not found"});
  project.name = name;
  res.json({ status: "success", project });
});

//DELETE
app.delete("/api/projects/:id",(req,res) =>{
  const {id} = req.params;
  const projectId = parseInt(id);
  const index = projects.findIndex(p => p.id === projectId);
  if (index === -1) return res.status(404).json({ status: "error", message: "Project not found"});    
  const deletedProject = projects.splice(index, 1)[0];
  res.json({ status: "success", project: deletedProject });
});

app.listen(PORT,()=> console.log(`Server running at http://localhost:${PORT}`));



