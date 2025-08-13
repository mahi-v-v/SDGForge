// src/pages/UploadPage.jsx

import { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Import the main CSS file

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Exam-specific state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // Handles the file selection when a user chooses a PDF.
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        setSelectedFile(null);
        setQuizData(null);
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  // Handles the upload process, sending the PDF to the backend.
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');
    setQuizData(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Make the POST request to your backend's generate-quiz endpoint.
      // This assumes your backend returns a full list of questions.
      const response = await axios.post('http://127.0.0.1:5000/api/generate-quiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // On success, store the quiz data.
      setQuizData(response.data);
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.data.error || 'Server error'}`);
      } else if (err.request) {
        setError('Error: No response from the server. Is the backend running?');
      } else {
        setError('Error: An unexpected error occurred.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handles the user selecting an option for the current question.
  const handleOptionSelect = (option) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: option,
    });
  };

  // Handles navigation to the next question.
  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handles navigation to the previous question.
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Navigates directly to a question via the dashboard.
  const handleDashNav = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Placeholder for the final submission logic.
  const handleSubmitQuiz = () => {
    // Here you would implement logic to score the quiz or send results to the backend.
    alert("Quiz submitted! This is a placeholder. You would show results here.");
  };

  // Reset the component state to go back to the upload form.
  const handleReset = () => {
    setSelectedFile(null);
    setQuizData(null);
    setLoading(false);
    setError('');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  // Conditional rendering based on whether quizData is available.
  if (loading) {
    return (
      <div className="upload-page-container">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Please wait, your quiz is being generated...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="upload-page-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
        <button onClick={handleReset} className="reset-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="upload-page-container">
      {quizData ? (
        // The Exam Mode View
        <div className="exam-mode">
          <div className="question-area">
            <div className="question-header">
              <h2>Question {currentQuestionIndex + 1}</h2>
              <button onClick={handleReset} className="reset-button">
                ← Upload Another File
              </button>
            </div>
            
            <div className="question-card">
              <h3>{quizData[currentQuestionIndex].question}</h3>
              <div className="options-list">
                {quizData[currentQuestionIndex].options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`option-item ${userAnswers[currentQuestionIndex] === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div className="navigation-controls">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="nav-button prev-button"
              >
                Previous
              </button>
              {currentQuestionIndex < quizData.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="nav-button next-button"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="nav-button submit-button"
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>

          <div className="dashboard-area">
            <h3>Questions</h3>
            <div className="dashboard-grid">
              {quizData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDashNav(index)}
                  className={`dash-button ${currentQuestionIndex === index ? 'active' : ''} ${userAnswers[index] ? 'answered' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // The Upload Form View
        <div className="main-content">
          <div className="input-section">
            <h2>Generate a Quiz</h2>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={loading}
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="button"
            >
              {loading ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>

          {selectedFile && (
            <p className="file-info">Selected: {selectedFile.name}</p>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadPage;
