import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameCanvas from "./components/GameCanvas";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameCanvas />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;