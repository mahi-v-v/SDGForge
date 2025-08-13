import { BarChart2 } from 'lucide-react';

const ResultsPage = ({ setCurrentPage }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center space-y-6">
      <div className="flex items-center justify-center">
        <BarChart2 size={48} className="text-purple-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800">Exam Results</h1>
      <p className="text-gray-600">
        This page will show the user's score, performance, and feedback based on their exam session.
      </p>
      {/* Placeholder for future results display */}
      <div className="mt-4">
        <p className="text-2xl font-bold">Your Score: <span className="text-purple-600">85%</span></p>
      </div>
      <button
        onClick={() => setCurrentPage('upload')}
        className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg"
      >
        Restart
      </button>
    </div>
  );
};

export default ResultsPage;
