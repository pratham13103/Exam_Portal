import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Exam } from './pages/Exam'
import { CreateTest } from './pages/CreateTest'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/signin' element={<Signin/>} />
          <Route path='/exam' element={<ProtectedRoute><Exam/></ProtectedRoute>} />
          <Route path='/create-test' element={<ProtectedRoute><CreateTest/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
