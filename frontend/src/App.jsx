import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateWish from './pages/CreateWish';
import BirthdayPage from './pages/BirthdayPage';
import ShareWish from './pages/ShareWish';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateWish />} />
        <Route path="/wish/:slug/share" element={<ShareWish />} />
        <Route path="/wish/:slug" element={<BirthdayPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
