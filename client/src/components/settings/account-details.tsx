"use client";

import type { CardProps } from "@nextui-org/react";
import { ref as firebaseRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import React, { useRef, useEffect, useState, ChangeEvent } from "react";
import { updateProfile, updateCurrentUser, reload } from "firebase/auth";

import {
       Card,
       CardHeader,
       CardBody,
       Button,
       Avatar,
       Badge,
       Input,
       Autocomplete,
       AutocompleteItem,
       CardFooter,
       useDisclosure,
       Tooltip
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import countries from "../countries";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/firebase/config";

type UserProfile = {
       username: string;
       selectedCountry: string;
       profilePicture: File | null;
};

export default function Component(props: CardProps) {
       const [isAdmin, setIsAdmin] = useState(false);
       const [currentUser, setCurrentUser] = useState<User | null>(null);
       const fileInputRef = useRef<HTMLInputElement>(null);
       const [previewUrl, setPreviewUrl] = useState<string | null>(null);

       const [profile, setProfile] = useState<UserProfile>({
              username: '',
              selectedCountry: '',
              profilePicture: null,
       });
       const [initialProfile, setInitialProfile] = useState<UserProfile>({
              username: '',
              selectedCountry: '',
              profilePicture: null,
       });

       useEffect(() => {
              const unsubscribe = onAuthStateChanged(auth, (user) => {
                     if (user) {
                            console.log(user)
                            setCurrentUser(user);

                            user.getIdTokenResult()
                                   .then((idTokenResult) => {
                                          const claims = idTokenResult.claims;
                                          setIsAdmin(!!claims.admin);
                                   })
                                   .catch((error) => {
                                          setIsAdmin(false);
                                   });
                     } else {
                            setCurrentUser(null);
                            setIsAdmin(false);
                     }
              });
              return () => {
                     unsubscribe();
                     if (previewUrl) URL.revokeObjectURL(previewUrl);
              };
       }, [previewUrl]);

       const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
              setProfile({ ...profile, username: e.target.value });
       };

       const handleCountryChange = (countryCode: string) => {
              setProfile({ ...profile, selectedCountry: countryCode });
       };

       const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file) {
                     const url = URL.createObjectURL(file);
                     setPreviewUrl(url);
                     setProfile({ ...profile, profilePicture: file });
              } else {
                     setPreviewUrl(null);
              }
       };

       const saveChanges = async () => {
              if (!currentUser || !hasChanges()) return;


              if (profile.profilePicture) {
                     try {
                            const storageRef = firebaseRef(storage, `profilePictures/${currentUser.uid}/${profile.profilePicture?.name}`);
                            const snapshot = await uploadBytes(storageRef, profile.profilePicture);
                            const photoURL = await getDownloadURL(snapshot.ref);

                            await updateProfile(currentUser, {
                                   photoURL: photoURL
                            }).then(() => {
                                   setCurrentUser({ ...currentUser, photoURL: photoURL });
                                   setPreviewUrl(null);
                            }).catch((error) => {
                                   console.error("Error updating user profile:", error);
                            });
                            updateCurrentUser(auth, currentUser);
                            setInitialProfile({ ...profile });
                     } catch (error) {
                            console.error("Upload failed", error);
                     }
              }
       };

       const hasChanges = () => {
              return profile.username !== initialProfile.username ||
                     profile.selectedCountry !== initialProfile.selectedCountry ||
                     profile.profilePicture !== initialProfile.profilePicture;
       };

       const triggerFileInput = () => {
              fileInputRef.current?.click(); // Programmatically click the invisible file input
       };
       return (
              <Card className="max-w-xl p-2" {...props}>
                     <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
                            <p className="text-large">Account Details</p>
                            <div className="flex gap-4 py-4">
                                   <input
                                          type="file"
                                          ref={fileInputRef}
                                          onChange={handleFileChange}
                                          style={{ display: 'none' }} // Hide the file input
                                   />

                                   <Badge
                                          disableOutline
                                          classNames={{
                                                 badge: "w-6 h-6",
                                          }}
                                          color="danger"
                                          content={
                                                 // upload photo button
                                                 <Tooltip content="Remove Photo" placement="right" showArrow color="danger" size="md">
                                                 <Button
                                                        isIconOnly
                                                        className="p-0 text-primary-foreground"
                                                        radius="full"
                                                        size="lg"
                                                        variant="light"
                                                 >
                                                        <Icon icon="solar:trash-bin-minimalistic-bold" />
                                                 </Button>
                                                 </Tooltip>
                                          }
                                          placement="bottom-right"
                                          shape="circle"
                                   >
                                          <div className="relative group cursor-pointer ">
                                                 <Avatar
                                                        className="h-16 w-16 transition duration-300 ease-in-out group-hover:opacity-80"
                                                        src={previewUrl || currentUser?.photoURL || ""}
                                                 />
                                                 <div onClick={triggerFileInput} className="rounded-full absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                                                        <Icon icon="ic:baseline-photo-camera" className="text-white h-6 w-6" />
                                                        <p className="text-xs text-white hidden sm:block">Change</p>
                                                 </div>
                                          </div>
                                   </Badge>

                                   <div className="flex flex-col items-start justify-center">
                                          <p className="font-medium">{currentUser?.displayName || currentUser?.email}</p>
                                          <span className="text-small text-default-500">{isAdmin ? "Admin" : ""}</span>
                                   </div>
                            </div>
                            <p className="text-small text-default-400">
                                   The photo will be used for your profile, and will be visible to other users of the
                                   platform.
                            </p>
                     </CardHeader>
                     <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Username */}
                            <Input
                                   value={profile.username}
                                   onChange={handleUsernameChange}
                                   label="Username"
                                   labelPlacement="outside"
                                   placeholder="Enter username"
                            />                            {/* Email */}
                            <Input label="Email" labelPlacement="outside" isDisabled />
                            {/* Country */}
                            <Autocomplete
                                   defaultItems={countries}
                                   label="Country"
                                   labelPlacement="outside"
                                   placeholder="Select country"
                                   showScrollIndicators={false}
                            >
                                   {(item) => (
                                          <AutocompleteItem
                                                 key={item.code}
                                                 startContent={
                                                        <Avatar
                                                               alt="Country Flag"
                                                               className="h-6 w-6"
                                                               src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                                                        />
                                                 }
                                                 value={item.code}
                                          >
                                                 {item.name}
                                          </AutocompleteItem>
                                   )}
                            </Autocomplete>
                     </CardBody>

                     <CardFooter className="mt-4 justify-end gap-2">
                            <Button radius="full" variant="bordered">
                                   Cancel
                            </Button>
                            <Button
                                   disabled={!hasChanges()} // Disable if there are no changes

                                   color="primary"
                                   radius="full"
                                   onClick={saveChanges}
                            >
                                   Save Changes
                            </Button>                     </CardFooter>
              </Card>
       );
}
