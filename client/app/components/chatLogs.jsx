"use client"

import { useState, useEffect, useRef } from 'react';
import { Button, Textarea, User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { FaBars, FaClipboard, FaEdit, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react"
import { useSocket } from "@/app/contexts/SocketContext"
import Link from "next/link";
import { useSnackbar } from "@/app/contexts/SnackbarContext";

export default function ChatLogs({ messages, roomID }) {
       const messagesContainerRef = useRef(null);
       const { showSnackbar } = useSnackbar();
       const socket = useSocket();
       const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);
       const [messageInput, setMessageInput] = useState("");
       const [editingMessageID, setEditingMessageID] = useState(null);
       const [editedMessage, setEditedMessage] = useState("");
       const { data: session, status } = useSession();

       const username = session?.user?.username;

       useEffect(() => {
              if (!socket) return;
              if (!username) return;
       }, [socket, username]);

       useEffect(() => {
              const messagesContainer = messagesContainerRef.current;
              if (!messagesContainer) return;

              // Scroll to bottom initially
              messagesContainer.scrollTop = messagesContainer.scrollHeight;

              // Set up MutationObserver to keep scrolling on new messages
              const observer = new MutationObserver(() => {
                     messagesContainer.scrollTop = messagesContainer.scrollHeight;
              });

              observer.observe(messagesContainer, { childList: true });

              return () => observer.disconnect();
       }, []);

       const copyMessageToClipboard = (message) => {
              if (navigator.clipboard && window.isSecureContext) {
                     navigator.clipboard.writeText(message)
                            .then(() => {
                                   showSnackbar({ message: `Message copied to clipboard`, color: 'success' });
                            })
                            .catch(err => {
                                   showSnackbar({ message: `Couldn't copy the message to clipboard: ${err.message}`, color: 'danger' });
                            });
              }
       };

       const handleEditMessage = (id, message) => {
              setEditingMessageID(id);
              setEditedMessage(message);
       };

       const handleSubmitEdit = (id, e) => {
              // Emit the updated message to the server
              if (editedMessage === "") { deleteMessage(id); return; }
              socket.emit('editMessage', { messageID: id, roomID: roomID, username: username, newMessage: editedMessage }, (err, response) => {
                     if (err) {
                            showSnackbar({ message: `Couldn't edit the message: ${err.message}`, color: 'danger' });

                     } else {
                            if (response.status === 'error') {
                                   showSnackbar({ message: `Couldn't edit the message: ${response.message}`, color: 'warning' });
                            }
                            // No need to handle success here, as the 'messageDeleted' listener will update the UI
                     }
              });

              setEditingMessageID(null);
              setEditedMessage("");
       };

       const sendMessage = (e) => {
              e.preventDefault();
              const message = messageInput;
              if (!message) return;
              socket.emit('sendMessage', { message: message, roomID: roomID, username: username }, (err, response) => {
                     if (err) {
                            showSnackbar({ message: `Couldn't send the message: ${err.message}`, color: 'danger' });

                     } else {
                            if (response.status === 'error') {
                                   showSnackbar({ message: `Couldn't send the message: ${response.message}`, color: 'warning' });
                            }
                            else if (response.status != 'success') {
                                   showSnackbar({ message: 'Something went wrong', color: 'danger' });

                            } else if (response.status === 'success') {
                                   setMessageInput("");
                            }
                     }
              });
       };

       const deleteMessage = (messageId) => {
              socket.emit('deleteMessage', { messageID: messageId, roomID: roomID, username: username }, (err, response) => {
                     if (err) {
                            showSnackbar({ message: `Couldn't delete the message: ${err.message}`, color: 'danger' });

                     } else {
                            if (response.status === 'error') {
                                   showSnackbar({ message: `Couldn't delete the message: ${response.message}`, color: 'warning' });
                            }
                            // No need to handle success here, as the 'messageDeleted' listener will update the UI
                     }
              });
       };

       const handleMouseEnter = (index) => {
              setHoveredMessageIndex(index);
       };

       const handleMouseLeave = () => {
              setHoveredMessageIndex(null);
       };

       return (
              <>
                     <div className="w-3/4 bg-zinc-800 rounded-lg p-3 h-5/6 flex flex-col justify-end">
                            <div ref={messagesContainerRef} className="overflow-y-auto flex flex-col space-y-1 overflow-x-hidden">
                                   {messages?.map((message, index) => (
                                          <div key={index}
                                                 onMouseEnter={() => handleMouseEnter(index)}
                                                 onMouseLeave={handleMouseLeave}
                                                 className="flex flex-col hover:bg-zinc-900 rounded-lg px-3 py-1 items-start">
                                                 <div className="flex justify-between w-full px-2 pt-0 pl-0">
                                                        <Link href={""}>
                                                               <User
                                                                      className="hover:bg-zinc-800 p-2"
                                                                      name={message.username} // assuming username is part of message
                                                                      description={message.timestamp} // assuming timestamp is part of message
                                                                      isFocusable={true}
                                                               />
                                                        </Link>
                                                        <Dropdown
                                                               backdrop="blur"
                                                               classNames={{
                                                                      base: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                                                                      arrow: "bg-default-200",
                                                               }}
                                                        >
                                                               <DropdownTrigger style={{ display: hoveredMessageIndex === index ? 'block' : 'none' }}
                                                               >
                                                                      <div className="h-fit">
                                                                             <FaBars className="cursor-pointer"></FaBars>
                                                                      </div>
                                                               </DropdownTrigger>
                                                               <DropdownMenu aria-label="Static Actions">
                                                                      <DropdownItem
                                                                             startContent={<FaClipboard />}
                                                                             key="copy"
                                                                             onClick={() => copyMessageToClipboard(messages[index].message)}>
                                                                             Copy message
                                                                      </DropdownItem>

                                                                      {(message.username === username) &&
                                                                             <DropdownItem
                                                                                    key="edit"
                                                                                    startContent={<FaEdit />}

                                                                                    onClick={() => { handleEditMessage(message.id, messages[index].message) }}>
                                                                                    Modify message
                                                                             </DropdownItem>
                                                                      }
                                                                      {(message.username === username || isUserAdmin) &&
                                                                             <DropdownItem
                                                                                    startContent={<FaTrash />}

                                                                                    key="delete"
                                                                                    className="text-danger"
                                                                                    color="danger" onClick={() => deleteMessage(message.id)}>
                                                                                    Delete message
                                                                             </DropdownItem>
                                                                      }
                                                               </DropdownMenu>
                                                        </Dropdown>
                                                 </div>
                                                 {editingMessageID === message.id ? (
                                                        <form className="ml-14 flex flex-row items-center" onSubmit={(e) => handleSubmitEdit(message.id, e)}>
                                                               <Textarea
                                                                      variant="bordered"
                                                                      color="default"
                                                                      value={editedMessage}
                                                                      minRows={1}
                                                                      onChange={(e) => setEditedMessage(e.target.value)}  // Update the state when the input changes

                                                                      onKeyDown={(e) => {
                                                                             if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key without Shift
                                                                                    e.preventDefault(); // Prevent default to avoid new line in textarea
                                                                                    handleSubmitEdit(message.id, e);
                                                                             }
                                                                      }}
                                                               />
                                                               <div className="flex flex-row space-x-3 ml-5">
                                                                      <Button variant="solid" color="success" type="submit">Save</Button>
                                                                      <Button variant="ghost" color="danger" onClick={() => setEditingMessageID(null)}>Cancel</Button>
                                                               </div>
                                                        </form>
                                                 ) : (
                                                        <div className="ml-14">{message.message} {message.isModified ? (<span className="ml-1 text-sm font-thin">(modified)</span>) : null}</div>
                                                 )}                                                 </div>
                                   ))}
                            </div>
                            <form className="mt-5 flex flex-row items-center space-x-3" onSubmit={sendMessage}>
                                   <Textarea
                                          placeholder="Enter your message"
                                          variant="bordered"
                                          color="default"
                                          minRows={1}
                                          isClearable
                                          autoFocus
                                          value={messageInput}  // Bind the state to the value of the Textarea
                                          onChange={(e) => setMessageInput(e.target.value)}  // Update the state when the input changes
                                          onKeyDown={(e) => {
                                                 if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key without Shift
                                                        e.preventDefault(); // Prevent default to avoid new line in textarea
                                                        sendMessage(e);
                                                 }
                                          }}
                                   />
                                   <Button type="submit">Send</Button>
                            </form>
                     </div>
              </>
       )
}