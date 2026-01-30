export const shortNotesPrompt = (text) => `
You are an expert teacher.

From the content below, generate chapter-wise short notes.

Rules:
- Mention MAIN POINTS clearly
- Use simple language
- Explain concepts beautifully but concisely
- Structure clearly with headings and bullet points

Output format (JSON):
{
  "chapters": [
    {
      "title": "Chapter title",
      "content": "Well structured explanation"
    }
  ]
}

CONTENT:
${text}
`;

export const quizPrompt = (text) => `
You are an exam question creator.

Generate EXACTLY 25 multiple-choice questions from the content.

Rules:
- Each question must have 4 options
- One correct answer
- Provide short explanation
- Medium difficulty
- Avoid repeating questions

Output format (JSON):
{
  "questions": [
    {
      "question": "",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "",
      "explanation": ""
    }
  ]
}

CONTENT:
${text}
`;

export const flashCardPrompt = (text) => `
You are creating study flashcards.

Generate EXACTLY 15 flashcards.

Rules:
- Front: short question or term
- Back: clear explanation
- Focus on important concepts only

Output format (JSON):
{
  "cards": [
    {
      "front": "",
      "back": ""
    }
  ]
}

CONTENT:
${text}
`;
