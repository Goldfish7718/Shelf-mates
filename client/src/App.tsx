import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Confirmation from './views/Confirmation'
import Failure from './views/Failure'
import './App.css'
import Success from './views/Success'
import Checkout from './views/Checkout'
import OrderProvider from './context/OrderContext'

axios.defaults.withCredentials = true

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/categories' element={<ProtectedRoute element={<Categories />} />} />
              <Route path='/categories/:category' element={<ProtectedRoute element={<Items />} />} />
              <Route path='/categories/:category/:id' element={<ProtectedRoute element={<Product />} />} />
              <Route path='/confirmation' element={<ProtectedRoute element={<Confirmation />} />} />
              <Route path='/failure' element={<ProtectedRoute element={<Failure />} />} />
              <Route path='/success' element={<ProtectedRoute element={<Success />} />} />
              <Route path='/checkout' element={<ProtectedRoute element={<Checkout />} />} />
            </Routes>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export const API_URL = import.meta.env.VITE_API_URL
export default App
