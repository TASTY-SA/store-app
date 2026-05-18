import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, LoginPage, PrivateRoute } from '../modules/auth'
import { ShoppingListPage } from '../modules/shopping-list'

export function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/shopping" replace />} />
            <Route path="/shopping" element={<ShoppingListPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
