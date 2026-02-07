import "../styles/uploadcard.css";

const UploadCard = ({ onUpload }) => {
  return (
    <div className="upload-card">
      <div className="upload-icon">+</div>

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
