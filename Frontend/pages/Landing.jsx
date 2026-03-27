import "../styles/landing.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const word = "Smart Study Helpers";

const Landing = () => {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!deleting && subIndex < word.length) {
      timeout = setTimeout(() => {
        setText(word.substring(0, subIndex + 1));
        setSubIndex(subIndex + 1);
      }, 190);
    } else if (!deleting && subIndex === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1200);
    } else if (deleting && subIndex > 0) {
      timeout = setTimeout(() => {
        setText(word.substring(0, subIndex - 1));
        setSubIndex(subIndex - 1);
      }, 70);
    } else if (deleting && subIndex === 0) {
      timeout = setTimeout(() => setDeleting(false), 400);
    }

    return () => clearTimeout(timeout);
  }, [subIndex, deleting]);

  return (
    <section className="landing">
      <div className="landing-inner">
        <div className="landing-content">
          <h1>
            Turn PDFs into{" "}
            <span className="typing-container">
              {text}
              <span className="cursor">|</span>
            </span>
          </h1>

          <p>
            Upload your study materials and instantly generate quizzes,
            flashcards, and explanations powered by AI.
          </p>

          <button
            className="btn-primary hero-btn"
            onClick={() => navigate("/auth")}
          >
            Get Started <span className="arrow">→</span>
          </button>
        </div>

        <div className="landing-visual">
          <div className="card">
            <h3>Upload PDF</h3>
            <p>AI reads your content</p>
          </div>

          <div className="card">
            <h3>Generate Quiz</h3>
            <p>Instant MCQs & flashcards</p>
          </div>

          <div className="card">
            <h3>Learn Faster</h3>
            <p>Understand with explanations</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
