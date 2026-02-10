import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import API from "../api";
import "../styles/flashcards.css";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
const Flashcards = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await API.get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(res.data);
    } catch (err) {
      toast.error("Failed to load flashcard courses");
    } finally {
      setLoading(false);
    }
  };

  const openFlashcards = async (course) => {
    const token = localStorage.getItem("token");

    const res = await API.get(`/api/ai/flashcards/${course._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCards(res.data.cards || []);
    setSelectedCourse(course);
    setFlipped({});
  };

  const toggleFlip = (i) => {
    setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className="home-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="home-content flashcards-content">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        {!selectedCourse && (
          <>
            <h1 className="flash-title">Your recent Flashcards</h1>
            {loading && <Spinner />}

            <div className="flash-list">
              {courses.map((c) => (
                <div
                  key={c._id}
                  className="flash-course"
                  onClick={() => openFlashcards(c)}
                >
                  {c.title}
                </div>
              ))}
            </div>
          </>
        )}

        {selectedCourse && (
          <>
            <button
              className="back-btn"
              onClick={() => setSelectedCourse(null)}
            >
              ← Back
            </button>

            <h2>{selectedCourse.title} flashcards</h2>

            <div className="cards-wrapper">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className={`flash-card ${flipped[i] ? "flipped" : ""}`}
                  onClick={() => toggleFlip(i)}
                >
                  <div className="flash-inner">
                    <div className="flash-front">{card.front}</div>
                    <div className="flash-back">{card.back}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Flashcards;
