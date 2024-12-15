import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Test {
  id: number;
  testName: string;
  questions: { question: string; options: string[]; correctAnswer: string }[]; // Assuming this structure
  maxMarks: number;
  createdAt: string;
}

export const Exam = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/exam/all-tests`, {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        });
        setTests(response.data.tests); // Ensure `response.data.tests` matches API response structure
      } catch (err) {
        setError("Failed to fetch tests.");
      }
    };

    fetchTests();
  }, []);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const calculateScore = () => {
    if (!selectedTest) return 0;

    let calculatedScore = 0;

    selectedTest.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        calculatedScore += selectedTest.maxMarks / selectedTest.questions.length;
      }
    });

    return Math.round(calculatedScore);
  };

  const handleSubmit = async () => {
    if (!selectedTest) return;

    const finalScore = calculateScore(); // Calculate the score before submission

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/exam/submit`,
        {
          testId: selectedTest.id,
          answers,
          score: finalScore, // Pass the calculated score
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      if (response.status === 201) {
        alert("Submission successful!");
        setSelectedTest(null);
        setAnswers({});
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Submission failed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Available Exams</h2>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      {!selectedTest ? (
        <div>
          {tests.map((test) => (
            <div
              key={test.id}
              className="border p-4 mb-4 cursor-pointer"
              onClick={() => setSelectedTest(test)}
            >
              <h3 className="text-lg font-semibold">{test.testName}</h3>
              <p>Maximum Marks: {test.maxMarks}</p>
              <p>Date Created: {new Date(test.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-bold mb-4">{selectedTest.testName}</h3>
          {selectedTest.questions.map((q, index) => (
            <div key={index} className="mb-6">
              <p className="font-medium">{q.question}</p>
              {q.options.map((option, i) => (
                <div key={i} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${index}_o${i}`}
                    name={`q${index}`}
                    value={option}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                  <label htmlFor={`q${index}_o${i}`} className="ml-2">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white p-3 rounded-lg"
          >
            Submit Exam
          </button>
        </div>
      )}
    </div>
  );
};
