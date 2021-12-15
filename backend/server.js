const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const multer=  require('multer');
const {v4 : uuidv4 } =  require('uuid');
const path = require("path");
const PORT = 4000;

let Todo = require('./todo.model');

const Storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, 'images');
    },
    
    filename :function(req,file,cb){
        cb(null,  uuidv4() + "-"+ Date.now()+ path.extname(file.originalname));
    }
});

const Filefilter =  (req,file,cb)=>{
    const fileType = [ 'image/png' , 'image/jpeg',  'image/jpg'];
    if(fileType.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}

var upload = multer({storage :Storage , fileFilter: Filefilter});


app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    console.log("find by id in get",id)
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/update/:id').post(upload.single('photo'),function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.todo_photo = req.body.todo_photo;
            console.log("on  update ",todo,todo.todo_description);
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/add').post(upload.single('photo'),function(req, res) {
    console.log("add hoja",req.body);
    let todo = new Todo(req.body);
    console.log("recent save",todo,req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});