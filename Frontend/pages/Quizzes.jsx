import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import API from "../api";
import "../styles/quizzes.css";
import Spinner from "../components/Spinner";
import { Plus, BookOpen, CheckCircle, BarChart3, Clock } from "lucide-react";
import { toast } from "react-toastify";

const Quizzes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [showTitleBox, setShowTitleBox] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await API.get("/api/courses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCourses(res.data);
    setLoading(false);
  };

  /*UPLOAD*/
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setTitle(file.name.replace(".pdf", ""));
    setShowTitleBox(true);
  };

  const handleConfirmUpload = async () => {
    if (!title.trim() || !selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);

    const toastId = toast.loading("Creating quiz...");

    try {
      setIsUploading(true);
      setShowTitleBox(false);

      const token = localStorage.getItem("token");

      const res = await API.post("/api/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { courseId } = res.data;

      await API.post(
        "/api/ai/generate",
        { courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.update(toastId, {
        render: "Quiz created successfully!",
        type: "success",
        isLoading: false,
      });

      fetchCourses();
    } catch (err) {
      toast.update(toastId, {
        render: "Upload failed",
        type: "error",
        isLoading: false,
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setTitle("");
    }
  };

  /* QUIZ LOGIC */

  const openQuiz = async (course) => {
    const token = localStorage.getItem("token");

    const res = await API.get(`/api/ai/quiz/${course._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const shuffleArray = (array) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const normalized = res.data.questions.map((q) => {
      const cleanAnswer = q.correctAnswer.replace(/^[A-D]\)\s*/i, "").trim();

      const shuffledOptions = shuffleArray(q.options);

      const correctIndex = shuffledOptions.findIndex(
        (o) => o.trim().toLowerCase() === cleanAnswer.toLowerCase(),
      );

      return {
        ...q,
        options: shuffledOptions,
        correctIndex: correctIndex === -1 ? 0 : correctIndex,
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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="home-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="home-content quizzes-page">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        {!selectedQuiz && (
          <>
            {/* HEADER */}
            <div className="quiz-header">
              <div>
                <h1>Your Recent Quizzes</h1>
                <p>Practice and improve your knowledge</p>
              </div>

              <label className="create-btn">
                <Plus size={18} />
                Create Quiz
                <input type="file" hidden onChange={handleUpload} />
              </label>
            </div>

            {/* STATS */}
            <div className="quiz-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <BookOpen size={18} />
                </div>

                <p>Total Quizzes</p>
                <h3>{courses.length}</h3>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <CheckCircle size={18} />
                </div>

                <p>Completed</p>
                <h3>{courses.length}</h3>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={18} />
                </div>

                <p>Average Score</p>
                <h3>85%</h3>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Clock size={18} />
                </div>

                <p>Last 7 Days</p>
                <h3>5</h3>
              </div>
            </div>

            {loading && <Spinner />}

            {/* LIST */}
            <div className="quiz-list">
              {courses.map((c) => (
                <div
                  key={c._id}
                  className="quiz-card"
                  onClick={() => openQuiz(c)}
                >
                  <div>
                    <h3>{c.title}</h3>
                    <p>Click to start quiz</p>
                  </div>

                  <span className="quiz-date">{formatDate(c.createdAt)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* QUIZ VIEW */}
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

                  if (finished && idx === q.correctIndex) cls += " correct";
                  if (finished && answers[i] === idx && idx !== q.correctIndex)
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

        {/* MODAL */}
        {showTitleBox && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Name your quiz</h3>

              <input value={title} onChange={(e) => setTitle(e.target.value)} />

              <div className="modal-actions">
                <button onClick={() => setShowTitleBox(false)}>Cancel</button>
                <button onClick={handleConfirmUpload}>Generate</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Quizzes;
