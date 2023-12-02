"use client"
import { Skeleton } from "@nextui-org/react";

export default function Loading() {
       return (
              <>
                     <div className="flex flex-row mt-20 justify-center m-20 space-x-10 h-screen">
                            <div className="w-full px-4 py-4 h-2/3">
                                   <Skeleton className="h-full rounded-lg w-full"></Skeleton>
                            </div>
                            <div className="w-full px-4 py-4 h-2/3">
                                   <Skeleton className="h-full  rounded-lg w-full"></Skeleton>
                            </div>
                     </div>

              </>
       );
}
