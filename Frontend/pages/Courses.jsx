import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import API from "../api";
import "../styles/courses.css";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const Courses = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="courses-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="courses-content">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        <h1 className="courses-title">Your Courses</h1>

        {loading ? (
          <Spinner />
        ) : courses.length === 0 ? (
          <p className="loading">No courses yet</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div className="course-card" key={course._id}>
                <h3>{course.title}</h3>

                <div className="course-actions">
                  <button
                    className="ghost-btn"
                    onClick={() => toast.info("Notes coming soon !")}
                  >
                    Notes
                  </button>

                  <button
                    className="primary-btn"
                    onClick={() => navigate(`/quizzes/`)}
                  >
                    Quiz
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => navigate(`/flashcards`)}
                  >
                    Flashcards
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
