import { use } from 'react'

import { getApiKey } from '@/actions/get-api-key'
import { regenerateApiKey } from '@/actions/regenerate-api-key'

import { Input } from '@/components/input'
import { Button } from '@/components/button'

export const ApiKey = () => {
  const apiKey = use(getApiKey())

  return (
    <form className='flex items-end gap-4' action={regenerateApiKey}>
      <Input
        className='grow'
        label='API Key'
        value={apiKey}
        disabled
      />
      <Button>Regenerate</Button>
    </form>
  )
}
