import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/quizzes").then(res => setQuizzes(res.data)).catch(() => {});
  }, []);

  return (
    <div className="quiz-list">
      {quizzes.map(q => (
        <div className="quiz-card" key={q._id}>
          <h4>{q.title}</h4>
          <p>{q.description}</p>
          <button onClick={() => navigate(`/quiz/${q._id}`)}>Take Quiz</button>
        </div>
      ))}
    </div>
  );
};

export default QuizList;
