
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const apiKey = process.env.GROQ_API_KEY;

const groq = apiKey ? new Groq({ apiKey }) : null;
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!apiKey) {
    console.warn("⚠️ GROQ_API_KEY is missing. The AI assistant is disabled.");
}

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

        if (!groq) {
            return res.status(503).json({
                success: false,
                answer: "The PawPal AI assistant needs a GROQ_API_KEY in the .env file."
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

app.post("/api/payments/order", async (req, res) => {
    try {
        const amount = Number(req.body.amount);

        if (!Number.isInteger(amount) || amount < 100 || amount > 100000000) {
            return res.status(400).json({ success: false, message: "Enter a valid amount." });
        }

        if (!razorpayKeyId || !razorpayKeySecret) {
            return res.status(503).json({
                success: false,
                message: "Payments are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env."
            });
        }

        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64")
            },
            body: JSON.stringify({
                amount: amount * 100,
                currency: "INR",
                receipt: `pawpal_${Date.now()}`,
                notes: { purpose: String(req.body.purpose || "pawpal").slice(0, 100) }
            })
        });

        const order = await response.json();

        if (!response.ok) {
            console.error("Razorpay order error:", order);
            return res.status(502).json({ success: false, message: "Unable to start payment." });
        }

        return res.json({
            success: true,
            keyId: razorpayKeyId,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Payment order error:", error);
        return res.status(500).json({ success: false, message: "Unable to start payment." });
    }
});

app.post("/api/payments/verify", (req, res) => {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature || !razorpayKeySecret) {
        return res.status(400).json({ success: false, message: "Invalid payment verification request." });
    }

    const expectedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
    const expectedBuffer = Buffer.from(expectedSignature);
    const signatureBuffer = Buffer.from(String(signature));

    if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
        return res.status(400).json({ success: false, message: "Payment verification failed." });
    }

    return res.json({ success: true });
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
