import { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

const UploadPage = ({ setCurrentPage, setQuestions, setIsLoading, isLoading, setToast }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      setFile(null);
      setToast({ message: "Please upload a valid PDF file.", type: "error" });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setToast({ message: "Please select a PDF file to upload.", type: "error" });
      return;
    }
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://127.0.0.1:5000/api/generate-quiz', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions from the backend.');
      }

      const generatedQuestions = await response.json();
      setQuestions(generatedQuestions);
      setCurrentPage('exam');
      setToast({ message: "Questions generated successfully!", type: "success" });

    } catch (error) {
      console.error("Error generating questions:", error);
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center space-y-6">
      <div className="flex items-center justify-center">
        <UploadCloud size={48} className="text-blue-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800">Upload Exam Questions</h1>
      <p className="text-gray-600">
        Upload a PDF file to generate questions.
      </p>
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf"
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
        />
        {file && (
          <p className="text-sm text-gray-600">Selected file: <span className="font-semibold">{file.name}</span></p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="animate-spin" size={24} />
            <span>Generating Questions...</span>
          </div>
        ) : (
          'Start Exam'
        )}
      </button>
    </div>
  );
};

export default UploadPage;
