import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-quiz-app-1rfr.onrender.com",
});

export default API;
