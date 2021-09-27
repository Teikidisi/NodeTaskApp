const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => { //se usa la funcion POST para enviar un request http
    const user = new User(req.body) //crea una nueva entrada en la DB User usando los valores que le enviaron desde postman 
    //console.log(req.body) //recupera los datos que le envia y se guardan en req.body

    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name) //enviar un correo a cada usuario nuevo
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }


    // user.save().then(() => { //le guarda los valores a la DB aqui sí
    //     res.status(201).send(user) //se envia el usuario con este codigo
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user , token})
    }catch(e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token //a los tokens guardados de los logins en la base de datos los filtra. Si filter da false es porque son iguales, y es el token de cierto dispositivo o sesion y ese se elimina
        })
        await req.user.save()
    } catch(e) {
        res.status(500).send(e)
    }   
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        req.status(500).send(e)
    }
})

router.get('/users/me', auth ,async (req,res) => { //obtener los datos de la pestaña http users
    //auth en el argumento esta enviando una nueva funcion que debe cumplirse para poder completar el proceso GET
    res.send(req.user)
    
    
    // try{
    //     const users = await User.find({})
    // } catch(e){
    //     res.status(400).send(e)
    // }

})

// router.get('/users/:id', async (req,res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch(e) {
//         res.status(500).send()
//     }
//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     }

//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)//keys() regresa un array con todos los keys del objeto del argumento. los keys del key-value pair, por ejemplo name, age, etc.
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update) => { //every corre el codigo una vez por index del array updates. Includes compara ese valor con el array entero de allowedUpdates a ver si está adentro.
        return allowedUpdates.includes(update)//si todos los indices de updates estan en los de allowedUpdates, every regresa un true, si tan solo un indice no coincide, regresa un false.
    })

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        // const user = await User.findById(req.user._id)
        updates.forEach((update) => {
            req.user[update] = req.body[update] //se usa [] porque el valaor de update siempre cambia, no se sabe que key será, de esta forma se puede agarrar el valor correcto
        })

        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}) //actualizar un usuario y se convierte en una nueva entrada al DB con el parametro new:true
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async (req,res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user){
        //     return res.status(404).send()
        // }
        sendCancellationEmail(req.user.email,req.user.name)
        await req.user.remove()
        res.send(req.user)//send user data back
    }catch(e){
        return res.status(500).send(e)
    }
})


const avatar = multer({ //codigo middleware que se usa para subir archivos 
    // dest: 'avatars', //destino donde se guardaran los archivos que se suben, se borra para poder decidir dinamicamente donde se guardan
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Document type must be jpg,jpeg, or png'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth, avatar.single('avatar'), async (req,res) => { //post a la ruta para subir nuevo contenido
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

    req.user.avatar =  buffer
    await req.user.save()
    res.status(200).send() //al const avatar se le sube un solo archivo que tiene de key en postman: avatar
}, (error,req,res,next) => { //, agarra ese archivo colocado en el valor y lo guarda en el directorio correcto
    return res.status(400).send({error: error.message})
} )            

router.delete('/users/me/avatar',auth, async (req,res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send(e)
    }
})

router.get('/users/:id/avatar', async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        
        if (!user || !user.avatar) { //por si no hay usuario con ese id o no tiene un avatar
            throw new Error()
        }

        res.set('Content-Type','image/png') //set le dice al cliente que la informacion que estas enviando es de tipo imagen png
        res.send(user.avatar) //envia la imagen al cliente
    }catch(e){
        res.status(404).send()
    }
})



module.exports = router