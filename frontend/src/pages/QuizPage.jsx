import { useState } from 'react';
import { FileText } from 'lucide-react';

const QuizPage = ({ setCurrentPage, questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentPage('results');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full text-center space-y-6">
      <div className="flex items-center justify-center">
        <FileText size={48} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800">Adaptive Exam</h1>
      <p className="text-gray-600">
        This is where the exam questions will be displayed.
      </p>
      {currentQuestion ? (
        <div className="border border-gray-300 p-4 rounded-lg text-left bg-gray-50 space-y-4">
          <p className="font-medium text-lg">Question #{currentQuestionIndex + 1}</p>
          <p>{currentQuestion.question}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="question-options"
                  value={option}
                  className="form-radio text-blue-600"
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-red-500">No questions available. Please go back and upload a file.</p>
      )}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleNextQuestion}
          className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit & View Results'}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
