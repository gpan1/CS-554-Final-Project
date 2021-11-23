import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Map from "./components/Map";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <header className="App-header">
          <h1 className="App-title">Bash Theory</h1>
          <nav>
            <NavLink className="navlink" to="/">
              Map
            </NavLink>
          </nav>
        </header>
        <div className="App-body">
          <Routes>
            <Route exact path="/" element={<Map />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
