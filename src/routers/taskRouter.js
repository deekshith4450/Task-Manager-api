const express =require('express')
const Tasks=require('../models/tasks')
const auth=require('../middleware/auth')
const router = new express.Router()

router.post('/task', auth,async (req,res) =>{
    const task=new Tasks({
        description:req.body.description,
        completed:req.body.completed,
        author:req.user._id
    })
    
    try{
        await task.save()
        res.send(task)
    } catch(e){
        res.status(400).send(e)
    }
    
})

router.get('/tasks', auth,async(req,res) =>{
    const match={}
    const sort={}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortby){
        const parts=req.query.sortby.split(':')
        sort[parts[0]]=parts[1] === 'desc' ? -1 : 1
    }

    try{
        // const tasks= await Tasks.find({author:req.user._id})
        await req.user.populate({
            path:'usertasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.usertasks)
    } catch(e){
        res.status(500).send()
    }
    
})

router.get('/tasks/:id',auth, async (req,res) =>{
    const _id=req.params.id

    try{
       // const task= await Tasks.findById(_id)
        const task = await Tasks.findOne({_id,author:req.user._id})
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.status(200).send(task)
    } catch(e){
        res.status(404).send(e)
    }
    
})

router.patch('/tasks/:id', auth,async (req,res) =>{
    const updates=Object.keys(req.body)
    const permitedUpdates=['description','completed']
    const isValidOperation=updates.every((update) => permitedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({'error':'Invalis operation'})
    }
    try{
        const task =await Tasks.findone({_id:req.params.id,author:req.user._id})
        if(!task){
            return res.status(404).send('Task not found')
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        //const task =await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
        res.status(200).send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id',auth, async (req,res) =>{
    try{
        const deletd_task= await Tasks.findOneAndDelete({_id:req.params.id,author:req.user._id})
        if(!deletd_task){
            return res.status(404).send({'error':'Task not found'})
        }
        res.status(200).send(deletd_task)
    } catch(e){
        res.status(500).send(e)
    }
})
module.exports=router