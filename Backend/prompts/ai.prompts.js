export const quizAndFlashPrompt = (text) => `
Generate content strictly between markers.
DO NOT add anything outside the markers.

===QUIZ===
Generate EXACTLY 20 multiple choice questions .

Format strictly:
Q: question
A) option
B) option
C) option
D) option
ANSWER: full correct option text
EXPLANATION: short explanation
===END QUIZ===

===FLASHCARDS===
Generate EXACTLY 15 flashcards.

Format strictly:
FRONT: text
BACK: text
===END FLASHCARDS===

IMPORTANT RULES:
- ALWAYS include ALL markers
- NEVER rename markers
- NEVER skip sections

CONTENT:
${text.slice(0, 4000)}
`;
