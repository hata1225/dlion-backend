import { User as PrismaUser, Post as PrismaPost } from "@prisma/client"
declare global {
    namespace Express {
        interface User extends PrismaUser {}
        interface Post extends PrismaPost {}
    }
}
