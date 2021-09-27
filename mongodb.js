// para correr usar /Users/Rodrigo/mongodb/bin/mongod.exe --dbpath=/Users/Rodrigo/mongodb-data

//CRUD create read update delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient //Cliente para conectarse y manipular la DB
// const ObjectId = mongodb.ObjectId
const { MongoClient, ObjectId } = require('mongodb')
const { count } = require('yargs')

// const connectionURL = 'mongodb://127.0.0.1:27017' //puerto en el que se encuentra la DB
const databaseName = 'task-manager'//DB que vamos a modificar
// const id = new ObjectId()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, (error, client) => {//conectarse a la base de datos, usa callback
    if (error) {
        return console.log('Unable to connect to  database')
    }
    console.log('Connected correctly')
    const db = client.db(databaseName)
    //DELETE DOCUMENTS /////////////////////////////////////////////////////////
    // db.collection('users').deleteMany({
    //     age: 22
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').deleteOne({
    //     _id: new ObjectId("614b7f8a7919864fb337c54e")
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    //UPDATE DOCUMENTS//////////////////////////////////////////////////////////
//    db.collection('users').updateOne({
//         _id: new ObjectId("614b7900ba925718170296ea")
//     },{
//         // $set: { //set asigna nuevos valores
//         //     name: 'Mike' //solo va a modificar el name, no age
//         // } //se modifica el documento y luego de esto se hace una promesa a ver si funcionó
//         $inc: { //inc incrementa un int de un valor, tambien decrementa si pones numeros negativos
//             age: 1
//         }
//     }).then((result) => { //se pega al metodo original con .then pues trabaja con la misma variable 
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })

    //    db.collection('tasks').updateMany({
    //         completed: false
    //     },{
    //         $set: {
    //             completed:true
    //         }
    //     }).then((result) =>{
    //         console.log(result)
    //     }).catch((error) => {
    //         console.log(error)
    //     }) 

    //READ DOCUMENTS////////////////////////////////////////////////////////////
    // db.collection('users').findOne({_id: new ObjectId("614b7b84c856227c4b10350b")}, (error,user) => { //asi se hace para encontrar cosas por id, porque el id del objeto es un object id function
    //     if (error) {
    //         return console.log('Unable to fetch user')
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({ age: 22}).toArray((error, users) => { //envia los valores encontrados a unarray y te los muestra todos
    //     console.log(users)
    // })
    // db.collection('users').find({ age: 22}).count((error, count) => { //te dice cuantos valores encontró con el requisito que le hiciste.
    //     console.log(count)
    // })
    //
    // db.collection('tasks').findOne({_id: new ObjectId("614b7f8a7919864fb337c550")}, (error,task) => {
    //     if (error) {
    //         return console.log('Unable to fetch task')
    //     }
    //     console.log(task)
    // })

    // db.collection('tasks').find({completed: false}).toArray((error, task) => {
    //     if (error) {
    //         return console.log('Unable to fetch tasks')
    //     }
    //     console.log(task)
    // })


    //CREATE DOCUMENTS /////////////////////////////////////////////////////////
    // db.collection('users').insertOne({ //crea una coleccion Users con los objetos ingresados, tmb existe insertMany
    //     name: 'Vikram',
    //     age: 26
    // }, (error, result) => { //callback por si hay un error al insertar a la base de datos
    //     if (error){
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.insertedId)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 28
    //     },{
    //         name: 'Gunther',
    //         age: 27
    //     }
    // ], (error, result) => {
    //     if (error){
    //         return console.log("Unable to insert documents")
    //     }
    //     console.log(result.insertedIds)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Wash clothes',
    //         completed: false
    //     },{
    //         description: 'Make breakfast',
    //         completed: true
    //     }, {
    //         description: 'Kill the president',
    //         completed: false
    //     } 
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert documents")
    //     }
    //     console.log(result.insertedIds)
    // })
})
