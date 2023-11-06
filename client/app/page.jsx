"use client"
import logo from './img/logo.png'
import Image from 'next/image'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
export default function Page() {
       return (
              <div className='mt-36 flex flex-col items-center'>
                     <Image src={logo} alt="logo" width={500}
                            height={500}></Image >
                     <Link href={"/CreateOrJoin"}>
                            <Button color='default' variant='shadow' className='mt-10'>Start chatting</Button>
                     </Link>
              </div>
       )
}
