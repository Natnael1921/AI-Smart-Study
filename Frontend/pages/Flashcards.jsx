import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import API from "../api";
import "../styles/flashcards.css";
import Spinner from "../components/Spinner";
import { BookOpen, Layers3, Clock } from "lucide-react";
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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="home-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="home-content flashcards-page">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        {!selectedCourse && (
          <>
            {/* HEADER */}
            <div className="flash-header">
              <div>
                <h1>Your Flashcards</h1>
                <p>Flip, learn and memorize faster</p>
              </div>
            </div>

            {/* STATS */}
            <div className="flash-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <BookOpen size={18} />
                </div>
                <p>Total Sets</p>
                <h3>{courses.length}</h3>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Layers3 size={18} />
                </div>
                <p>Total Cards</p>
                <h3>{cards.length || 0}</h3>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Clock size={18} />
                </div>
                <p>Last Studied</p>
                <h3>Today</h3>
              </div>
            </div>

            {loading && <Spinner />}

            {/* LIST */}
            <div className="flash-list">
              {courses.map((c) => (
                <div
                  key={c._id}
                  className="flash-card-item"
                  onClick={() => openFlashcards(c)}
                >
                  <div>
                    <h3>{c.title}</h3>
                    <p>Click to study</p>
                  </div>

                  <span className="flash-date">{formatDate(c.createdAt)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FLASHCARDS VIEW */}
        {selectedCourse && (
          <>
            <button
              className="back-btn"
              onClick={() => setSelectedCourse(null)}
            >
              ← Back
            </button>

            <h2>{selectedCourse.title} flashcards</h2>

            <div className="cards-grid">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className={`flash-modern ${flipped[i] ? "flipped" : ""}`}
                  onClick={() => toggleFlip(i)}
                >
                  <div className="flash-modern-inner">
                    <div className="front">{card.front}</div>
                    <div className="back">{card.back}</div>
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
