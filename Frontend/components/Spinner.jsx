import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({ size = 40 }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px"
    }}>
      <ClipLoader color="#7CFF9B" size={size} />
    </div>
  );
};

export default Spinner;
