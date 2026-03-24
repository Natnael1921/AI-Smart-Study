import "../styles/uploadcard.css";
import Spinner from "./Spinner";
import { UploadCloud } from "lucide-react";

const UploadCard = ({ onUpload, isLoading }) => {
  if (isLoading) {
    return (
      <div className="upload-card">
        <h2>Generating your content...</h2>
        <p>This may take a few seconds</p>
        <Spinner size={70} />
      </div>
    );
  }

  return (
    <div className="upload-card">
      <div className="upload-icon">
        <UploadCloud size={36} />
      </div>

      <h3>Upload your files</h3>

      <ul>
        <li>Add your file</li>
        <li>Get short notes</li>
        <li>Get quizzes</li>
        <li>Get flashcards</li>
      </ul>

      <input
        type="file"
        accept=".pdf"
        onChange={onUpload}
        hidden
        id="fileInput"
      />

      <label htmlFor="fileInput" className="upload-btn">
        Choose PDF
      </label>
    </div>
  );
};

export default UploadCard;
