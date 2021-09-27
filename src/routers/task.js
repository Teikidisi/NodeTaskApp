const express = require('express')
const Tasks = require('../models/task')
const auth = require('../middleware/auth')
const User = require('../models/user')
const { boolean, number } = require('yargs')
const router = new express.Router()

router.post('/tasks', auth, async (req,res) => {
    // const task  = new Tasks(req.body)
    const task = new Tasks({
        ...req.body, //copiar todas las propiedades de body a este objeto
        owner: req.user._id //asignar al dueño el id del user
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send()
    }
})

//GET /tasks?completed=true //muestra todas las tasks que esten true
//Pagination => limit skip
//GET /tasks?limit=10&skip=20 <- muestra 10 valores en una pagina, y se salta los primeros 20 (pagina 3)
//GET /tasks?sortBy=createdAt_asc <-ascending date of creation
router.get('/tasks',auth, async (req,res) => { //obtener los datos de la pestaña http users
    
    const pagelimit = {
        limit: number,
        skip: number,
        sort: {
            // createdAt: -1 //-1 significa que ira de mas viejo a mas joven, el inverso es de mas joven a viejo
            // completed: -1 //pone los completados primero, y los incompletos al ultimo
        }
    }
    const findoption = {
        owner : req.user._id,
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        pagelimit.sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    if(req.query.completed ==='true'){
        findoption.completed = req.query.completed === 'true'
    }
    if(req.query.completed ==='false'){
        findoption.completed = req.query.completed === 'true'
    }
    if (req.query.limit) {
        pagelimit.limit = parseInt(req.query.limit)
    }
    if(req.query.skip) {
        pagelimit.skip = parseInt(req.query.skip)
    }

    try {
        const tasks = await Tasks.find(findoption, null, pagelimit)
        res.status(201).send(tasks)
        // const match = {}
        // if (req.query.completed) {
        //     match.completed = req.query.completed === 'true'
        // }
        // req.query.completed //obtiene el valor del query (url) sea false o true
        // const user = await User.find({owner: req.user._id})
        // await req.user.populate({
        //     path: 'tasks',
        //     match.
        //     options: {
        //     limit: parseInt()
        // }
        // }).execPopulate()
        // res.status(201).send(req.user.tasks)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id',auth, async (req,res) => {
    const _id = req.params.id
    try{
        // const tasks = await Tasks.findById(_id)
        const tasks = await Tasks.findOne({_id, owner : req.user._id})
        // if (!tasks) {
        //     return res.status(404).send()
        // }
        res.send(tasks)
    } catch(e) {
        res.status(500).send()
    }

})

router.patch('/tasks/:id',auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({error:'Invalid parameter entered'})
    }

    try{
        const task = await Tasks.findOne({_id : req.params.id, owner: req.user._id})
        // const task = await Tasks.findById(req.params.id)
        

        
        // const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        if (!task){
           return res.status(404).send('Task not found')
        }
        updates.forEach((update) => {
            task[update] = req.body[update] //se usa [] porque el valaor de update siempre cambia, no se sabe que key será, de esta forma se puede agarrar el valor correcto
        })
        await task.save()
        res.send(task)
    }catch(e){
        return res.status(500).send(e)
    }

})
router.delete('/tasks/:id',auth, async (req,res) => {
    try{
        // const task = await Tasks.findByIdAndDelete(req.params.id)
        const task = await Tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)//send data back
    }catch(e){
        return res.status(500).send(e)
    }
})

module.exports = router