import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js" 
import todoRoutes from "./routes/todoRoutes.js"
import authMiddleware from "./middleware/authMiddleware.js";

const app = express()
const PORT = process.env.PORT || 8000

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// Get the directory name from the file path
const __dirname = dirname(__filename)
console.log(__filename , __dirname )

// Middleware
app.use(express.json())
// INFO: Serves the html file from the /public directory
// HACK: Tell express to serve all files from the public folder as static assets or file.Any request for the css files will be resolved to the public directory

app.use(express.static(path.join( __dirname, "../public" )))


// Serving Up the html file from the Public directory 
app.get("/", (req, res) => {
    console.log("reached / endpoint")
    res.sendFile(path.join(__dirname, "public", "index.html") )

})


// Routes - tells our app to use the imported authRoutes when we hit the /auth endpoint
app.use("/auth", authRoutes )
app.use("/todos", authMiddleware , todoRoutes )



app.listen( PORT, () => {
    console.log(`Server is listening on ${PORT}!`)
})
