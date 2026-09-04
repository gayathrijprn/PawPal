
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    console.error("❌ GROQ_API_KEY is missing.");
    console.error("Please check your .env file.");
    process.exit(1);
}

const groq = new Groq({
    apiKey: apiKey
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🐾 PawPal AI Server is running!"
    });
});

app.post("/api/assistant", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                success: false,
                answer: "Please enter a message."
            });
        }

        console.log("🐾 User:", message);

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content:
                        "You are PawPal AI, a friendly pet adoption and pet care assistant. " +
                        "Help users with pet adoption, dogs, cats, feeding, grooming, training, " +
                        "vaccinations, shelters, fundraising, lost pets and general pet care. " +
                        "Give simple, friendly and useful answers. " +
                        "For serious medical problems, advise the user to contact a veterinarian."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const answer = completion.choices[0].message.content;

        console.log("🤖 PawPal AI:", answer);

        return res.json({
            success: true,
            answer: answer
        });

    } catch (error) {
        console.error("❌ Groq Error:", error);

        return res.status(500).json({
            success: false,
            answer: "Sorry, PawPal AI is temporarily unavailable."
        });
    }
});

app.listen(PORT, () => {
    console.log("=================================");
    console.log("🐾 PAWPAL AI SERVER");
    console.log("=================================");
    console.log("🚀 Server: http://localhost:" + PORT);
    console.log("🤖 AI: http://localhost:" + PORT + "/api/assistant");
    console.log("✅ Server started successfully!");
    console.log("=================================");
});
