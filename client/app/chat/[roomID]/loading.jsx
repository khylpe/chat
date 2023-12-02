"use client"
import { Skeleton } from "@nextui-org/react";

export default function Loading() {
       return (
              <>
                     <div className="flex flex-row space-x-7 p-5 h-screen mt-10">
                            <div className="w-3/4 rounded-lg h-5/6">
                                   <Skeleton className="h-full w-full rounded-lg"></Skeleton>
                            </div>

                            <div className="w-1/4 rounded-lg h-5/6">
                                   <Skeleton  className="h-full w-full rounded-lg"></Skeleton>
                            </div>
                     </div>

              </>
       );
}
