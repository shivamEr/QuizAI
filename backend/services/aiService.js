const { GoogleGenerativeAI } = require("@google/generative-ai");

// Read the model name from environment variables, with a sensible fallback.
const modelName = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: modelName });

/**
 * Generates quiz questions based on a user's request using the AI model.
 * @param {string} userRequest - The user-provided prompt.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of question objects.
 */
const generateQuestions = async (userRequest) => {
  const finalPrompt = `
    Based on the following user request, create a set of multiple-choice questions.
    User Request: "${userRequest}"

    IMPORTANT: Provide the output in a strict JSON array format. Do not include any text, code block markers, or explanations outside of the raw JSON array.
    Each object in the array must have this exact structure:
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact text of the correct option"
    }
  `;

  try {
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    let text = response.text();

    // Clean the response to ensure it's valid JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Add a specific try...catch for JSON parsing to help with debugging
    try {
      const questions = JSON.parse(text);
      return questions;
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      console.error("--- RAW AI RESPONSE ---");
      console.error(text); // This will show us the exact text that failed
      console.error("-----------------------");
      throw new Error("Failed to parse JSON response from AI.");
    }

  } catch (error) {
    console.error("AI question generation failed:", error);
    throw new Error("Failed to generate questions from AI service.");
  }
};

module.exports = { generateQuestions };