import express from 'express'
const app = express()
const port =  process.env.PORT ||  3000 
import passport from './auth/passport'

app.use(passport.initialize())
app.use(passport.session())



app.listen(port, () => {
    console.log(`LISTENING ON PORT: ${port}`)
})