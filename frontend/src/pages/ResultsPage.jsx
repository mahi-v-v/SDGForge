// src/ResultsPage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ResultsPage() {
    const { examId } = useParams();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;
        const fetchResults = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/end-exam', { exam_id: examId });
                if (isMounted) {
                    setResults(response.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to fetch exam results.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchResults();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, [examId]);

    if (loading) {
        return <div className="loading-indicator">Loading results...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="results-page">
            <h2>Exam Results</h2>
            {results ? (
                <div>
                    <p>Your score: <strong>{results.score}</strong> out of <strong>{results.total_questions}</strong></p>
                    <p>Performance: <strong>{results.performance}</strong></p>
                </div>
            ) : (
                <p>No results found for this exam.</p>
            )}
        </div>
    );
}

export default ResultsPage;
