import React, { useRef } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

const QuestionItem = ({ question, qIndex, updateQuestion, updateOption, removeQuestion, loading }) => {
  const textAreaRef = useRef(null);
  
  useAutosizeTextArea(textAreaRef.current, question.text);

  return (
    <div className="bg-background border border-border p-4 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <label htmlFor={`question-text-${qIndex}`} className="form-label">Question {qIndex + 1}</label>
        <button
          onClick={() => removeQuestion(qIndex)}
          className="font-semibold text-danger hover:text-red-700 text-sm"
          disabled={loading}
        >
          Remove
        </button>
      </div>
      <textarea
        id={`question-text-${qIndex}`}
        ref={textAreaRef}
        rows={1}
        style={{ resize: "none" }}
        className="form-textarea w-full mb-3"
        value={question.text}
        onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
        placeholder="Enter question text"
        disabled={loading}
      ></textarea>
      <p className="form-label mb-2">Options:</p>
      {question.options.map((option, oIndex) => (
        <div key={oIndex} className="flex items-center mb-2">
          <input
            type="radio"
            name={`correct-option-${qIndex}`}
            checked={question.correctAnswerIndex === oIndex}
            onChange={() => updateQuestion(qIndex, "correctAnswerIndex", oIndex)}
            className="mr-2 h-4 w-4 text-primary focus:ring-primary border-border"
            disabled={loading}
          />
          <input
            type="text"
            className="form-input w-full"
            value={option}
            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
            placeholder={`Option ${oIndex + 1}`}
            disabled={loading}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionItem;
