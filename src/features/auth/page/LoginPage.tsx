import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')


  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const ok = await login({ user, password })
    if (!ok) {
      console.log('Credenciales invalidas')
      return
    }
    navigate("/")
  }
  return (
    <form onSubmit={onSubmit}>
      <input
        value={user}
        onChange={(e) => setUser(e.target.value)}
        type="text"
        placeholder="ingresa tu user"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="ingresa tu pass" />

      <button type="submit">Ingresar</button>
    </form>
  );
};