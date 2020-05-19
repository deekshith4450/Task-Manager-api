const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }

    },
    password:{
            type:String,
            required:true,
            trim:true,
            minlength:6,
            validate(value){
                if( (value === 'password')){
                    throw new Error('Password length too bad or password too bad.')
                }
            }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('Invalid Age')
            }
        }
    },
    tokens:[{

        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('usertasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'author'

})

//compulsory to use normal function notation not arrow function notation. This function prevents passwod and tokens array to be sent back.
userSchema.methods.toJSON = function() {
    
    const user = this

    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject

}
//A function created on top of the user instance or object to generate a token.
userSchema.methods.generateToken = async function(){
    const user =this
    const token = jwt.sign({ _id : user._id.toString() }, process.env.JWT_SECRET_KEY)
    user.tokens =user.tokens.concat({token})
    await user.save()
    return token
}

//A function created on top of the user model to verify the login situation
userSchema.statics.checkCredentials = async (email,password) =>{
    
    const user = await User.findOne({email})
        if(!user){
            return res.status(400).send('User doesnot exist')
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).send('Invalid login')
        }
        return user
}

// a middle ware to create a hash value for a password before storing into the database.
userSchema.pre('save',async function(next){
    const user=this
    
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})
const User=mongoose.model('User',userSchema)

module.exports=User