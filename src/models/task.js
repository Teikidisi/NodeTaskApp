const mongoose = require('mongoose')
const validator = require('validator')


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean, 
        required: false,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})

const Tasks = mongoose.model('Tasks',taskSchema )


module.exports = Tasks

// const task = new Tasks({
//     description: 'Estudiar mil horas'
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log('Error: ',error)
// })