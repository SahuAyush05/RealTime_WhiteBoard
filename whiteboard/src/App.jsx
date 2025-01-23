import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Landing from "./pages/landing/Landing";
import Next from "./pages/landing/next";
import Select from "./pages/Select/Select";
import PrivateRoute from "./routes/privateRoute";
import Konvo from "./pages/canvas/Konvo";
import RouteWatcher from "./routes/trackRoute";
function App() {
  return (
    <Router>
      {/* <RouteWatcher> */}
        <Routes>
          <Route path="/" element={<Landing />}>
            <Route index element={<Next />} />
            <Route
              path="/select"
              element={
                <PrivateRoute>
                  <Select />
                </PrivateRoute>
              }
            />
            <Route path="/whiteboard/:roomKey" element={<Konvo />} />
          </Route>
        </Routes>
      {/* </RouteWatcher> */}
    </Router>
  );
}

export default App;
