import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Battle from "./components/Battle/Battle";
import MainMenu from "./components/MainMenu/MainMenu";
import Selection from "./components/PokemonSelection/selection";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </Router>
  );
};

export default App;
