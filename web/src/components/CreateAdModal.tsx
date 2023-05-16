import { Input } from './Form/Input' 
import { Check, GameController } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import { useState, useEffect, FormEvent } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import axios from 'axios'


interface Game {
    id: string;
    name: string;
  }

export function CreateAdModal (){

    const [games, setGames] = useState<Game[]>([])
    const [weekDays, setWeekDays] = useState<string[]>([])
    const [voiceChat, setVoiceChat] = useState<boolean>(false)

    useEffect(() => {
        axios ('http://localhost:3333/games').then(response => {
          setGames(response.data)
        })
    }, [])

    async function handleCreateAd (event: FormEvent) {
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData)

        if(!data.game || !data.name || !data.yearsPlaying || !data.discord || !data.hourStart || !data.hourEnd || weekDays.length === 0) {
          alert('Preencha todos os campos')
          console.log(data)
          console.log(weekDays)
          console.log(voiceChat)
          return
        }

        try {
          await axios.post(`http://localhost:3333/games/${data.game}/ads`,
            {
              gameId: data.game,
              name: data.name,
              weekDay: weekDays.map(day => Number(day)),
              hourStart: data.hourStart,
              hourEnd: data.hourEnd,
              yearsPlaying: Number(data.yearsPlaying),
              useVoice: voiceChat,
              discord: data.discord,
            }
          )

          alert('Anúncio criado com sucesso!')
        } catch (error) {
          console.log(error)
          alert('Ocorreu um erro ao criar o anúncio')

        }
    }

    return (
        <Dialog.Portal>
          <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>

          <Dialog.Content className='bg-[#2A2624] fixed py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[30rem] shadow-lg shadow-black/35'>
            <Dialog.Title className='text-3xl font-bold'>Publique um anúncio</Dialog.Title>


            <form onSubmit={handleCreateAd} className='flex flex-col gap-4 mt-8'>

              <div className='flex flex-col gap-2'>
                <label htmlFor='game' className='font-semibold'>Qual o jogo?</label>
                <select 
                    id='game'
                    name='game'
                    className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'
                    defaultValue={''}
                >
                    <option disabled value="">Selecione o game que deseja jogar</option>
                    {games.map(game => {
                        return (<option key={game.id} value={game.id}>{game.name}</option>)
                    })}
                </select>
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor="name">Nome (ou nickname)</label>
                <Input name='name' id='name' placeholder='Digite seu nome ou nickname'/>
              </div>

              <div className='grid grid-cols-2 gap-6'>

                <div className='flex flex-col gap-2'>
                  <label htmlFor='yearsPlaying'>Joga há quantos anos?</label>
                  <Input type='number' name='yearsPlaying' id='yearsPlaying' placeholder='1'/>
                </div>

                <div className='flex flex-col gap-2'>
                  <label htmlFor='dicord'>Qual seu discord?</label>
                  <Input name='discord' id='discord' placeholder='Nickname#1234'/>
                </div>
              </div>

              <div className='flex gap-6'>

                <div className='flex flex-col gap-2'>
                  <label htmlFor='weekDays'>Quais dias costuma jogar?</label>

                  <ToggleGroup.Root type='multiple' className='grid grid-cols-4   gap-2' value={weekDays} onValueChange={setWeekDays}>
                      <ToggleGroup.Item value='0' className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Domingo'>D</ToggleGroup.Item>
                      <ToggleGroup.Item value='1' className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Segunda'>S</ToggleGroup.Item>
                      <ToggleGroup.Item value='2' className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Terça'>T</ToggleGroup.Item>
                      <ToggleGroup.Item value='3' className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Quarta'>Q</ToggleGroup.Item>
                      <ToggleGroup.Item value='4' className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Quinta'>Q</ToggleGroup.Item>
                      <ToggleGroup.Item value='5' className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Sexta'>S</ToggleGroup.Item>
                      <ToggleGroup.Item value='6' className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Sabado'>S</ToggleGroup.Item>
                  </ToggleGroup.Root>
                  

                </div>

                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor='hourStart'>Qual horário do dia?</label>
                  <div className='grid grid-cols-2 gap-1'>
                    <Input type='time' name='hourStart' id='hourStart' placeholder='De'/>
                    <Input type='time' name='hourEnd' id='hourEnd' placeholder='Até'/>
                  </div>
                </div>
              </div>

              <div className='mt-2 flex gap-2 text-sm items-center'>
                <Checkbox.Root 
                  className='w-6 h-6 p-1 rounded bg-zinc-900'
                  checked={voiceChat}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setVoiceChat(true)
                    } else {
                      setVoiceChat(false)
                    }
                  }}
                >
                    <Checkbox.Indicator>
                        <Check className='w-4 h-4 text-emerald-400'/>
                    </Checkbox.Indicator>
                </Checkbox.Root>
                Uso chat de voz
              </div>

              <footer className='mt-4 flex gap-4 justify-end'>
                <Dialog.Close className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'>Cancelar</Dialog.Close>
                <button className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600' type='submit'>
                  <GameController size={24}/>
                  Encontrar Duo
                </button>
              </footer>

            </form>
          
          </Dialog.Content>

        </Dialog.Portal>
    )
}