const db = require("../data/dbConfig.js")
module.exports ={
    getHacks,
    findHack,
    insert,
    update,
    remove,
    insertStep,
    getSteps,
    findStep,
    updateStep,
    removeStep,
    insertComment,
    getComments,
    findComment,
    removeComment,
}

function getHacks(){
    return db("hacks");
}

function findHack(id){
    return db("hacks").where({id}).first();
}

async function insert(hack) {
    try {
      const [id] = await db("hacks").insert(hack, "id");
  
      return findHack(id);
    } catch (error) {
      throw error;
    }
  }

function update(id, changes) {
    return db("hacks").where({id}).update(changes, "id")
    .then(updated=>{
        return db("hacks").where({id}).first();
    })
  }

  function remove(id){
      return db("hacks").where({id}).del()
      .then(res=>{
          return getHacks();
      })
  }

  function findStep(id){
      return db("steps").where({id}).first();
  }

  function getSteps(hackId){
      return db("steps").where({hack_id: hackId});
  }

  function updateStep(id, changes){
      return db("steps").where({id}).update(changes, "id")
      .then(updated=>{
          return db("steps").where({id}).first();
      })
  }

  function removeStep(id, hackId){
      return db("steps").where({id: id}).del()
  }

  async function insertStep(step) {
    try {
      const [id] = await db("steps").insert(step, "id");
  
      return findStep(id);
    } catch (error) {
      throw error;
    }
  }

  function getComments(hackId){
      return db("comments").where({hack_id: hackId})
  }

  function findComment(id){
      return db("comments").where({id}).first();
  }

  async function insertComment(comm) {
    try {
      const [id] = await db("comments").insert(comm, "id");
  
      return findComment(id);
    } catch (error) {
      throw error;
    }
  }
  
function removeComment(id, hackId){
    return db("comments").where({id}).del()
}