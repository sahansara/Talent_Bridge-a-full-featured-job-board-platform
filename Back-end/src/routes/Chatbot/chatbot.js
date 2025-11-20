const express = require("express");
const axios = require("axios");
const router = express.Router();
const persona = require('./persona.json');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;


router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  try {
    // Persona instructions included in the text
    const personaText = [
  `${persona.name} — ${persona.shortDescription}`,
  `Developer: ${persona.developer.name} (${persona.developer.role}, ${persona.developer.affiliation})`,
  `Purpose: ${persona.purpose}`,
  `Tone: ${persona.tone}`,
  '',
  'Project Overview:',
  persona.projectOverview.summary,
  '',
  'Roles & quick notes:',
  `- Job Seeker: ${persona.roles.jobSeeker.description}`,
  `- Employer: ${persona.roles.employer.description}`,
  `- Admin: ${persona.roles.admin.description}`,
  '',
  'If user asks a procedural question, follow these guidelines:',
  '- Use short numbered steps or bullets',
  '- Keep answers concise, friendly, and professional',
  '',
  'Do NOT:',
  persona.doNot.join(' | ')
  ].join('\n');

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          { parts: [{ text: personaText }] }, // indroductory persona message
          { parts: [{ text: message }] }      // user message
        ],
      },
      {
        headers: {
          "x-goog-api-key": GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates[0]?.content?.parts[0]?.text || "(no reply)";
    res.json({ success: true, reply });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Failed to get reply from Gemini API" });
  }
});

module.exports = router;
