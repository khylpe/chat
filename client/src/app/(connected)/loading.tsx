import { Skeleton } from "@nextui-org/react";
export default function Loading() {
       return (
              <div className="h-full">
              <div className="relative flex h-full w-full flex-1 flex-col p-6">
                     <Skeleton className="rounded-lg h-full">
                     </Skeleton>
              </div></div>
       );
}