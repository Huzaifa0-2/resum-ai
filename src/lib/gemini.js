import axios from "axios";

export const askGemini = async (prompt) => {
  try {
    // 1️⃣ fetch list of models available to your key
    const listRes = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    const models = listRes.data.models || [];

    // 2️⃣ try to find a model that supports text generation/predict
    const textModel = models.find(m =>
      Array.isArray(m.supportedGenerationMethods) &&
      m.supportedGenerationMethods.includes("generateContent")
    );

    if (!textModel) {
      throw new Error("No generative model found for this API key");
    }

    const modelId = textModel.name; // e.g., "models/text-bison-001"

    // 3️⃣ call predict instead of generateContent
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:predict?key=${process.env.GEMINI_API_KEY}`,
      {
        instances: [
          {
            content: prompt
          }
        ]
      },
      {
        headers: {"Content-Type": "application/json"},
      }
    );

    // extract text reply if format matches API
    const outputs = response.data.predictions || [];
    const reply = outputs.length > 0
      ? outputs[0].content || JSON.stringify(outputs[0])
      : "No reply";

    return reply;

  } catch (err) {
    console.error("AI CHAT ERROR:", err.response?.data || err.message);
    throw err;
  }
};
