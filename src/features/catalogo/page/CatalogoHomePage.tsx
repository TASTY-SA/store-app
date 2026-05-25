import { NavBar } from '../../../shared/NavBar/NavBar'
import { TarjetasPromos } from '../components/tarjetas'
import { CatalogoTarjetas } from '../components/catalogotarjetas'

export const CatalogoHomePage = () => {
  return (
    <div className="min-h-screen bg-[#f7f6d8] text-[#245433]">

      <NavBar />
      <TarjetasPromos />
      <CatalogoTarjetas />
    </div>
  )
}