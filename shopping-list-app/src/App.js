import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ShoppingListsOverview from './components/ShoppingListsOverview';
import ShoppingListDetail from './components/ShoppingListDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShoppingListsOverview />} />
        <Route path="/list/:id" element={<ShoppingListDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
