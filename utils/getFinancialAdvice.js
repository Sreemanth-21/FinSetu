// utils/getFinancialAdvice.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  try {
    const userPrompt = `
      You are a professional financial advisor. 
      Based on the following data:
      - Total Budget: ${totalBudget} INR
      - Total Income: ${totalIncome} INR
      - Total Expenses: ${totalSpend} INR

      Task:
      Provide personalized financial advice.

      Formatting rules (must follow strictly):
      - Each advice point must start with "-"
      - Requesting you to give each point in a different line
      - Each point must be separated by a newline (\n)
      - No paragraphs, use numbering if needed
      - Give exactly 4 accurate suggestions tailored for India
    `;

    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(userPrompt);

    let advice = response.response.text()
      .replace(/\*\*/g, "")       // remove bold markers
      .replace(/^\s*[-•]\s*/gm, "- ") // normalize bullet start
      .replace(/- /g, "\n- ")     // force newline before each bullet
      .trim();

    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
