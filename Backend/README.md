# AI Quiz App – Backend

Backend API 

Live URL:  
https://ai-quiz-app-1rfr.onrender.com

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Groq AI (LLaMA 3.1)
- Render (deployment)

---

## Base URLs


---

## Auth Routes

### Register
**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "123456"
}

------------------------------------


### Login

POST /api/auth/login

{
  "email": "john@email.com",
  "password": "123456"
}


Response:

{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@email.com"
  }
}


-----------------------------------


Course Routes 

Create Course

POST /api/courses

{
  "title": "Microprocessor Basics",
  "fileName": "chapter1.pdf"
}

Get User Courses

GET /api/courses

Returns all courses created by the logged-in user.

File Upload Route (Protected)
Upload PDF & Extract Text

POST /api/upload

Form Data

file → PDF file

title → Course title

Response:

{
  "courseId": "COURSE_ID",
  "extractedText": "Extracted text from PDF"
}


---------------------------


AI Routes 
Generate Quiz & Flashcards

POST /api/ai/generate

{
  "courseId": "COURSE_ID",
  "extractedText": "TEXT_FROM_PDF"
}


Response:

{
  "message": "AI content generated successfully",
  "quizCount": 25,
  "flashCardCount": 15
}

---------------------

Get Quiz by Course ID

GET

/api/ai/quiz/:courseId

Response: 

{
  course: ObjectId,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
      explanation: String
    }
  ]
}

----------------------------

Get Flashcards by Course ID

GET

/api/ai/flashcards/:courseId

Response:
{
  "cards": [
    {
      "front": "",
      "back": ""
    }
  ]
}