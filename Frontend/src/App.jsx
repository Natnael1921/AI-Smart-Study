import { Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Landing from "../pages/Landing";
import Auth from "../pages/Auth";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
