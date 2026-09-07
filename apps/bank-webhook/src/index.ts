import axios from "axios";
import { db } from "db";
import express from "express";

const app = express();
app.use(express.json());

app.post("/simulate-payment", async (req, res) => {
  try {
    const { token, status } = req.body;

    const response = await axios.post("http://localhost:3000/api/webhook", {
      token,
      status,
    });

    return res.json({
      token,
      status,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.listen(4000, () => {
  console.log("Bank webhook is running on http:localhost:4000");
});
