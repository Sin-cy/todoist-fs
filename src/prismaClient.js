// This file is similar to the db.js database
// creates a Prisma entity through which we can 
// interface with our Postgres db

import { PrismaClient } from "@prisma/client";

// Invoke the prisma client class
const prisma = new PrismaClient()
export default prisma
