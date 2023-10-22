import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './views/Landing'
import Signup from './views/Signup'
import Login from './views/Login'
import Categories from './views/Categories'
import axios from 'axios'
import AuthProvider from './context/AuthContext'
import ProtectedRoute from './utils/ProtectedRoute'
import Items from './views/Items'
import Product from './views/Product'
import CartProvider from './context/CartContext'

axios.defaults.withCredentials = true

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/categories' element={<ProtectedRoute element={<Categories />} />} />
            <Route path='/categories/:category' element={<ProtectedRoute element={<Items />} />} />
            <Route path='/categories/:category/:id' element={<ProtectedRoute element={<Product />} />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export const API_URL = import.meta.env.VITE_API_URL
export default App
