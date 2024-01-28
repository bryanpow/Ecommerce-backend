import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local'
import { prisma } from "../../prisma/client";
import bcrypt from 'bcrypt'
import { findUserById } from "../controllers/user-controls";
import { User } from "@prisma/client";


export const hashPassword = async (password: string, saltRounds: number) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt)
    } catch (err) {
        if (err instanceof Error) {
            console.warn(err.message)
        }
    }
}
export const comparePasswords = async(password: string, hash: string) => {
    try {
        const matchFound = await bcrypt.compare(password, hash);
        return matchFound
    } catch(err) {
        if (err instanceof Error) {
            console.warn(err.message)
        }
    }
    return false
}


passport.use(new LocalStrategy(async function (email, password, done) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (!user) return done(null, false, { message: 'No account accociated with that email' })

    const hash = await hashPassword(password, 10);
    const passwordValid = await comparePasswords(user.passwordHash, hash!);

    if (passwordValid) return done(null, user);
    else return done(null, false, {message: 'Incorrect Password'})
}))

passport.serializeUser((user, done) => {
    return done(null, (user as User).id)
})
passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await findUserById(id);
        if (!user) return done(null, null)
        else return done(null, user)
    } catch(err) {
        if (err instanceof Error) {
            console.warn(err.message)
        }
    }
})

export default passport





