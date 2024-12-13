import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    // grabs the headers specified in the fetchTodos function from the frontend 
    const token = req.headers['authorization']

    // check guard if the token matches with the endpoint db before sending it to the endpoint
    if(!token) {
        return res.status(401).json({ message: "No Token Provided"})
    }

    // 
    jwt.verify(token , process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json( {message: "Invalid Token"} )
        }

        req.userId = decoded.id
        next()
    })
}


export default authMiddleware;
