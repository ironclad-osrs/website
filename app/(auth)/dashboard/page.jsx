import { Chart } from '@/components/chart'
import { format } from '@/utils/number'

const DashboardPage = () => {
  return (
    <>
      <div className='space-y-4 rounded-md p-4 ring-1 ring-primary'>
        <div className='flex items-center gap-4'>
          <img className='size-4' src='/skills/crafting.png' />
          <p className='text-primary-louder'>Crafting</p>
          <p className='ml-auto'>{format(350)}/{format(10000)}</p>
        </div>
        <Chart
          height={64}
          data={[
            { progress: 0 },
            { progress: 100 },
            { progress: 110 },
            { progress: 150 },
            { progress: 300 },
            { progress: 400 },
            { progress: 500 },
            { progress: 1000 }
          ]}
          dataKey='progress'
        />
      </div>
      <ol className='space-y-4 text-sm'>
        <li>
          <div>
            <div className='flex justify-between gap-4'>
              <p className='text-primary-loud'>remote exec</p>
              <p className='text-secondary'>+{format(100)} xp</p>
            </div>
            <p className='text-xs'>Updated 3 minutes ago</p>
          </div>
        </li>
        <li>
          <div>
            <div className='flex justify-between gap-4'>
              <p className='text-primary-loud'>Sexybeergut</p>
              <p className='text-secondary'>+{format(250)} xp</p>
            </div>
            <p className='text-xs'>Updated 1 hour ago</p>
          </div>
        </li>
      </ol>
    </>
  )
}

export default DashboardPage
