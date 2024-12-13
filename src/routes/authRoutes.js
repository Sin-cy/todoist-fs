import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../prismaClient.js"
// removed import db from "../db.js" to prevent Docker clash with Sqlite

const router = express.Router()

// Register a new user endpoint /auth/register
router.post("/register", async (req, res) => {
    const { username, password } = req.body
    // save the username and irreversibly encrypted password
    // encrypted password - basically no one was ever know the password if they somehow get into our database
    const hashedPassword = bcrypt.hashSync(password, 8)
  
    // save the new user and the hashed password to the db
    try {
        // this user is essentially the `User` object model created in the prisma schema
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        // using prisma to create the todo refering to the todo model in the prisma's schema we created
        const defaultTodo = `Add your first todo!`
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id 
            }
        })

        // create a token - a way to authenticate the correct user identity to add,del,update their todo
        // we can now use the `user.id` from userId created in the prisma.todo.create and assign that to our jwt token id
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
    // res.sendStatus(201) // we can only send back one status else there will be an error
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {

        // NOTE: You can find all the available Prisma Client API and how to use them in the Docs below
        // HACK: such as the findUnique(), findFirst(), findMany(), create(), delete(), set(), connect()  
        // https://www.prisma.io/docs/orm/reference/prisma-client-reference#model-queries
        
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        // if we cannot find the user associated with that username, then return out from the function
        if (!user) {
            return res.status(404).send( {message: "User not found. Please Sign up"})
        }

        const passwordIsValid = bcrypt.compareSync( password, user.password )
        // if the password does not match return out of the function
        if(!passwordIsValid){
            return res.status(401).send( {message: "Password is Invalid"} )
        }
        console.log(user)
        
        // then we have successful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET , { expiresIn: "24h" } )
        res.json({ token })

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})


export default router
