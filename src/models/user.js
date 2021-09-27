const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./task')


const userSchema = new mongoose.Schema({ //define the user model and their data types
    name: {
        type: String,
        trim: true, //eliminar espacios antes y despues del input
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0, //valor default que se va a usar si no lo ingresas
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true //muestra la fecha y hora en la que fue creado un usuario 
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET) //consigue el id del usuario y le asigna un token unico
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if (!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('Unable to login')
    }
    return user
}


userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() { //funcion que evita enviar todos los campos al cliente, aqui le quitamos la contraseña y los tokens a la info json que se envia
    const user = this //el usuario especifico
    const userObject = user.toObject() //convierte en objeto la informacion del usuario del DB para poder manejarla mejor

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//hash the pw before user is created
userSchema.pre('save', async function (next) {
    const user = this
    
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next() //al llamar next le dices a la funcion que se acabó
})

//delete tasks when user is removed
userSchema.pre('remove',async function(next) {
    const user = this
    await Tasks.deleteMany({owner: user._id})
    next()
})


const User = mongoose.model('User', userSchema )
User.createIndexes()
module.exports = User

// me.save().then(() => { //usar la funcion save() para guardar los datos anteriores, con un catch por si no funciona.
//     console.log(me)
// }).catch((error) => {
//     console.log('Error: ',error)
// })