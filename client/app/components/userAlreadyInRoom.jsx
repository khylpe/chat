import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Accordion, useDisclosure, AccordionItem } from "@nextui-org/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import Link from "next/link";
import { useState } from 'react';

export default function UserAlreadyInRoom({ roomInfo, isUserAdmin, removeOrLeaveRoom }) {
       const [showConfirm, setShowConfirm] = useState(false);
       const { isOpen, onOpen, onOpenChange } = useDisclosure();


       const handleConfirmClick = () => {
              setShowConfirm(true);
       };

       const handleCancelClick = () => {
              setShowConfirm(false);
       };

       const handleYesClick = () => {
              removeOrLeaveRoom();
              setShowConfirm(false);
       };

       return (
              <Modal size='2xl' isOpen={true} isDismissable={false} scrollBehavior="inside" backdrop="blur" className='p-5' defaultOpen hideCloseButton>
                     <ModalContent>
                            {(onClose) => (
                                   <>
                                          <ModalHeader>
                                                 {showConfirm ?
                                                        null
                                                        :
                                                        <div className='flex flex-col space-y-1'>
                                                               <span>Room Found !</span>
                                                               <span className='font-light text-sm'>You are already in a room, you can join it back !</span>
                                                        </div>
                                                 }
                                          </ModalHeader>
                                          <ModalBody>
                                                 {showConfirm ?
                                                        <div className="flex flex-col items-center space-y-10">
                                                               <span className="text-4xl">Are you sure?</span>
                                                               <div className="flex space-x-3">
                                                                      <Button className="px-8 py-6 text-2xl" color="danger" variant="flat" onClick={handleYesClick}>
                                                                             Yes
                                                                      </Button>
                                                                      <Button className="px-8 py-6 text-2xl" variant="light" onClick={handleCancelClick}>
                                                                             Cancel
                                                                      </Button>
                                                               </div>
                                                        </div>
                                                        :
                                                        <Accordion variant='bordered'>
                                                               <AccordionItem
                                                                      is
                                                                      subtitle="More information"
                                                                      key={roomInfo.id}
                                                                      aria-label={roomInfo.name}
                                                                      title={
                                                                             <>
                                                                                    {roomInfo.name}
                                                                                    {isUserAdmin && <Chip color="default" className='ml-3'>Owner</Chip>}
                                                                             </>
                                                                      }
                                                                      indicator={<span>{`${roomInfo.users ? roomInfo.users.length : 0}/${roomInfo.maxUsers}`}</span>}
                                                               >

                                                                      <div className="flex flex-col space-y-10 mt-3">
                                                                             {isUserAdmin ? (
                                                                                    null
                                                                             ) : (
                                                                                    <div className='space-y-3'>
                                                                                           <div>The owner of the room is<Chip color="default">{roomInfo.owner}</Chip>
                                                                                           </div>
                                                                                    </div>
                                                                             )}
                                                                             <span className='text-justify'>{roomInfo.description}</span>
                                                                             <div className="flex flex-row justify-between">
                                                                                    <span className="text-default-500">{roomInfo.creationDateAndTime}</span>
                                                                                    <Button className='hover:cursor-default' disableRipple disableAnimation variant='flat' color={roomInfo.requiresPassword ? "warning" : "success"} endContent={roomInfo.requiresPassword ? <FaLock></FaLock> : <FaLockOpen></FaLockOpen>}>
                                                                                           {roomInfo.requiresPassword ? 'Password Required' : 'No password'}
                                                                                    </Button>
                                                                             </div>
                                                                      </div>
                                                               </AccordionItem>
                                                        </Accordion>
                                                 }

                                          </ModalBody>
                                          <ModalFooter>
                                                 {showConfirm ? (
                                                        null
                                                 ) : (
                                                        <>
                                                               <Button color="danger" variant="light" onClick={handleConfirmClick}>
                                                                      {isUserAdmin ? 'Delete room' : 'Leave room'}
                                                               </Button>

                                                               <Link href={'/chat/' + roomInfo.id}>
                                                                      <Button color="default" >
                                                                             Join
                                                                      </Button>
                                                               </Link>
                                                        </>
                                                 )}
                                          </ModalFooter>
                                   </>
                            )}
                     </ModalContent>
              </Modal>
       );
}