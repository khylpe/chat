import React from 'react';
// import logo from './../img/logo.png'
import Image from 'next/image'

const NotAuthorized = () => {
       return (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                     <div className="flex flex-col text-center space-y-8">
                            <span className='text-5xl'>403: Forbidden</span>
                            <span className='text-3xl'>Access Denied</span>

                            <div className="mx-auto">
                                   <Image src={"https://crahe-arthur.com/public_files/img/logo.png"} alt="logo" width={300} height={300} />
                            </div>
                            <span className='text-3xl'>You are not allowed to access this room.</span>

                     </div>
              </div>
       );
};

export default NotAuthorized;
