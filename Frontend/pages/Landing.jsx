import "../styles/landing.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <section className="landing">
      <div className="landing-inner">
        <div className="landing-content">
          <h1>
            Turn PDFs into <span>Smart Quizzes</span>
          </h1>

          <p>
            Upload your study materials and instantly generate quizzes,
            flashcards, and explanations powered by AI. Study smarter, not
            harder.
          </p>

          <div className="landing-buttons">
            <button
              className="btn-primary large"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </button>
            <button className="btn-outline large">Learn More</button>
          </div>
        </div>

        <div className="landing-visual">
          <div className="card">
            <h3> Upload PDF</h3>
            <p>AI reads your content</p>
          </div>
          <div className="card">
            <h3> Generate Quiz</h3>
            <p>Instant MCQs & flashcards</p>
          </div>
          <div className="card">
            <h3> Learn Faster</h3>
            <p>Understand with explanations</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
