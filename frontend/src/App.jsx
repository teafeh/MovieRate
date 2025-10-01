import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import RateMovie from "./pages/RateMovie";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/rate/:movieId" element={<RateMovie />} />


      </Routes>
    </Router>
  );
}

export default App;
