const express = require("express");

const Hacks = require("./hackModel.js");
const restricted = require("../auth/restrictedMiddleware.js")
const router = express.Router();

const db = require("../data/dbConfig.js")

router.get("/", restricted, (req, res)=>{
    Hacks.getHacks()
    .then(hax=>{
        res.status(200).json(hax)
    })
    .catch(err=>{
        res.status(500).json({error: "failed to load life hacks"})
    })
})

router.get("/:id", restricted, (req, res)=>{
    Hacks.findHack(req.params.id)
    .then(hack=>{
        if(hack){
            res.status(200).json(hack)
        }
        else{
            res.status(404).json({error: "life hack with the given ID not found"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "failed to get life hack"})
    })
})

router.post("/", restricted, (req, res)=>{
    if(isValidHack(req.body)){
        let userId = req.jwt.subject;
        const newPost = {
            title: req.body.title,
            description: req.body.description,
            score: 1,
            user_id: userId
        }
        Hacks.insert(newPost)
        .then(hack=>{
            res.status(201).json(hack)
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({error: "failed to create new hack"})
        })
    }
    else{
        res.status(400).json({error: "life hack must contain a title and a description"})
    }
})

router.put("/:id", restricted, validateHackId, isUsersPost, (req, res)=>{
    let prevScore = -1;
    Hacks.findHack(req.params.id)
    .then(hack=>{
        prevScore = hack.score;
        if(isValidHack(req.body)){
            let userId = req.jwt.subject;
            const updatedPost = {
                title: req.body.title,
                description: req.body.description,
                score: prevScore,
                user_id: userId
            }
            Hacks.update(req.params.id, updatedPost)
            .then(hax=>{
                res.status(200).json(hax)
            })
            .catch(err=>{
                console.log(err)
                res.status(500).json({error: "failed to update life hack"})
            })
        }
        else{
            res.status(400).json({error: "post must contain a title and a description"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "failed to update life hack"})
    })
})

router.delete("/:id", restricted, validateHackId, isUsersPost, (req, res)=>{
    Hacks.remove(req.params.id)
    .then(hax=>{
        res.status(200).json(hax)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "failed to delete life hack"})
    })
})

router.patch("/:id/upvote", restricted, validateHackId, (req, res)=>{
    Hacks.findHack(req.params.id)
    .then(hack=>{
        if(hack){
            const updateHack ={
                id: hack.id,
                title: hack.title,
                description: hack.description,
                score: (hack.score + 1),
                user_id: hack.user_id,
            }
            Hacks.update(req.params.id, updateHack)
            .then(hax=>{
                res.status(200).json(hax)
            })
            .catch(err=>{
                console.log(err)
                res.status(500).json({error: "unable to upvote"})
            })
        }
        else{
            res.status(404).json({error: "life hack with the given ID not found"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "failed to get life hack"})
    })
})

router.patch("/:id/downvote", restricted, validateHackId, (req, res)=>{
    Hacks.findHack(req.params.id)
    .then(hack=>{
        if(hack){
            const updateHack ={
                id: hack.id,
                title: hack.title,
                description: hack.description,
                score: (hack.score - 1),
                user_id: hack.user_id,
            }
            Hacks.update(req.params.id, updateHack)
            .then(hax=>{
                res.status(200).json(hax)
            })
            .catch(err=>{
                console.log(err)
                res.status(500).json({error: "unable to upvote"})
            })
        }
        else{
            res.status(404).json({error: "life hack with the given ID not found"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "failed to get life hack"})
    })
})

router.post("/:id/steps", restricted, validateHackId, isUsersPost, (req, res)=>{
    if(isValidStep(req.body)){
        const newStep = {
            step_number: req.body.step_number,
            instruction: req.body.instruction,
            hack_id: req.params.id
        }
        Hacks.insertStep(newStep)
        .then(step=>{
            res.status(201).json(step)
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({error: "could not insert step"})
        })
    }
    else{
        res.status(400).json({error: "step must include a step_number (integer) and instruction"})
    }
})

router.put("/:id/steps/:stepId", restricted, validateHackId, validateStepId, isUsersPost, (req, res)=>{
    if(isValidStep(req.body)){
        const newStep = {
            step_number: req.body.step_number,
            instruction: req.body.instruction,
            hack_id: req.params.id,
        }
        Hacks.updateStep(req.params.stepId, newStep)
        .then(step=>{
            res.status(200).json(step)
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({error: "could not update the step"})
        })
    }
    else{
        res.status(400).json({error: "step must include a step_number (integer) and instruction"})
    }
})

router.delete("/:id/steps/:stepId", restricted, validateHackId, validateStepId, isUsersPost, (req, res)=>{
    Hacks.removeStep(req.params.stepId)
    .then(steps=>{
        Hacks.getSteps(req.params.id, req.params.id)
        .then(steps=>{
            if(steps.length){
                res.status(200).json(steps)
            }
            else{
                res.status(200).json({message: "no steps for given life hack"})
            }
        })
        .catch(err=>{
            res.status(500).json({error: "could not load steps"})
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "could not remove step"})
    })
})

router.get("/:id/steps", restricted, validateHackId, (req, res)=>{
    Hacks.getSteps(req.params.id, req.params.id)
    .then(steps=>{
        if(steps.length){
            res.status(200).json(steps)
        }
        else{
            res.status(200).json({message: "no steps for given life hack"})
        }
    })
    .catch(err=>{
        res.status(500).json({error: "could not load steps"})
    })
})

router.get("/:id/comments", restricted, validateHackId, (req, res)=>{
    Hacks.getComments(req.params.id)
    .then(comments=>{
        if(comments.length){
            res.status(200).json(comments)
        }
        else{
            res.status(200).json({message: "no comments for given life hack"})
        }
    })
    .catch(err=>{
        res.status(500).json({message: "could not load comments"})
    })
})

router.post("/:id/comments", restricted, validateHackId, (req, res)=>{
    if(isValidComment(req.body)){
        const newComment = {
            comment_text: req.body.comment_text,
            hack_id: req.params.id
        }
        Hacks.insertComment(newComment)
        .then(com=>{
            res.status(201).json(com)
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({error: "unable to post comment"})
        })
    }
    else{
        res.status(400).json({error: "comment must have comment_text property"})
    }
})

router.delete("/:id/comments/:commId", restricted, validateHackId, isUsersPost, (req, res)=>{
    Hacks.removeComment(req.params.commId)
    .then(com=>{
        Hacks.getComments(req.params.id, req.params.id)
        .then(comms=>{
            if(comms.length){
                res.status(200).json(comms)
            }
            else{
                res.status(200).json({message: "no comments for given life hack"})
            }
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({error: "unable to delete comment"})
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "unable to delete comment"})
    })
})

function isValidHack(post){
    return Boolean(post.title && post.description)
}

function isValidStep(step){
    return Boolean(step.step_number && step.instruction && Number.isInteger(step.step_number) )
}

function isValidComment(comment){
    return Boolean(comment.comment_text)
}

function validateHackId(req, res, next){
    Hacks.findHack(req.params.id)
    .then(hack=>{
        if(hack){
            next();
        }
        else{
            res.status(404).json({error: "life hack with the given ID not found"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "failed to get life hack"})
    })
}

function validateStepId(req, res, next){
    Hacks.findStep(req.params.stepId)
    .then(step=>{
        if(step){
            next();
        }
        else{
            res.status(404).json({error: "step with the give ID not found"})
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "failed to get step"})
    })
}

function isUsersPost(req, res, next){
    const userId = req.jwt.subject;
    Hacks.findHack(req.params.id)
    .then(hack=>{
        if(hack){
            if(hack.user_id === userId){
                next()
            }
            else{
                res.status(403).json({error: "you may only modify life hacks you've created"})
            }
        }
        else{
            res.status(500).json({error: "failed to update life hack"})
        }
    })
}

module.exports = router;