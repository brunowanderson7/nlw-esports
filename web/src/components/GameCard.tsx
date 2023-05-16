interface GameCardProps {
    title: string
    image: string
    ads: number
}

export function GameCard (Props: GameCardProps) {
    return (
        <a className='relative rounded-lg overflow-hidden' href="">
          <img src={ Props.image } alt="" />
          <div className='w-full bg-card-gradient px-4 pb-4 pt-16 absolute bottom-0 left-0 right-0'>
            <strong className='text-white font-bold block'>
              { Props.title }
            </strong>
            <span className='text-zinc-300 text-sm block'>
              { Props.ads } anúncios
            </span>
          </div>
        </a>
    )
}