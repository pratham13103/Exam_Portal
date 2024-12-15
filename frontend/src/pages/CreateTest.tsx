import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const CreateTest = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [testName, setTestName] = useState<string>("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [maxMarks, setMaxMarks] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // Function to handle change in the input fields for questions, options, and answer
  const handleQuestionChange = (
    index: number,
    field: "question" | "answer" | "options",
    value: string | string[]
  ) => {
    const updatedQuestions = [...questions];
    if (field === "options") {
      updatedQuestions[index].options = value as string[];
    } else {
      updatedQuestions[index][field] = value as string;
    }
    setQuestions(updatedQuestions);
  };

  // Function to handle the addition of new questions
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!testName || questions.some((q) => !q.question || !q.answer || q.options.includes("") || q.options.length !== 4) || maxMarks <= 0) {
      setError("Please fill all fields correctly.");
      return;
    }

    try {
      // Attempt to send POST request to create a new test
      const response = await axios.post(`${BACKEND_URL}/api/v1/create_test/new-test`,
        {
          testName,
          questions,
          maxMarks,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      // If successful, redirect to another page or show success message
      if (response.status === 201) {
        alert("Test created successfully!");
        navigate("/exam"); // Replace with your desired redirect path
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create test. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Create a New Test</h2>

      {/* Error message */}
      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Test Name Input */}
        <div className="flex flex-col">
          <label htmlFor="testName" className="text-lg font-medium text-gray-700 mb-2">
            Test Name
          </label>
          <input
            type="text"
            id="testName"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="border rounded-lg p-3 text-lg"
            placeholder="Enter test name"
            required
          />
        </div>

        {/* Questions and Answers */}
        <div>
          <label className="text-lg font-medium text-gray-700 mb-2">Questions and Answers</label>
          {questions.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="text-gray-600 font-semibold">Question {index + 1}</label>
                  <textarea
                    className="w-full p-3 border rounded-lg text-lg"
                    value={item.question}
                    onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                    placeholder="Enter question"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-600 font-semibold">Options</label>
                  {item.options.map((option, i) => (
                    <input
                      key={i}
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleQuestionChange(index, "options", [
                          ...item.options.slice(0, i),
                          e.target.value,
                          ...item.options.slice(i + 1),
                        ])
                      }
                      className="w-full p-3 border rounded-lg text-lg mb-2"
                      placeholder={`Option ${i + 1}`}
                      required
                    />
                  ))}
                </div>

                <div>
                  <label className="text-gray-600 font-semibold">Correct Answer</label>
                  <input
                    type="text"
                    value={item.answer}
                    onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                    className="w-full p-3 border rounded-lg text-lg"
                    placeholder="Enter correct answer"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Question Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="bg-green-600 text-white p-4 rounded-full w-full max-w-xs text-lg mb-6"
          >
            Add New Question
          </button>
        </div>

        {/* Max Marks */}
        <div className="flex flex-col">
          <label htmlFor="maxMarks" className="text-lg font-medium text-gray-700 mb-2">
            Maximum Marks
          </label>
          <input
            type="number"
            id="maxMarks"
            value={maxMarks}
            onChange={(e) => setMaxMarks(Number(e.target.value))}
            className="border rounded-lg p-3 text-lg"
            placeholder="Enter max marks"
            min="1"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white p-4 rounded-full w-full max-w-xs text-lg"
          >
            Create Test
          </button>
        </div>
      </form>
    </div>
  );
};

