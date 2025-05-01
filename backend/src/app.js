import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()
import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"

app.use("/user", userRouter);
app.use("/admin", adminRouter)

export default app;