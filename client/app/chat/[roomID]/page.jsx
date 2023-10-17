"use client"
// chat/[roomID]/page.jsx
import { useSocket } from "@/app/contexts/SocketContext"
import { useSession } from "next-auth/react"
import { SocketProvider } from "@/app/contexts/SocketContext";
import { useEffect, useState } from "react";
import Snackbar from "@/app/components/snackbar";
import { Textarea } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";
import { FaUserAlt, FaBars } from "react-icons/fa";
import { User } from "@nextui-org/react";
import Link from "next/link";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/react";
const ChatWithSocket = ({ params }) => (
       <SocketProvider>
              <Chat roomID={params.roomID} />
       </SocketProvider>
);

const Chat = ({ roomID }) => {
       const { data: session, status } = useSession();
       const username = session?.user?.username;
       const socket = useSocket();
       const [isUserAuthorized, setIsUserAuthorized] = useState(null);

       // For snackbar component
       const [showSnackbar, setShowSnackbar] = useState(false);
       const [sncackbarMessage, setSnackbarMessage] = useState('');
       const [snackbarColor, setSnackbarColor] = useState('primary');
       const [snackbarKey, setSnackbarKey] = useState(0);

       useEffect(() => {
              if (!username || !socket) return;

              const checkAuthorization = async () => {
                     try {
                            const isAuthorizedResponse = await checkIfUserAuthorized(username, roomID, socket);
                            setIsUserAuthorized(isAuthorizedResponse);
                     } catch (error) {
                            setSnackbarMessage(error.message);
                            setSnackbarColor('danger');
                            setShowSnackbar(true);
                            setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                     }
              };

              checkAuthorization();
       }, [username, roomID, socket]);

       const checkIfUserAuthorized = (username, roomID, socket) => {
              return new Promise((resolve, reject) => {
                     socket.timeout(5000).emit('checkIfUserAuthorized', { userName: username, roomID: roomID }, (err, response) => {
                            if (err) {
                                   setSnackbarMessage(err.message);
                                   setSnackbarColor('danger');
                                   setShowSnackbar(true);
                                   setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                                   reject(err);
                            } else {
                                   if (response.status === 'success') {
                                          setSnackbarMessage(`Welcome ${username} !`);
                                          setSnackbarColor('success');
                                          setShowSnackbar(true);
                                          setSnackbarKey(prevKey => prevKey + 1);
                                   }
                                   else if (response.status === 'error') {
                                          setSnackbarMessage(response.message);
                                          setSnackbarColor('warning');
                                          setShowSnackbar(true);
                                          setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                                   }
                                   else {
                                          setSnackbarMessage('Something went wrong');
                                          setSnackbarColor('danger');
                                          setShowSnackbar(true);
                                          setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                                   }
                                   resolve(response.status === 'success');
                            }
                     });
              });
       };

       if (isUserAuthorized === null) return null;  // or some loading state
       return (
              isUserAuthorized ?
                     <div className="flex-grow flex flex-row space-x-7 p-5 h-screen mt-10">
                            <div className="w-3/4 bg-zinc-800 rounded-lg p-3 h-5/6 flex flex-col justify-end">
                                   <div className="overflow-y-auto flex flex-col space-y-5 overflow-x-hidden">
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 items-start">
                                                 <div className="flex justify-between w-full p-2 pt-0 pl-0">
                                                        <Link href={""}>
                                                               <User
                                                                      className="hover:bg-zinc-800 p-2"
                                                                      name="Khylpe"
                                                                      description="15/10/2023"
                                                                      isFocusable={true}
                                                               /></Link>
                                                        <Dropdown classNames={{
                                                               base: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                                                               arrow: "bg-default-200",
                                                        }}>
                                                               <DropdownTrigger>
                                                                      <div className="h-fit">
                                                                             <FaBars className="cursor-pointer"></FaBars>
                                                                      </div>
                                                               </DropdownTrigger>
                                                               <DropdownMenu aria-label="Static Actions">
                                                                      <DropdownItem key="new">New file</DropdownItem>
                                                                      <DropdownItem key="copy">Copy link</DropdownItem>
                                                                      <DropdownItem key="edit">Edit file</DropdownItem>
                                                                      <DropdownItem key="delete" className="text-danger" color="danger">
                                                                             Delete file
                                                                      </DropdownItem>
                                                               </DropdownMenu>
                                                        </Dropdown>
                                                 </div>

                                                 <span className="ml-14 mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                                                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>
                                          </div>

                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac magna id dui bibendum lacinia sit amet rutrum massa. Phasellus eu nunc vel mi varius commodo aliquet dictum arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur mattis dui eros, nec varius lacus consectetur ac. Praesent volutpat magna sit amet metus vulputate consequat. Integer cursus congue sapien, in sollicitudin odio gravida quis. Curabitur ultrices accumsan urna, a tempor arcu molestie sit amet. Sed maximus bibendum nisl, sit amet viverra nulla imperdiet vitae. Sed lacus justo, semper venenatis fermentum ac, cursus sit amet odio. Nam semper ipsum et odio consequat interdum.

                                                        Aenean tempor nunc quis purus dapibus interdum. Sed cursus scelerisque libero. Fusce aliquam justo quam, eget egestas lectus viverra non. Nunc accumsan magna vel lobortis consectetur. Ut a metus fringilla, consectetur risus id, gravida ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut ornare tellus quis elit condimentum auctor. Duis lobortis, ipsum id viverra tincidunt, purus nisi ornare ex, non egestas eros nibh eget massa. Donec commodo egestas augue. Nunc rhoncus viverra tortor. Donec condimentum tristique quam id hendrerit. Vivamus non odio vitae nibh dictum bibendum at ac nibh. Integer purus lorem, dictum id ligula nec, lobortis dignissim nisl. Curabitur eget neque blandit, iaculis eros a, tristique dolor. Sed congue ullamcorper augue, in tempus turpis accumsan eget.

                                                        Pellentesque quis volutpat arcu. Pellentesque mollis, lectus sed luctus euismod, velit quam mollis dui, ac consequat augue orci vel nulla. Mauris augue turpis, fringilla quis vehicula at, porttitor a enim. In feugiat dictum semper. Vivamus scelerisque volutpat dui sodales posuere. Donec tincidunt lacinia justo. In pharetra, ante eget volutpat volutpat, velit quam facilisis mauris, fringilla congue ligula nulla in lectus. Proin placerat sapien mattis diam congue cursus. Donec a gravida dui. Nulla ultricies eros turpis, dapibus rutrum ligula rhoncus ultrices. Maecenas vel erat eros. Proin porttitor, metus id lacinia rhoncus, mauris diam scelerisque mi, a rutrum orci elit pretium turpis. Sed vitae nisl fermentum, pretium orci in, malesuada ligula. Phasellus ac iaculis orci. Curabitur efficitur malesuada risus, a tincidunt tellus interdum at.

                                                        Nam gravida id diam quis bibendum. Etiam enim ligula, porta at rutrum suscipit, molestie sit amet mi. Nullam quis iaculis enim. Nunc id eleifend libero. Donec elementum ligula odio, quis viverra purus lacinia nec. Nam eu dapibus metus. Vestibulum sed ipsum non mauris suscipit volutpat. Ut varius ligula sed enim elementum imperdiet. Ut id bibendum libero, dignissim laoreet enim. Sed vestibulum luctus laoreet. Nam feugiat lobortis varius. Fusce efficitur ut tortor et laoreet. Maecenas egestas ante elit, in venenatis dui gravida ac. Aliquam felis nulla, fringilla nec blandit quis, lacinia id risus. Curabitur nec neque ut erat pulvinar eleifend. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

                                                        Vestibulum porttitor felis non dapibus blandit. Praesent massa tortor, porttitor et magna et, egestas tristique metus. Donec eget sodales turpis, ut maximus enim. Etiam consequat rhoncus sem. Vestibulum sit amet nisi pharetra, convallis erat at, volutpat nisl. Nulla blandit leo sit amet lorem feugiat efficitur. Cras volutpat diam quam, eu sollicitudin ipsum euismod eu. Maecenas eu turpis a sapien consequat mollis.

                                                        Aliquam neque libero, feugiat eget justo non, lacinia vehicula nisl. Sed a justo neque. Nullam fermentum, libero quis sagittis rutrum, sapien urna dapibus neque, id convallis nunc leo quis ex. Aliquam ac dignissim arcu, in semper lacus. Maecenas congue et nulla ac semper. Curabitur consectetur ligula metus. Aliquam at mollis nisi, sit amet malesuada ante. Donec libero sem, elementum sit amet erat eu, vehicula blandit risus. Aenean eu lectus magna. Nunc et mollis nulla, eget tempor magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id sem at risus accumsan euismod nec facilisis orci. Etiam eu sem et sem varius fringilla. Nulla sollicitudin erat et tortor congue, quis venenatis risus pretium. Nulla tellus sem, elementum ac lorem at, rutrum efficitur enim. Cras tempus metus in tellus pellentesque, quis viverra felis maximus.

                                                        Sed dictum purus et augue ultricies, condimentum porta libero suscipit. Vivamus cursus felis tristique orci mattis, non congue enim cursus. Donec accumsan pharetra mauris, vitae egestas quam aliquet a. Etiam pulvinar scelerisque metus gravida vestibulum. Quisque pulvinar, libero et laoreet tincidunt, nisl orci fermentum nisl, nec gravida nunc velit et leo. Quisque sodales sed nibh vel efficitur. In viverra finibus arcu, eget tempus felis ullamcorper ut.

                                                        Nulla aliquet tortor imperdiet leo pretium, a sodales lorem aliquet. Nunc quis aliquam est. Etiam sollicitudin sapien ut elit dignissim congue. Donec fermentum vulputate est, a tincidunt dui bibendum semper. Nunc elementum venenatis fringilla. Donec tempor tempus risus ac auctor. Donec fermentum semper molestie. Curabitur fermentum, ante in tempus finibus, diam ipsum iaculis eros, ut consectetur ipsum lectus eget justo. Proin eu dapibus dolor. Donec sodales congue nisi a finibus. Phasellus ut varius lorem. Pellentesque scelerisque cursus risus pellentesque ornare. Integer commodo arcu quis velit dignissim, a accumsan elit mollis. Proin malesuada diam at commodo auctor. Curabitur sed aliquet leo.

                                                        Quisque maximus semper risus, eu pellentesque nunc molestie ac. Sed posuere hendrerit metus, sed scelerisque ex lobortis at. Maecenas lacus nulla, consequat ut elit nec, auctor commodo eros. Donec porttitor turpis erat, id placerat enim malesuada id. Ut condimentum finibus enim. Sed convallis ligula quis dolor cursus, sed tristique nulla vulputate. In finibus nibh eu facilisis laoreet. Aliquam vulputate eget lectus in ultrices. Duis vestibulum arcu nunc, ut malesuada elit eleifend et. Nulla fermentum lacinia lacus, a placerat magna aliquam et.

                                                        Praesent sem tortor, iaculis et turpis sit amet, pretium tristique augue. Fusce suscipit ante ligula, at mollis leo finibus eget. Nam viverra porttitor porttitor. Proin et eros consequat, lacinia mauris in, egestas eros. Aenean lacus tortor, condimentum non quam ac, tristique hendrerit dui. Morbi facilisis, nulla et finibus rhoncus, orci leo auctor neque, quis pretium nulla elit sit amet turpis. Aenean ac felis non ex cursus luctus nec ac ipsum. Proin at dui mi. Aliquam tristique ultrices gravida. In hac habitasse platea dictumst. Pellentesque molestie, libero at feugiat tristique, ligula turpis ullamcorper lacus, quis vehicula felis lectus quis ligula. Aenean pellentesque arcu risus, vitae iaculis eros interdum nec. Donec et condimentum tellus. Ut purus lectus, malesuada eu blandit in, semper quis purus. Nunc ut ornare metus.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                                                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>
                                          </div>

                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac magna id dui bibendum lacinia sit amet rutrum massa. Phasellus eu nunc vel mi varius commodo aliquet dictum arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur mattis dui eros, nec varius lacus consectetur ac. Praesent volutpat magna sit amet metus vulputate consequat. Integer cursus congue sapien, in sollicitudin odio gravida quis. Curabitur ultrices accumsan urna, a tempor arcu molestie sit amet. Sed maximus bibendum nisl, sit amet viverra nulla imperdiet vitae. Sed lacus justo, semper venenatis fermentum ac, cursus sit amet odio. Nam semper ipsum et odio consequat interdum.

                                                        Aenean tempor nunc quis purus dapibus interdum. Sed cursus scelerisque libero. Fusce aliquam justo quam, eget egestas lectus viverra non. Nunc accumsan magna vel lobortis consectetur. Ut a metus fringilla, consectetur risus id, gravida ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut ornare tellus quis elit condimentum auctor. Duis lobortis, ipsum id viverra tincidunt, purus nisi ornare ex, non egestas eros nibh eget massa. Donec commodo egestas augue. Nunc rhoncus viverra tortor. Donec condimentum tristique quam id hendrerit. Vivamus non odio vitae nibh dictum bibendum at ac nibh. Integer purus lorem, dictum id ligula nec, lobortis dignissim nisl. Curabitur eget neque blandit, iaculis eros a, tristique dolor. Sed congue ullamcorper augue, in tempus turpis accumsan eget.

                                                        Pellentesque quis volutpat arcu. Pellentesque mollis, lectus sed luctus euismod, velit quam mollis dui, ac consequat augue orci vel nulla. Mauris augue turpis, fringilla quis vehicula at, porttitor a enim. In feugiat dictum semper. Vivamus scelerisque volutpat dui sodales posuere. Donec tincidunt lacinia justo. In pharetra, ante eget volutpat volutpat, velit quam facilisis mauris, fringilla congue ligula nulla in lectus. Proin placerat sapien mattis diam congue cursus. Donec a gravida dui. Nulla ultricies eros turpis, dapibus rutrum ligula rhoncus ultrices. Maecenas vel erat eros. Proin porttitor, metus id lacinia rhoncus, mauris diam scelerisque mi, a rutrum orci elit pretium turpis. Sed vitae nisl fermentum, pretium orci in, malesuada ligula. Phasellus ac iaculis orci. Curabitur efficitur malesuada risus, a tincidunt tellus interdum at.

                                                        Nam gravida id diam quis bibendum. Etiam enim ligula, porta at rutrum suscipit, molestie sit amet mi. Nullam quis iaculis enim. Nunc id eleifend libero. Donec elementum ligula odio, quis viverra purus lacinia nec. Nam eu dapibus metus. Vestibulum sed ipsum non mauris suscipit volutpat. Ut varius ligula sed enim elementum imperdiet. Ut id bibendum libero, dignissim laoreet enim. Sed vestibulum luctus laoreet. Nam feugiat lobortis varius. Fusce efficitur ut tortor et laoreet. Maecenas egestas ante elit, in venenatis dui gravida ac. Aliquam felis nulla, fringilla nec blandit quis, lacinia id risus. Curabitur nec neque ut erat pulvinar eleifend. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

                                                        Vestibulum porttitor felis non dapibus blandit. Praesent massa tortor, porttitor et magna et, egestas tristique metus. Donec eget sodales turpis, ut maximus enim. Etiam consequat rhoncus sem. Vestibulum sit amet nisi pharetra, convallis erat at, volutpat nisl. Nulla blandit leo sit amet lorem feugiat efficitur. Cras volutpat diam quam, eu sollicitudin ipsum euismod eu. Maecenas eu turpis a sapien consequat mollis.

                                                        Aliquam neque libero, feugiat eget justo non, lacinia vehicula nisl. Sed a justo neque. Nullam fermentum, libero quis sagittis rutrum, sapien urna dapibus neque, id convallis nunc leo quis ex. Aliquam ac dignissim arcu, in semper lacus. Maecenas congue et nulla ac semper. Curabitur consectetur ligula metus. Aliquam at mollis nisi, sit amet malesuada ante. Donec libero sem, elementum sit amet erat eu, vehicula blandit risus. Aenean eu lectus magna. Nunc et mollis nulla, eget tempor magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id sem at risus accumsan euismod nec facilisis orci. Etiam eu sem et sem varius fringilla. Nulla sollicitudin erat et tortor congue, quis venenatis risus pretium. Nulla tellus sem, elementum ac lorem at, rutrum efficitur enim. Cras tempus metus in tellus pellentesque, quis viverra felis maximus.

                                                        Sed dictum purus et augue ultricies, condimentum porta libero suscipit. Vivamus cursus felis tristique orci mattis, non congue enim cursus. Donec accumsan pharetra mauris, vitae egestas quam aliquet a. Etiam pulvinar scelerisque metus gravida vestibulum. Quisque pulvinar, libero et laoreet tincidunt, nisl orci fermentum nisl, nec gravida nunc velit et leo. Quisque sodales sed nibh vel efficitur. In viverra finibus arcu, eget tempus felis ullamcorper ut.

                                                        Nulla aliquet tortor imperdiet leo pretium, a sodales lorem aliquet. Nunc quis aliquam est. Etiam sollicitudin sapien ut elit dignissim congue. Donec fermentum vulputate est, a tincidunt dui bibendum semper. Nunc elementum venenatis fringilla. Donec tempor tempus risus ac auctor. Donec fermentum semper molestie. Curabitur fermentum, ante in tempus finibus, diam ipsum iaculis eros, ut consectetur ipsum lectus eget justo. Proin eu dapibus dolor. Donec sodales congue nisi a finibus. Phasellus ut varius lorem. Pellentesque scelerisque cursus risus pellentesque ornare. Integer commodo arcu quis velit dignissim, a accumsan elit mollis. Proin malesuada diam at commodo auctor. Curabitur sed aliquet leo.

                                                        Quisque maximus semper risus, eu pellentesque nunc molestie ac. Sed posuere hendrerit metus, sed scelerisque ex lobortis at. Maecenas lacus nulla, consequat ut elit nec, auctor commodo eros. Donec porttitor turpis erat, id placerat enim malesuada id. Ut condimentum finibus enim. Sed convallis ligula quis dolor cursus, sed tristique nulla vulputate. In finibus nibh eu facilisis laoreet. Aliquam vulputate eget lectus in ultrices. Duis vestibulum arcu nunc, ut malesuada elit eleifend et. Nulla fermentum lacinia lacus, a placerat magna aliquam et.

                                                        Praesent sem tortor, iaculis et turpis sit amet, pretium tristique augue. Fusce suscipit ante ligula, at mollis leo finibus eget. Nam viverra porttitor porttitor. Proin et eros consequat, lacinia mauris in, egestas eros. Aenean lacus tortor, condimentum non quam ac, tristique hendrerit dui. Morbi facilisis, nulla et finibus rhoncus, orci leo auctor neque, quis pretium nulla elit sit amet turpis. Aenean ac felis non ex cursus luctus nec ac ipsum. Proin at dui mi. Aliquam tristique ultrices gravida. In hac habitasse platea dictumst. Pellentesque molestie, libero at feugiat tristique, ligula turpis ullamcorper lacus, quis vehicula felis lectus quis ligula. Aenean pellentesque arcu risus, vitae iaculis eros interdum nec. Donec et condimentum tellus. Ut purus lectus, malesuada eu blandit in, semper quis purus. Nunc ut ornare metus.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                                                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>
                                          </div>

                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac magna id dui bibendum lacinia sit amet rutrum massa. Phasellus eu nunc vel mi varius commodo aliquet dictum arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur mattis dui eros, nec varius lacus consectetur ac. Praesent volutpat magna sit amet metus vulputate consequat. Integer cursus congue sapien, in sollicitudin odio gravida quis. Curabitur ultrices accumsan urna, a tempor arcu molestie sit amet. Sed maximus bibendum nisl, sit amet viverra nulla imperdiet vitae. Sed lacus justo, semper venenatis fermentum ac, cursus sit amet odio. Nam semper ipsum et odio consequat interdum.

                                                        Aenean tempor nunc quis purus dapibus interdum. Sed cursus scelerisque libero. Fusce aliquam justo quam, eget egestas lectus viverra non. Nunc accumsan magna vel lobortis consectetur. Ut a metus fringilla, consectetur risus id, gravida ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut ornare tellus quis elit condimentum auctor. Duis lobortis, ipsum id viverra tincidunt, purus nisi ornare ex, non egestas eros nibh eget massa. Donec commodo egestas augue. Nunc rhoncus viverra tortor. Donec condimentum tristique quam id hendrerit. Vivamus non odio vitae nibh dictum bibendum at ac nibh. Integer purus lorem, dictum id ligula nec, lobortis dignissim nisl. Curabitur eget neque blandit, iaculis eros a, tristique dolor. Sed congue ullamcorper augue, in tempus turpis accumsan eget.

                                                        Pellentesque quis volutpat arcu. Pellentesque mollis, lectus sed luctus euismod, velit quam mollis dui, ac consequat augue orci vel nulla. Mauris augue turpis, fringilla quis vehicula at, porttitor a enim. In feugiat dictum semper. Vivamus scelerisque volutpat dui sodales posuere. Donec tincidunt lacinia justo. In pharetra, ante eget volutpat volutpat, velit quam facilisis mauris, fringilla congue ligula nulla in lectus. Proin placerat sapien mattis diam congue cursus. Donec a gravida dui. Nulla ultricies eros turpis, dapibus rutrum ligula rhoncus ultrices. Maecenas vel erat eros. Proin porttitor, metus id lacinia rhoncus, mauris diam scelerisque mi, a rutrum orci elit pretium turpis. Sed vitae nisl fermentum, pretium orci in, malesuada ligula. Phasellus ac iaculis orci. Curabitur efficitur malesuada risus, a tincidunt tellus interdum at.

                                                        Nam gravida id diam quis bibendum. Etiam enim ligula, porta at rutrum suscipit, molestie sit amet mi. Nullam quis iaculis enim. Nunc id eleifend libero. Donec elementum ligula odio, quis viverra purus lacinia nec. Nam eu dapibus metus. Vestibulum sed ipsum non mauris suscipit volutpat. Ut varius ligula sed enim elementum imperdiet. Ut id bibendum libero, dignissim laoreet enim. Sed vestibulum luctus laoreet. Nam feugiat lobortis varius. Fusce efficitur ut tortor et laoreet. Maecenas egestas ante elit, in venenatis dui gravida ac. Aliquam felis nulla, fringilla nec blandit quis, lacinia id risus. Curabitur nec neque ut erat pulvinar eleifend. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

                                                        Vestibulum porttitor felis non dapibus blandit. Praesent massa tortor, porttitor et magna et, egestas tristique metus. Donec eget sodales turpis, ut maximus enim. Etiam consequat rhoncus sem. Vestibulum sit amet nisi pharetra, convallis erat at, volutpat nisl. Nulla blandit leo sit amet lorem feugiat efficitur. Cras volutpat diam quam, eu sollicitudin ipsum euismod eu. Maecenas eu turpis a sapien consequat mollis.

                                                        Aliquam neque libero, feugiat eget justo non, lacinia vehicula nisl. Sed a justo neque. Nullam fermentum, libero quis sagittis rutrum, sapien urna dapibus neque, id convallis nunc leo quis ex. Aliquam ac dignissim arcu, in semper lacus. Maecenas congue et nulla ac semper. Curabitur consectetur ligula metus. Aliquam at mollis nisi, sit amet malesuada ante. Donec libero sem, elementum sit amet erat eu, vehicula blandit risus. Aenean eu lectus magna. Nunc et mollis nulla, eget tempor magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id sem at risus accumsan euismod nec facilisis orci. Etiam eu sem et sem varius fringilla. Nulla sollicitudin erat et tortor congue, quis venenatis risus pretium. Nulla tellus sem, elementum ac lorem at, rutrum efficitur enim. Cras tempus metus in tellus pellentesque, quis viverra felis maximus.

                                                        Sed dictum purus et augue ultricies, condimentum porta libero suscipit. Vivamus cursus felis tristique orci mattis, non congue enim cursus. Donec accumsan pharetra mauris, vitae egestas quam aliquet a. Etiam pulvinar scelerisque metus gravida vestibulum. Quisque pulvinar, libero et laoreet tincidunt, nisl orci fermentum nisl, nec gravida nunc velit et leo. Quisque sodales sed nibh vel efficitur. In viverra finibus arcu, eget tempus felis ullamcorper ut.

                                                        Nulla aliquet tortor imperdiet leo pretium, a sodales lorem aliquet. Nunc quis aliquam est. Etiam sollicitudin sapien ut elit dignissim congue. Donec fermentum vulputate est, a tincidunt dui bibendum semper. Nunc elementum venenatis fringilla. Donec tempor tempus risus ac auctor. Donec fermentum semper molestie. Curabitur fermentum, ante in tempus finibus, diam ipsum iaculis eros, ut consectetur ipsum lectus eget justo. Proin eu dapibus dolor. Donec sodales congue nisi a finibus. Phasellus ut varius lorem. Pellentesque scelerisque cursus risus pellentesque ornare. Integer commodo arcu quis velit dignissim, a accumsan elit mollis. Proin malesuada diam at commodo auctor. Curabitur sed aliquet leo.

                                                        Quisque maximus semper risus, eu pellentesque nunc molestie ac. Sed posuere hendrerit metus, sed scelerisque ex lobortis at. Maecenas lacus nulla, consequat ut elit nec, auctor commodo eros. Donec porttitor turpis erat, id placerat enim malesuada id. Ut condimentum finibus enim. Sed convallis ligula quis dolor cursus, sed tristique nulla vulputate. In finibus nibh eu facilisis laoreet. Aliquam vulputate eget lectus in ultrices. Duis vestibulum arcu nunc, ut malesuada elit eleifend et. Nulla fermentum lacinia lacus, a placerat magna aliquam et.

                                                        Praesent sem tortor, iaculis et turpis sit amet, pretium tristique augue. Fusce suscipit ante ligula, at mollis leo finibus eget. Nam viverra porttitor porttitor. Proin et eros consequat, lacinia mauris in, egestas eros. Aenean lacus tortor, condimentum non quam ac, tristique hendrerit dui. Morbi facilisis, nulla et finibus rhoncus, orci leo auctor neque, quis pretium nulla elit sit amet turpis. Aenean ac felis non ex cursus luctus nec ac ipsum. Proin at dui mi. Aliquam tristique ultrices gravida. In hac habitasse platea dictumst. Pellentesque molestie, libero at feugiat tristique, ligula turpis ullamcorper lacus, quis vehicula felis lectus quis ligula. Aenean pellentesque arcu risus, vitae iaculis eros interdum nec. Donec et condimentum tellus. Ut purus lectus, malesuada eu blandit in, semper quis purus. Nunc ut ornare metus.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                                                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>
                                          </div>

                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac magna id dui bibendum lacinia sit amet rutrum massa. Phasellus eu nunc vel mi varius commodo aliquet dictum arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur mattis dui eros, nec varius lacus consectetur ac. Praesent volutpat magna sit amet metus vulputate consequat. Integer cursus congue sapien, in sollicitudin odio gravida quis. Curabitur ultrices accumsan urna, a tempor arcu molestie sit amet. Sed maximus bibendum nisl, sit amet viverra nulla imperdiet vitae. Sed lacus justo, semper venenatis fermentum ac, cursus sit amet odio. Nam semper ipsum et odio consequat interdum.

                                                        Aenean tempor nunc quis purus dapibus interdum. Sed cursus scelerisque libero. Fusce aliquam justo quam, eget egestas lectus viverra non. Nunc accumsan magna vel lobortis consectetur. Ut a metus fringilla, consectetur risus id, gravida ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut ornare tellus quis elit condimentum auctor. Duis lobortis, ipsum id viverra tincidunt, purus nisi ornare ex, non egestas eros nibh eget massa. Donec commodo egestas augue. Nunc rhoncus viverra tortor. Donec condimentum tristique quam id hendrerit. Vivamus non odio vitae nibh dictum bibendum at ac nibh. Integer purus lorem, dictum id ligula nec, lobortis dignissim nisl. Curabitur eget neque blandit, iaculis eros a, tristique dolor. Sed congue ullamcorper augue, in tempus turpis accumsan eget.

                                                        Pellentesque quis volutpat arcu. Pellentesque mollis, lectus sed luctus euismod, velit quam mollis dui, ac consequat augue orci vel nulla. Mauris augue turpis, fringilla quis vehicula at, porttitor a enim. In feugiat dictum semper. Vivamus scelerisque volutpat dui sodales posuere. Donec tincidunt lacinia justo. In pharetra, ante eget volutpat volutpat, velit quam facilisis mauris, fringilla congue ligula nulla in lectus. Proin placerat sapien mattis diam congue cursus. Donec a gravida dui. Nulla ultricies eros turpis, dapibus rutrum ligula rhoncus ultrices. Maecenas vel erat eros. Proin porttitor, metus id lacinia rhoncus, mauris diam scelerisque mi, a rutrum orci elit pretium turpis. Sed vitae nisl fermentum, pretium orci in, malesuada ligula. Phasellus ac iaculis orci. Curabitur efficitur malesuada risus, a tincidunt tellus interdum at.

                                                        Nam gravida id diam quis bibendum. Etiam enim ligula, porta at rutrum suscipit, molestie sit amet mi. Nullam quis iaculis enim. Nunc id eleifend libero. Donec elementum ligula odio, quis viverra purus lacinia nec. Nam eu dapibus metus. Vestibulum sed ipsum non mauris suscipit volutpat. Ut varius ligula sed enim elementum imperdiet. Ut id bibendum libero, dignissim laoreet enim. Sed vestibulum luctus laoreet. Nam feugiat lobortis varius. Fusce efficitur ut tortor et laoreet. Maecenas egestas ante elit, in venenatis dui gravida ac. Aliquam felis nulla, fringilla nec blandit quis, lacinia id risus. Curabitur nec neque ut erat pulvinar eleifend. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

                                                        Vestibulum porttitor felis non dapibus blandit. Praesent massa tortor, porttitor et magna et, egestas tristique metus. Donec eget sodales turpis, ut maximus enim. Etiam consequat rhoncus sem. Vestibulum sit amet nisi pharetra, convallis erat at, volutpat nisl. Nulla blandit leo sit amet lorem feugiat efficitur. Cras volutpat diam quam, eu sollicitudin ipsum euismod eu. Maecenas eu turpis a sapien consequat mollis.

                                                        Aliquam neque libero, feugiat eget justo non, lacinia vehicula nisl. Sed a justo neque. Nullam fermentum, libero quis sagittis rutrum, sapien urna dapibus neque, id convallis nunc leo quis ex. Aliquam ac dignissim arcu, in semper lacus. Maecenas congue et nulla ac semper. Curabitur consectetur ligula metus. Aliquam at mollis nisi, sit amet malesuada ante. Donec libero sem, elementum sit amet erat eu, vehicula blandit risus. Aenean eu lectus magna. Nunc et mollis nulla, eget tempor magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id sem at risus accumsan euismod nec facilisis orci. Etiam eu sem et sem varius fringilla. Nulla sollicitudin erat et tortor congue, quis venenatis risus pretium. Nulla tellus sem, elementum ac lorem at, rutrum efficitur enim. Cras tempus metus in tellus pellentesque, quis viverra felis maximus.

                                                        Sed dictum purus et augue ultricies, condimentum porta libero suscipit. Vivamus cursus felis tristique orci mattis, non congue enim cursus. Donec accumsan pharetra mauris, vitae egestas quam aliquet a. Etiam pulvinar scelerisque metus gravida vestibulum. Quisque pulvinar, libero et laoreet tincidunt, nisl orci fermentum nisl, nec gravida nunc velit et leo. Quisque sodales sed nibh vel efficitur. In viverra finibus arcu, eget tempus felis ullamcorper ut.

                                                        Nulla aliquet tortor imperdiet leo pretium, a sodales lorem aliquet. Nunc quis aliquam est. Etiam sollicitudin sapien ut elit dignissim congue. Donec fermentum vulputate est, a tincidunt dui bibendum semper. Nunc elementum venenatis fringilla. Donec tempor tempus risus ac auctor. Donec fermentum semper molestie. Curabitur fermentum, ante in tempus finibus, diam ipsum iaculis eros, ut consectetur ipsum lectus eget justo. Proin eu dapibus dolor. Donec sodales congue nisi a finibus. Phasellus ut varius lorem. Pellentesque scelerisque cursus risus pellentesque ornare. Integer commodo arcu quis velit dignissim, a accumsan elit mollis. Proin malesuada diam at commodo auctor. Curabitur sed aliquet leo.

                                                        Quisque maximus semper risus, eu pellentesque nunc molestie ac. Sed posuere hendrerit metus, sed scelerisque ex lobortis at. Maecenas lacus nulla, consequat ut elit nec, auctor commodo eros. Donec porttitor turpis erat, id placerat enim malesuada id. Ut condimentum finibus enim. Sed convallis ligula quis dolor cursus, sed tristique nulla vulputate. In finibus nibh eu facilisis laoreet. Aliquam vulputate eget lectus in ultrices. Duis vestibulum arcu nunc, ut malesuada elit eleifend et. Nulla fermentum lacinia lacus, a placerat magna aliquam et.

                                                        Praesent sem tortor, iaculis et turpis sit amet, pretium tristique augue. Fusce suscipit ante ligula, at mollis leo finibus eget. Nam viverra porttitor porttitor. Proin et eros consequat, lacinia mauris in, egestas eros. Aenean lacus tortor, condimentum non quam ac, tristique hendrerit dui. Morbi facilisis, nulla et finibus rhoncus, orci leo auctor neque, quis pretium nulla elit sit amet turpis. Aenean ac felis non ex cursus luctus nec ac ipsum. Proin at dui mi. Aliquam tristique ultrices gravida. In hac habitasse platea dictumst. Pellentesque molestie, libero at feugiat tristique, ligula turpis ullamcorper lacus, quis vehicula felis lectus quis ligula. Aenean pellentesque arcu risus, vitae iaculis eros interdum nec. Donec et condimentum tellus. Ut purus lectus, malesuada eu blandit in, semper quis purus. Nunc ut ornare metus.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                                                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>
                                          </div>

                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac magna id dui bibendum lacinia sit amet rutrum massa. Phasellus eu nunc vel mi varius commodo aliquet dictum arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur mattis dui eros, nec varius lacus consectetur ac. Praesent volutpat magna sit amet metus vulputate consequat. Integer cursus congue sapien, in sollicitudin odio gravida quis. Curabitur ultrices accumsan urna, a tempor arcu molestie sit amet. Sed maximus bibendum nisl, sit amet viverra nulla imperdiet vitae. Sed lacus justo, semper venenatis fermentum ac, cursus sit amet odio. Nam semper ipsum et odio consequat interdum.

                                                        Aenean tempor nunc quis purus dapibus interdum. Sed cursus scelerisque libero. Fusce aliquam justo quam, eget egestas lectus viverra non. Nunc accumsan magna vel lobortis consectetur. Ut a metus fringilla, consectetur risus id, gravida ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut ornare tellus quis elit condimentum auctor. Duis lobortis, ipsum id viverra tincidunt, purus nisi ornare ex, non egestas eros nibh eget massa. Donec commodo egestas augue. Nunc rhoncus viverra tortor. Donec condimentum tristique quam id hendrerit. Vivamus non odio vitae nibh dictum bibendum at ac nibh. Integer purus lorem, dictum id ligula nec, lobortis dignissim nisl. Curabitur eget neque blandit, iaculis eros a, tristique dolor. Sed congue ullamcorper augue, in tempus turpis accumsan eget.

                                                        Pellentesque quis volutpat arcu. Pellentesque mollis, lectus sed luctus euismod, velit quam mollis dui, ac consequat augue orci vel nulla. Mauris augue turpis, fringilla quis vehicula at, porttitor a enim. In feugiat dictum semper. Vivamus scelerisque volutpat dui sodales posuere. Donec tincidunt lacinia justo. In pharetra, ante eget volutpat volutpat, velit quam facilisis mauris, fringilla congue ligula nulla in lectus. Proin placerat sapien mattis diam congue cursus. Donec a gravida dui. Nulla ultricies eros turpis, dapibus rutrum ligula rhoncus ultrices. Maecenas vel erat eros. Proin porttitor, metus id lacinia rhoncus, mauris diam scelerisque mi, a rutrum orci elit pretium turpis. Sed vitae nisl fermentum, pretium orci in, malesuada ligula. Phasellus ac iaculis orci. Curabitur efficitur malesuada risus, a tincidunt tellus interdum at.

                                                        Nam gravida id diam quis bibendum. Etiam enim ligula, porta at rutrum suscipit, molestie sit amet mi. Nullam quis iaculis enim. Nunc id eleifend libero. Donec elementum ligula odio, quis viverra purus lacinia nec. Nam eu dapibus metus. Vestibulum sed ipsum non mauris suscipit volutpat. Ut varius ligula sed enim elementum imperdiet. Ut id bibendum libero, dignissim laoreet enim. Sed vestibulum luctus laoreet. Nam feugiat lobortis varius. Fusce efficitur ut tortor et laoreet. Maecenas egestas ante elit, in venenatis dui gravida ac. Aliquam felis nulla, fringilla nec blandit quis, lacinia id risus. Curabitur nec neque ut erat pulvinar eleifend. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

                                                        Vestibulum porttitor felis non dapibus blandit. Praesent massa tortor, porttitor et magna et, egestas tristique metus. Donec eget sodales turpis, ut maximus enim. Etiam consequat rhoncus sem. Vestibulum sit amet nisi pharetra, convallis erat at, volutpat nisl. Nulla blandit leo sit amet lorem feugiat efficitur. Cras volutpat diam quam, eu sollicitudin ipsum euismod eu. Maecenas eu turpis a sapien consequat mollis.

                                                        Aliquam neque libero, feugiat eget justo non, lacinia vehicula nisl. Sed a justo neque. Nullam fermentum, libero quis sagittis rutrum, sapien urna dapibus neque, id convallis nunc leo quis ex. Aliquam ac dignissim arcu, in semper lacus. Maecenas congue et nulla ac semper. Curabitur consectetur ligula metus. Aliquam at mollis nisi, sit amet malesuada ante. Donec libero sem, elementum sit amet erat eu, vehicula blandit risus. Aenean eu lectus magna. Nunc et mollis nulla, eget tempor magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id sem at risus accumsan euismod nec facilisis orci. Etiam eu sem et sem varius fringilla. Nulla sollicitudin erat et tortor congue, quis venenatis risus pretium. Nulla tellus sem, elementum ac lorem at, rutrum efficitur enim. Cras tempus metus in tellus pellentesque, quis viverra felis maximus.

                                                        Sed dictum purus et augue ultricies, condimentum porta libero suscipit. Vivamus cursus felis tristique orci mattis, non congue enim cursus. Donec accumsan pharetra mauris, vitae egestas quam aliquet a. Etiam pulvinar scelerisque metus gravida vestibulum. Quisque pulvinar, libero et laoreet tincidunt, nisl orci fermentum nisl, nec gravida nunc velit et leo. Quisque sodales sed nibh vel efficitur. In viverra finibus arcu, eget tempus felis ullamcorper ut.

                                                        Nulla aliquet tortor imperdiet leo pretium, a sodales lorem aliquet. Nunc quis aliquam est. Etiam sollicitudin sapien ut elit dignissim congue. Donec fermentum vulputate est, a tincidunt dui bibendum semper. Nunc elementum venenatis fringilla. Donec tempor tempus risus ac auctor. Donec fermentum semper molestie. Curabitur fermentum, ante in tempus finibus, diam ipsum iaculis eros, ut consectetur ipsum lectus eget justo. Proin eu dapibus dolor. Donec sodales congue nisi a finibus. Phasellus ut varius lorem. Pellentesque scelerisque cursus risus pellentesque ornare. Integer commodo arcu quis velit dignissim, a accumsan elit mollis. Proin malesuada diam at commodo auctor. Curabitur sed aliquet leo.

                                                        Quisque maximus semper risus, eu pellentesque nunc molestie ac. Sed posuere hendrerit metus, sed scelerisque ex lobortis at. Maecenas lacus nulla, consequat ut elit nec, auctor commodo eros. Donec porttitor turpis erat, id placerat enim malesuada id. Ut condimentum finibus enim. Sed convallis ligula quis dolor cursus, sed tristique nulla vulputate. In finibus nibh eu facilisis laoreet. Aliquam vulputate eget lectus in ultrices. Duis vestibulum arcu nunc, ut malesuada elit eleifend et. Nulla fermentum lacinia lacus, a placerat magna aliquam et.

                                                        Praesent sem tortor, iaculis et turpis sit amet, pretium tristique augue. Fusce suscipit ante ligula, at mollis leo finibus eget. Nam viverra porttitor porttitor. Proin et eros consequat, lacinia mauris in, egestas eros. Aenean lacus tortor, condimentum non quam ac, tristique hendrerit dui. Morbi facilisis, nulla et finibus rhoncus, orci leo auctor neque, quis pretium nulla elit sit amet turpis. Aenean ac felis non ex cursus luctus nec ac ipsum. Proin at dui mi. Aliquam tristique ultrices gravida. In hac habitasse platea dictumst. Pellentesque molestie, libero at feugiat tristique, ligula turpis ullamcorper lacus, quis vehicula felis lectus quis ligula. Aenean pellentesque arcu risus, vitae iaculis eros interdum nec. Donec et condimentum tellus. Ut purus lectus, malesuada eu blandit in, semper quis purus. Nunc ut ornare metus.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                                                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</span>
                                          </div>
                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>
                                          </div>

                                          <div className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac magna id dui bibendum lacinia sit amet rutrum massa. Phasellus eu nunc vel mi varius commodo aliquet dictum arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur mattis dui eros, nec varius lacus consectetur ac. Praesent volutpat magna sit amet metus vulputate consequat. Integer cursus congue sapien, in sollicitudin odio gravida quis. Curabitur ultrices accumsan urna, a tempor arcu molestie sit amet. Sed maximus bibendum nisl, sit amet viverra nulla imperdiet vitae. Sed lacus justo, semper venenatis fermentum ac, cursus sit amet odio. Nam semper ipsum et odio consequat interdum.

                                                        Aenean tempor nunc quis purus dapibus interdum. Sed cursus scelerisque libero. Fusce aliquam justo quam, eget egestas lectus viverra non. Nunc accumsan magna vel lobortis consectetur. Ut a metus fringilla, consectetur risus id, gravida ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut ornare tellus quis elit condimentum auctor. Duis lobortis, ipsum id viverra tincidunt, purus nisi ornare ex, non egestas eros nibh eget massa. Donec commodo egestas augue. Nunc rhoncus viverra tortor. Donec condimentum tristique quam id hendrerit. Vivamus non odio vitae nibh dictum bibendum at ac nibh. Integer purus lorem, dictum id ligula nec, lobortis dignissim nisl. Curabitur eget neque blandit, iaculis eros a, tristique dolor. Sed congue ullamcorper augue, in tempus turpis accumsan eget.

                                                        Pellentesque quis volutpat arcu. Pellentesque mollis, lectus sed luctus euismod, velit quam mollis dui, ac consequat augue orci vel nulla. Mauris augue turpis, fringilla quis vehicula at, porttitor a enim. In feugiat dictum semper. Vivamus scelerisque volutpat dui sodales posuere. Donec tincidunt lacinia justo. In pharetra, ante eget volutpat volutpat, velit quam facilisis mauris, fringilla congue ligula nulla in lectus. Proin placerat sapien mattis diam congue cursus. Donec a gravida dui. Nulla ultricies eros turpis, dapibus rutrum ligula rhoncus ultrices. Maecenas vel erat eros. Proin porttitor, metus id lacinia rhoncus, mauris diam scelerisque mi, a rutrum orci elit pretium turpis. Sed vitae nisl fermentum, pretium orci in, malesuada ligula. Phasellus ac iaculis orci. Curabitur efficitur malesuada risus, a tincidunt tellus interdum at.

                                                        Nam gravida id diam quis bibendum. Etiam enim ligula, porta at rutrum suscipit, molestie sit amet mi. Nullam quis iaculis enim. Nunc id eleifend libero. Donec elementum ligula odio, quis viverra purus lacinia nec. Nam eu dapibus metus. Vestibulum sed ipsum non mauris suscipit volutpat. Ut varius ligula sed enim elementum imperdiet. Ut id bibendum libero, dignissim laoreet enim. Sed vestibulum luctus laoreet. Nam feugiat lobortis varius. Fusce efficitur ut tortor et laoreet. Maecenas egestas ante elit, in venenatis dui gravida ac. Aliquam felis nulla, fringilla nec blandit quis, lacinia id risus. Curabitur nec neque ut erat pulvinar eleifend. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

                                                        Vestibulum porttitor felis non dapibus blandit. Praesent massa tortor, porttitor et magna et, egestas tristique metus. Donec eget sodales turpis, ut maximus enim. Etiam consequat rhoncus sem. Vestibulum sit amet nisi pharetra, convallis erat at, volutpat nisl. Nulla blandit leo sit amet lorem feugiat efficitur. Cras volutpat diam quam, eu sollicitudin ipsum euismod eu. Maecenas eu turpis a sapien consequat mollis.

                                                        Aliquam neque libero, feugiat eget justo non, lacinia vehicula nisl. Sed a justo neque. Nullam fermentum, libero quis sagittis rutrum, sapien urna dapibus neque, id convallis nunc leo quis ex. Aliquam ac dignissim arcu, in semper lacus. Maecenas congue et nulla ac semper. Curabitur consectetur ligula metus. Aliquam at mollis nisi, sit amet malesuada ante. Donec libero sem, elementum sit amet erat eu, vehicula blandit risus. Aenean eu lectus magna. Nunc et mollis nulla, eget tempor magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id sem at risus accumsan euismod nec facilisis orci. Etiam eu sem et sem varius fringilla. Nulla sollicitudin erat et tortor congue, quis venenatis risus pretium. Nulla tellus sem, elementum ac lorem at, rutrum efficitur enim. Cras tempus metus in tellus pellentesque, quis viverra felis maximus.

                                                        Sed dictum purus et augue ultricies, condimentum porta libero suscipit. Vivamus cursus felis tristique orci mattis, non congue enim cursus. Donec accumsan pharetra mauris, vitae egestas quam aliquet a. Etiam pulvinar scelerisque metus gravida vestibulum. Quisque pulvinar, libero et laoreet tincidunt, nisl orci fermentum nisl, nec gravida nunc velit et leo. Quisque sodales sed nibh vel efficitur. In viverra finibus arcu, eget tempus felis ullamcorper ut.

                                                        Nulla aliquet tortor imperdiet leo pretium, a sodales lorem aliquet. Nunc quis aliquam est. Etiam sollicitudin sapien ut elit dignissim congue. Donec fermentum vulputate est, a tincidunt dui bibendum semper. Nunc elementum venenatis fringilla. Donec tempor tempus risus ac auctor. Donec fermentum semper molestie. Curabitur fermentum, ante in tempus finibus, diam ipsum iaculis eros, ut consectetur ipsum lectus eget justo. Proin eu dapibus dolor. Donec sodales congue nisi a finibus. Phasellus ut varius lorem. Pellentesque scelerisque cursus risus pellentesque ornare. Integer commodo arcu quis velit dignissim, a accumsan elit mollis. Proin malesuada diam at commodo auctor. Curabitur sed aliquet leo.

                                                        Quisque maximus semper risus, eu pellentesque nunc molestie ac. Sed posuere hendrerit metus, sed scelerisque ex lobortis at. Maecenas lacus nulla, consequat ut elit nec, auctor commodo eros. Donec porttitor turpis erat, id placerat enim malesuada id. Ut condimentum finibus enim. Sed convallis ligula quis dolor cursus, sed tristique nulla vulputate. In finibus nibh eu facilisis laoreet. Aliquam vulputate eget lectus in ultrices. Duis vestibulum arcu nunc, ut malesuada elit eleifend et. Nulla fermentum lacinia lacus, a placerat magna aliquam et.

                                                        Praesent sem tortor, iaculis et turpis sit amet, pretium tristique augue. Fusce suscipit ante ligula, at mollis leo finibus eget. Nam viverra porttitor porttitor. Proin et eros consequat, lacinia mauris in, egestas eros. Aenean lacus tortor, condimentum non quam ac, tristique hendrerit dui. Morbi facilisis, nulla et finibus rhoncus, orci leo auctor neque, quis pretium nulla elit sit amet turpis. Aenean ac felis non ex cursus luctus nec ac ipsum. Proin at dui mi. Aliquam tristique ultrices gravida. In hac habitasse platea dictumst. Pellentesque molestie, libero at feugiat tristique, ligula turpis ullamcorper lacus, quis vehicula felis lectus quis ligula. Aenean pellentesque arcu risus, vitae iaculis eros interdum nec. Donec et condimentum tellus. Ut purus lectus, malesuada eu blandit in, semper quis purus. Nunc ut ornare metus.</span>
                                          </div>




                                   </div>
                                   <div className="mt-5 flex flex-row items-center space-x-3">
                                          <Textarea
                                                 placeholder="Enter your message"
                                                 className=""
                                                 variant="bordered"
                                                 color="secondary"
                                                 minRows={1}
                                          />
                                          <Button type="submit">Send</Button>
                                   </div>
                            </div>
                            <div className="w-1/4 bg-zinc-800 rounded-lg p-5 h-5/6">zz</div>
                     </div>
                     :
                     <h1>Not authorized</h1>);
};

export default ChatWithSocket;