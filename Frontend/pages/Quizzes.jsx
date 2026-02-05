import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import API from "../api";
import "../styles/quizzes.css";

const Quizzes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");

    const res = await API.get("/api/courses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCourses(res.data);
  };

  const openQuiz = async (course) => {
    const token = localStorage.getItem("token");

    const res = await API.get(`/api/ai/quiz/${course._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const normalized = res.data.questions.map((q) => {
      const correctIndex = q.options.findIndex(
        (o) =>
          o.replace(/\s+/g, " ").trim().toLowerCase() ===
          q.correctAnswer.replace(/\s+/g, " ").trim().toLowerCase(),
      );

      return {
        ...q,
        correctIndex,
      };
    });

    setQuestions(normalized);
    setSelectedQuiz(course);
    setAnswers({});
    setFinished(false);
  };

  const choose = (qIndex, optIndex) => {
    if (finished) return;
    setAnswers({ ...answers, [qIndex]: optIndex });
  };

  const submitQuiz = () => setFinished(true);

  const score = questions.filter(
    (q, i) => answers[i] === q.correctIndex,
  ).length;

  return (
    <div className="home-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="home-content quizzes-content">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        {!selectedQuiz && (
          <>
            <h1 className="quiz-title">Your Recent Quizzes</h1>

            <div className="quiz-list">
              {courses.map((c) => (
                <div
                  key={c._id}
                  className="quiz-item"
                  onClick={() => openQuiz(c)}
                >
                  {c.title}
                </div>
              ))}
            </div>
          </>
        )}

        {selectedQuiz && (
          <>
            <button className="back-btn" onClick={() => setSelectedQuiz(null)}>
              ← Back
            </button>

            <h2>{selectedQuiz.title}</h2>

            {finished && (
              <div className="score">
                Score: {score}/{questions.length}
              </div>
            )}

            {questions.map((q, i) => (
              <div key={i} className="question-card">
                <p className="question-text">
                  <strong>Question {i + 1}:</strong> {q.question}
                </p>

                {q.options.map((opt, idx) => {
                  const label = ["A", "B", "C", "D"][idx];

                  let cls = "option";

                  const correctIdx = q.correctIndex;

                  if (finished && idx === correctIdx) cls += " correct";

                  if (finished && answers[i] === idx && idx !== correctIdx)
                    cls += " wrong";

                  if (!finished && answers[i] === idx) cls += " selected";

                  return (
                    <div
                      key={opt}
                      className={cls}
                      onClick={() => choose(i, idx)}
                    >
                      <strong>{label}.</strong> {opt}
                    </div>
                  );
                })}

                {finished && <p className="explanation">{q.explanation}</p>}
              </div>
            ))}

            {!finished && questions.length > 0 && (
              <button className="submit-btn" onClick={submitQuiz}>
                Finish Quiz
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Quizzes;
