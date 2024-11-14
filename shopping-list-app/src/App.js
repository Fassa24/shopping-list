import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShoppingListDetail from './components/ShoppingListDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/list/:id" element={<ShoppingListDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
