import Image from 'next/image'

export const Logo = ({ size }) => (
  <Image
    src='/logo.png'
    alt='Ironclad logo'
    width={size ?? 48}
    height={size ?? 48}
    priority
  />
)
