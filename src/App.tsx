import { useEffect } from 'react'
import { AppRouter } from './router/AppRouter'
import { useAuthStore } from './store/authStore'

function App() {
  useEffect(() => {
    // Al montar la app, verificar si la cookie httpOnly sigue siendo válida.
    // Si el usuario tenía sesión, el backend devuelve el perfil y se restaura
    // el estado de auth; si no, queda como anónimo.
    useAuthStore.getState().checkAuth()
  }, [])

  return (
    <AppRouter />
  )
}

export default App
