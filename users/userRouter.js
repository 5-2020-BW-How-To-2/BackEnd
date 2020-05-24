const router = require("express").Router();

const Users = require("./userModel.js");
const restricted = require("../auth/restrictedMiddleware.js");


router.get("/", restricted, (req, res)=>{
    Users.getAll()
    .then(users=>{
        res.status(200).json(users);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "could not load users"})
    })
})

router.get("/:id", restricted, (req, res)=>{
    Users.findById(req.params.id)
    .then(user=>{
        if(user){
            res.status(200).json(user)
        }
        else{
            res.status(404).json({error: "user not found"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "unable to find user"})
    })
})

module.exports = router;