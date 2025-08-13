import { useState } from "react";
import UploadPage from "./pages/UploadPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import { XCircle } from "lucide-react";

// Toast component for displaying notifications
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";
  const icon = type === "error" ? <XCircle size={20} /> : null;
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-xl text-white flex items-center space-x-2 ${bgColor} z-50`}
    >
      {icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

// Main App component with simple routing and state management
function App() {
  const [currentPage, setCurrentPage] = useState("upload");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // Function to render the correct page based on the state
  const renderPage = () => {
    switch (currentPage) {
      case "upload":
        return (
          <UploadPage
            setCurrentPage={setCurrentPage}
            setQuestions={setQuestions}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setToast={setToast}
          />
        );
      case "exam":
        return (
          <QuizPage setCurrentPage={setCurrentPage} questions={questions} />
        );
      case "results":
        return <ResultsPage setCurrentPage={setCurrentPage} />;
      default:
        return (
          <UploadPage
            setCurrentPage={setCurrentPage}
            setQuestions={setQuestions}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setToast={setToast}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {renderPage()}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}
    </div>
  );
}

export default App;
