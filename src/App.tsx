import { Route, Routes } from 'react-router'
import HomePage from './pages/Home'

function App() {
  return (
    <div className="App">
      <Routes>
         <Route path='/' element={<HomePage/>} />
       </Routes>
    </div>
  );
}

export default App;