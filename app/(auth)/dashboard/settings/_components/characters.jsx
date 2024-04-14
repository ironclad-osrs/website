import { use } from 'react'

import { getCharacters } from '@/actions/get-characters'

export const Characters = () => {
  const characters = use(getCharacters())

  return (
    <>
      <p className='text-primary-loud'>Characters</p>
      <ul className='text-sm'>
        {characters.map(character => (
          <li key={character.id}>
            <div>
              <p>{character.character_name}</p>
              <p className='text-primary-muted'>
                {character.created_at}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
