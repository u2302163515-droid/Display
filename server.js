// server.js
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve your static files (HTML, CSS, JS, etc.)
// Put your HTML file in a folder called "public"
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message ?? "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a playful hacker-terminal style AI that replies in short, punchy lines.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({
        reply: "BOT: backend error while talking to AI.",
      });
    }

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "BOT: got an empty response from AI.";

    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      reply: "BOT: connection to AI failed. try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
