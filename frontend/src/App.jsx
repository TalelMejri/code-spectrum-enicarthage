import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SbsBook from './pages/SbsBook';
import Home from './pages/Home';

function App() {
  return (
    <div className='bg-gradient-to-b from-ieee-blue-light to-ieee-blue-dark'>
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landingPage/:id/:name" element={<SbsBook />} />
      </Routes>
    </BrowserRouter>
    </div>

   
  );
}

export default App;