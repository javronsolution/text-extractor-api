import express, { Request, Response } from "express";
import { globalErrorHandler, notFound } from "./middlewares/error.middleware";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

app.use(notFound);
app.use(globalErrorHandler);
export default app;
