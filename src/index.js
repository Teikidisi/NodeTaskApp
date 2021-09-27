const express = require('express')
require('./db/mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const User = require('./models/user')
const Tasks = require('./models/task')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT //3000 es un default port por si acaso 

// app.use((req,res,next) => {
//     if (req.method === 'GET'){
//         return res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })
//CHALLENGE MAINTENANCE////////////////////////////////////////////////////////////////
// app.use((req,res,next) => {
//     if (req.method === 'GET' || req.method === 'DELETE' || req.method === 'POST' || req.method === 'PATCH' ) { //eliminar el if poner el codigo directo
//         return res.status(503).send('Site currently under maintenance') //503 service unavailable
//     } else {
//         next()
//     }
// })

// //FILE UPLOAD////////////////////////////////////////////////////////////////////////////////////
// const upload = multer({ //codigo middleware que se usa para subir archivos 
//     dest: 'images',
//     limits: {
//         fileSize: 1000000 //limitar el tamaño de archivo que se puede subir, en bites. 1MB es 1000000 (1x10^6)
//     },
//     fileFilter(req,file,cb) {
//         // if (!file.originalname.endsWith('.pdf')){ //si el archivo NO es pdf, porque solo se acepta un archivo pdf
//            if (!file.originalname.match(/\.(doc|docx)$/)){ //determinar el tipo de doc aceptado usando regex
//             return cb(new Error('Please upload a Word document'))
//         }
//         cb(undefined, true) //cuando si se acepta el file, undefined es no hay error, true significa que aceptó el archivo
//     }
// })


// app.post('/upload', upload.single('upload'), (req,res) => { //le dices al multer que busque un archivo llamado upload cuando llegue el post request
//     res.send()
// }, (error,req,res,next) => { //funcion para manejar los errores y enviar el texto de error
//     res.status(400).send({error: error.message})
// })

app.use(express.json()) //convierte en json los objetos que les mande el servidor, 
app.use(userRouter) //para usar varios archivos en un solo doc y asi tener codigo mas estructurado
app.use(taskRouter)




app.listen(port, () => {
    console.log('Server is up on port '+port)
})




//taskapp:databaseaccess