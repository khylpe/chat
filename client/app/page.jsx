"use client"
// import logo from './img/logo.png'
import Image from 'next/image'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
export default function Page() {
       return (
              <div className='mt-36 flex flex-col items-center'>
                     {/* <img src={logo} alt="Arthur CRAHE logo" /> */}
                     <Image draggable={0} src={"https://crahe-arthur.com/public_files/img/logo.png"} alt="logo" width={500} height={500}></Image >
                     <Link href={"/createOrJoin"}>
                            <Button color='default' variant='shadow' className='mt-10'>Start chatting</Button>
                     </Link>
              </div>
       )
}
