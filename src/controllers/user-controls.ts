import { prisma } from "../../prisma/client";
import { hashPassword } from "../auth/passport";


export const registerUser = async (name: string, email: string, password: string) => {
    try {
        const hash = await hashPassword(password, 10)
        const userData = {
            name: name,
            email: email,
            passwordHash: hash!,
            role: 'user'
        }
        const newUser = await prisma.user.create({ data: userData })
        return newUser
    } catch(err) {
        if (err instanceof Error) {
            console.warn(err)
        }
    }
}

export const findUserById = async (id : number) => {
    try {
        const user = await prisma.user.findUnique({where: {id: id}});
        if (!user) return null
        else return user
    } catch(err) {
        if (err instanceof Error) {
            console.warn(err.message)
        }
    }
}
