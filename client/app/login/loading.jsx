"use client"
import { Skeleton } from "@nextui-org/react";

export default function ErrorLogin() {
       return (<>
              <div className="flex justify-center mt-32 w-full h-full">
                     <Skeleton className='w-[400px] h-[350px] rounded-lg'></Skeleton>
              </div>
       </>);
}