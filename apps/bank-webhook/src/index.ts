import { db } from "db";
import express from "express";

const app = express();
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.listen(4000, () => {
  console.log("Bank webhook is running on http:localhost:4000");
});
