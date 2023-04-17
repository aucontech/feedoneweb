import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './HOC/Layout';
import HomePage from './Page/HomePage/HomePage';
import LoginPage from './Page/LoginPage/LoginPage';
import TestProject from './VungNuoi/Test-project';

function App() {
  return (
    <div className="App">


      <BrowserRouter>
        <Routes>
          <Route path='/HomePage' element={<Layout Component={HomePage} />} />

          <Route path='/' element={<LoginPage />} />
          <Route path='/test' element={<TestProject />} />
        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
