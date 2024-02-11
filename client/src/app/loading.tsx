import { Skeleton } from "@nextui-org/react";
export default function Loading() {
       return (
              <div className="h-screen">
              <div className="relative flex h-full w-72 flex-1 flex-col p-6">
                     <Skeleton className="rounded-lg h-full">
                     </Skeleton>
              </div></div>
       );
}