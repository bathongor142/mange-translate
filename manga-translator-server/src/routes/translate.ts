import { Router } from "express";
import { openai } from "../openai";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Translate manga dialogue from English to Mongolian. Keep names unchanged.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const translation = completion.choices[0].message.content;

    res.json({
      translation,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Translate failed",
    });
  }
});

export default router;
