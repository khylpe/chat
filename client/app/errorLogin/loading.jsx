"use client"
import { Skeleton } from "@nextui-org/react";

export default function ErrorLogin() {
       return (<>
              <div className="flex justify-center mt-64 w-full h-full">
                     <Skeleton className='w-[300px] h-[200px] rounded-lg'></Skeleton>
              </div>
       </>);
}