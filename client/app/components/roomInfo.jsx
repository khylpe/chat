import { Chip } from "@nextui-org/react"
import { HiOutlineStatusOnline, HiStatusOffline } from "react-icons/hi";


export default function RoomInfo({ roomName, owner, description, users, maxUsers }) {
       return (<>
              <div className="w-1/4 bg-zinc-800 rounded-lg p-5 h-5/6">
                     <div className="flex flex-col space-y-5 h-1/2">
                            <div className="flex flex-row justify-between space-x-3">
                                   <span className="text-2xl font-bold break-all">{roomName}</span>
                                   <span className="text-lg">Created by <Chip size="lg">{owner}</Chip></span>
                            </div>
                            <span className="text-lg">{description}</span>
                            <div className="space-y-3 h-full">
                                   <div className="text-xl w-full flex flex-row justify-between">User list <span className="font-bold"> {users.length}/{maxUsers}</span></div>
                                   <div className="flex flex-col space-y-2 h-full overflow-y-auto">
                                          {users.map((user, index) => {
                                                 return (
                                                        <div key={index} className="flex flex-row items-center">
                                                               <Chip color={(owner === user.username) && user.role === "admin" ? "primary" : "default"}>{user.username}</Chip>
                                                               {user.status === "online" ? <HiOutlineStatusOnline className="text-green-500 ml-2 text-2xl" /> : <HiStatusOffline className="text-red-500 ml-2 text-2xl" />}
                                                        </div>
                                                 )
                                          })}
                                   </div>
                            </div>
                     </div>
              </div>
       </>
       )
}