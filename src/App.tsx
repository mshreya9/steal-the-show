import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Shop from './pages/Shop/Shop'
import Category from './pages/Category/Category'
import Occasion from './pages/Occasion/Occasion'
import Product from './pages/Product/Product'
import Search from './pages/Search/Search'
import Wishlist from './pages/Wishlist/Wishlist'
import Bag from './pages/Bag/Bag'
import GroupOrders from './pages/GroupOrders/GroupOrders'
import Profile from './pages/Profile/Profile'
import StaticPage from './pages/Static/StaticPage'
import NotFound from './pages/NotFound/NotFound'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/costumes" element={<Navigate to="/category/costumes" replace />} />
        <Route path="/fashion" element={<Navigate to="/category/fashion" replace />} />
        <Route path="/performance" element={<Navigate to="/category/performance" replace />} />
        <Route path="/kids" element={<Navigate to="/category/kids" replace />} />
        <Route path="/accessories" element={<Navigate to="/category/accessories" replace />} />
        <Route path="/group-orders" element={<GroupOrders />} />
        <Route path="/occasion/:occasion" element={<Occasion />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/bag" element={<Bag />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/legal/:slug" element={<StaticPage />} />
        <Route path="/help/:slug" element={<StaticPage />} />
        <Route path="/company/:slug" element={<StaticPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
