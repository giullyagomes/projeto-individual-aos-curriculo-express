import express from "express";
import { db } from "../database/connection.js";
import { users } from "../database/schema.js";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    const result = await db.select().from(users);
    return res.json(result)
});


if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log("Server on port 3000.");
    });
}

export default app;