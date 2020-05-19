const express =require('express')
const Users=require('../models/users')
const Tasks =require('../models/tasks')
const auth = require('../middleware/auth')
const multer =require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail,sendCancelEmail} = require('../email/emails')
const router = new express.Router()

router.post('/user', async (req,res) =>{
    const user=new Users(req.body)
    try{
        
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateToken()
        res.status(200).send({user,token})
    } catch(e){
        res.status(400).send(e)
    }
    
})

router.get('/users/me',auth, async (req,res) =>{
    res.send(req.user)
    
    
})

router.post('/users/login', async (req,res) =>{
    try{
        const user= await Users.checkCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.send({user,token})
    } catch(e)
    {
        res.status(400).send('Invalid login')
    }
})

router.post('/users/logout',auth, async (req,res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch(e){
        res.status(500).send('Please authenticate')
    }
})


router.post('/users/logoutall',auth, async (req,res) =>{
    try{
        req.user.tokens =[]

        await req.user.save()

        res.send('Loged out from all ')
    } catch(e){
        res.status(500).send('Operation failed')
    }
})


router.patch('/user/me',auth, async (req,res) =>{
    const updates=Object.keys(req.body)
    const permitedUpdates=['name','email','password','age']
    const isValidOperation =updates.every((update) => permitedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(404).send({'error':'Invalid updates!!!'})
    }
    
    try{
        const user=req.user
        
        updates.forEach((update) =>user[update] =req.body[update])
        
        await user.save()
        
        res.status(200).send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/me',auth, async (req,res) =>{
    try{
        await Tasks.deleteMany({author:req.user._id})
        await req.user.remove()
        sendCancelEmail(req.user.email,req.user.name)
        res.status(200).send(req.user)
    } catch(e){
        res.status(500).send(e)
    }
})

const upload = multer({

    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please provide jpg,png,jpeg only'))
        }
        cb(undefined,true)
    }
})

router.post('/uploads/me/avatar',auth,upload.single('avatar'),async (req,res) =>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next) =>{
    res.send({error:error.message})

})

router.delete('/users/me/avatar',auth,async (req,res) =>{
req.user.avatar=undefined
await req.user.save()
res.send('deleted')
})

router.get('/users/:id/avatar', async (req,res) =>{
try{
    const user = await Users.findById(req.params.id)

    if(!user || !user.avatar){
        throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
} catch(e){
    res.send('Error')
}
    
})

module.exports=router