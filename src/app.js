const express = require("express");
const {uuid,isUuid}=require("uuidv4");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
let likeCount= 0

function validateRepoId ( request,response,next){
  const{id}=request.params

  if(!isUuid(id)){
      return response.status(400).json({error:"Repository Id Invalid"})
  }

  return next()
}
app.use("/repositories/:id",validateRepoId)

app.get("/repositories", (request, response) => {
    return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  
  const{title,url,techs}=request.body

  const repository={id:uuid(),title,url,techs,likes:0}


  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id}=request.params;
  const {title,url,techs}=request.body;
  const repoIndex=repositories.findIndex(repository=>repository.id===id);

  if(repoIndex < 0){
    return response.json({error:"Id not found"});
  }
  

  const repository={
    id,
    title,
    url,
    techs,
    likes:0
  }

  repositories[repoIndex]=repository;


  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const{id}=request.params
    const repoIndex= repositories.findIndex(repository=>repository.id === id )
    if (repoIndex < 0){
        return response.status(400).json({error:"Repository not found"})
    }
    repositories.splice(repoIndex,1)
    return response.status(204).send()
});

app.post("/repositories/:id/like",validateRepoId, (request, response) => {
  const{id}= request.params
  
  const likesIndex=repositories.findIndex(repository=>repository.id===id)

  if (likesIndex < 0){
    return response.status(400).json({error:"Id Not Found"})
  }
  likeCount += 1;
  const repository={id, likes:likeCount}
  repositories.push(repository)

  return response.json(repository)

  
});

module.exports = app;
