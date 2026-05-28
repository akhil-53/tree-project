import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/24BCE0034_L1_MP_AKHILESWAR_Navbar';
import Landing from './pages/24BCE0034_L1_MP_AKHILESWAR_Landing';
import Index from './pages/24BCE0034_L1_MP_AKHILESWAR_Index';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/planner" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;