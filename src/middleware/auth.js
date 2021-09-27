const jwt = require('jsonwebtoken')
const User = require('../models/user')
const user = require('../models/user')


const auth = async (req,res,next) => { //funcion middleware
    try{
        const token = req.header('Authorization').replace('Bearer ','') //en postman se asigna un header y un value de keyvalue pair, aqui agarras el key authorization
        //y reemplazas del value el valor "bearer " con un espacio vacio para obtener solo el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //se verifica el token con el secreto que se asigno en model/user.js y te da el id real del usuario
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token }) //se encuentra la entrada en la base de datos que coincida con el id del token 

        if(!user){
            throw new Error()
        }
        req.user = user 
        req.token = token
        next()
    }catch(e) {
        res.status(401).send({error: 'Please authenticate'})
    }
    
}

module.exports = auth