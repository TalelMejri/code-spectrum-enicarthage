import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SbsBook from './pages/SbsBook';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landingPage" element={<SbsBook />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;