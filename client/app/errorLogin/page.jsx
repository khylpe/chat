"use client"
import Image from 'next/image'
import { Card, CardHeader, CardBody, CardFooter, Divider, Link } from "@nextui-org/react";
import logo from './../img/logo.png'

export default function ErrorLogin() {
       return (<>
              <div className="flex justify-center mt-64">
                     <Card className="max-w-[400px]">
                            <CardHeader className="flex gap-3">
                                   <Image
                                          alt="Arthur CRAHE logo"
                                          height={40}
                                          radius="sm"
                                          src={logo}
                                          width={40}
                                   />
                                   <div className="flex flex-col">
                                          <p className="text-md">Arthur CRAHÉ</p>
                                          <p className="text-small text-default-500">chat.crahe-arthur.com</p>
                                   </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                   <p className="text-danger">An error occurred, please try again</p>
                            </CardBody>
                            <Divider />
                            <CardFooter className='flex justify-center'>
                                   <Link
                                          isBlock
                                          underline="hover"
                                          showAnchorIcon
                                          color='primary'
                                          href="/login"
                                   >
                                          Login page
                                   </Link>
                            </CardFooter>
                     </Card></div>
       </>);
}