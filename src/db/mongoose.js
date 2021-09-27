const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect(process.env.MONGODB_URL+'/task-manager-api') //se conecta a la base de datos task-manager-api








//THE REST API- Application Programming Interface-- Representational State Transfer
//Creates an app or process that allows users to do predefined functions  
// Allows connection from computers with http requests to servers that host the webpage or app
// REST requests- POST GET PATCH DELETE methods
// they are 4 basic URL structures
// POST creates work orders
// GET recieves them
// UPDATE sends new information to the server
// DELETE deletes the http request to the server
// 
// 
//