// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadPage from "./pages/UploadPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import "./App.css"; // Import the main CSS file

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Adaptive Quiz
            </Link>
          </h1>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/quiz/:examId" element={<QuizPage />} />
            <Route path="/results/:examId" element={<ResultsPage />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2025 SDGForge</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
