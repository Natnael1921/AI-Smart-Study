export const quizAndFlashPrompt = (text) => `
Generate content strictly between markers.
DO NOT add anything outside the markers.

===QUIZ===
Generate EXACTLY 25 multiple choice questions.

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

Repeat this format INSIDE this block ONLY:

FRONT: text
BACK: text

Do NOT repeat ===FLASHCARDS=== or ===END FLASHCARDS===

===END FLASHCARDS===

IMPORTANT RULES:
- ALWAYS include ALL markers
- NEVER skip flashcards
- NEVER rename markers
- NEVER add explanations outside blocks

CONTENT:
${text.slice(0, 6000)}
`;
