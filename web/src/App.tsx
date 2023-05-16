import logoImg from './assets/logo-nlw-esports.svg'
import { GameCard } from './components/GameCard'
import { CreateBaner } from './components/CreateBanner'
import { CreateAdModal } from './components/CreateAdModal'
import { useState, useEffect } from 'react'
import axios from 'axios'
import * as Dialog from '@radix-ui/react-dialog'


import './styles/main.css'

interface Game {
  id: string
  name: string
  bannerUrl: string
  _count: {
    Ad: number
  }
}


function App() {

  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios ('http://localhost:3333/games')
    .then(response => {
      setGames(response.data)
    })
  }, [])

  return (
    <div className='max-w-[1344] mx-auto flex flex-col items-center my-20'>
      <img src={logoImg} alt="" />

      <h1 className='text-white text-6xl font-black mt-20'>Seu <span className='bg-nlw-gradient text-transparent bg-clip-text'>duo</span> está aqui.</h1>

      <div className="grid grid-cols-6 gap-6 mt-16 mx-16">
        {games.map(game => {
          return (
            <GameCard
              key={game.id}
              title={game.name}
              image={game.bannerUrl}
              ads={game._count.Ad}
            />
          )
        })}
      </div>
      <Dialog.Root>
        <CreateBaner />
        <CreateAdModal />
      </Dialog.Root>

    </div>
  )
}

export default App
