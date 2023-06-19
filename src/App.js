import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './HOC/Layout';
import HomePage from './Page/HomePage/HomePage';
import LoginPage from './Page/LoginPage/LoginPage';
import AccumulatedChart from './chart/AccumulatedChart';
import ChartTestAo from './chart/ChartTestAo';
import ChartTestDelete from './ChartReport/ChartTestDelete';
import TestMenu from './chart/TestMenu';
import ChartMenuAcc from './ChartAccumulated/ChartMenuAcc';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path='/HomePage' element={<HomePage />} />

          <Route path='/' element={<LoginPage />} />
          <Route path='/test' element={<Layout Component={ChartTestDelete} />} />

          <Route path='/Acumulated' element={<Layout Component={AccumulatedChart} />} />
          <Route path='/ChartKg' element={<Layout Component={ChartTestAo} />} />
          <Route path='/testMenu' element={<Layout Component={TestMenu} />} />
          <Route path='/chartAccMenu' element={<Layout Component={ChartMenuAcc} />} />

        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
