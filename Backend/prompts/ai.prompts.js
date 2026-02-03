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
Generate flashcards.

Format strictly:
FRONT: text
BACK: text
===END FLASHCARDS===

CONTENT:
${text}
`;
