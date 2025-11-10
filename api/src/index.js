import express from "express";
import { db } from "../database/connection.js";
import { users } from "../database/schema.js";
import routes from "../routes/index.js";

const app = express();
app.use(express.json());

// Rota de teste
app.get("/", async (req, res) => {
    try {
        const result = await db.select().from(users);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Database error: " + error.message });
    }
});

// Montar as rotas
app.use("/users", routes.userRoutes);
app.use("/experiences", routes.experienceRoutes);
app.use("/educations", routes.educationRoutes);

// Iniciar servidor apenas se não estiver em produção (ex: testes com supertest)
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;