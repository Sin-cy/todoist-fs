import express from "express";
import prisma from "../prismaClient.js";

// removed import db from "../db.js" to prevent Docker clash with Sqlite

const router = express.Router()

//****  NOTE: Adding Prisma ORM ****

// Get all todos for logged in users
router.get("/", async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })
    res.json(todos)
})

// Create a new todo
router.post("/", async (req, res) => {
    const { task } = req.body
    const todo = await prisma.todo.create({
        data: {
            task, 
            userId: req.userId
        }
    })

    res.json(todo)
})

// UPDATE the current todo by using the dynamic id
// the id needs to match of the specific task id of the user
router.put("/:id" , async (req, res) => {
    const { completed } = req.body
    const { id } = req.params

    const updatedTodo = await prisma.todo.update({
        where : { // NOTE: 2 - does the client req returns as a json string ???
            id: parseInt(id), // NOTE: 2 - how does id return as a string that it requires us to convert to Int 
            userId: req.userId
        },
        data: {
            // **** HACK: `!!` force completed to become a boolean value. It converts anything to its truthy or falsy state
            completed: !!completed // NOTE: 2 -  Why does completed return as Int that it requires us to change it to boolean
        }
    })

    res.json(updatedTodo)
})

// DELETE todos
// same concept of updating with an id applies here for deleting a specific id
router.delete("/:id" , async (req, res) => {
    const { id } = req.params
    const userId = req.userId

    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId
        }
    })

    res.send({ message: "Todo has been Deleted !"})
})


export default router;
