import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";

import Landing from "./components/Landing";
import ItemDetails from "./components/ItemDetails";
import ItemListing from "./components/ItemListing";
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/item" element={<ItemDetails />} />
        <Route exact path="/listing" element={<ItemListing />} />
        <Route exact path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
