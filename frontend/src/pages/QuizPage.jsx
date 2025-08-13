// src/QuizPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function QuizPage() {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch the first question when the component mounts.
    useEffect(() => {
        const fetchFirstQuestion = async () => {
            setLoading(true);
            try {
                // Assuming the start-exam endpoint returns the first question.
                // If not, you'd need a separate endpoint like /api/get-question/examId
                // For this example, we'll assume the start-exam endpoint returned it.
                // For now, let's mock it for the demo.
                setCurrentQuestion({
                  id: 1,
                  question: 'What is a firewall?',
                  options: ['A wall that has a fire on it', 'A network security device', 'A tool for managing fires', 'A type of operating system'],
                  answer: 'A network security device'
                });
            } catch (err) {
                setError('Failed to load the first question.');
            } finally {
                setLoading(false);
            }
        };

        // In a real app, you would fetch the first question here if it wasn't
        // returned by the start-exam endpoint.
        // fetchFirstQuestion();
    }, [examId]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleSubmit = async () => {
        if (!selectedOption) {
            setError('Please select an option.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/submit-answer', {
                exam_id: examId,
                question_id: currentQuestion.id,
                answer: selectedOption,
            });

            // If the backend returns a new question, update the state.
            // If the backend indicates the exam is over, navigate to results.
            if (response.data.next_question) {
                setCurrentQuestion(response.data.next_question);
                setSelectedOption(null); // Clear selected option for next question
            } else if (response.data.exam_finished) {
                navigate(`/results/${examId}`);
            }
        } catch (err) {
            if (err.response) {
                setError(`Error submitting answer: ${err.response.data.error || 'Server error'}`);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-indicator">Loading question...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <h2>Adaptive Exam</h2>
            {currentQuestion ? (
                <div>
                    <div className="question-container">
                        <h3>{currentQuestion.question}</h3>
                        <div className="options-list">
                            {currentQuestion.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`option-item ${selectedOption === option ? 'selected' : ''}`}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="submit-area">
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedOption || loading}
                            className="button"
                        >
                            Submit Answer
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>No questions available. Please start a new exam.</div>
            )}
        </div>
    );
}

export default QuizPage;
