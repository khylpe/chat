"use client"
import JoinRoom from './../components/JoinRoom';
import CreateRoom from './../components/CreateRoom';
import React from 'react';

export default function CreateOrJoin() {
       return (
              <div className="flex flex-row mt-20 justify-center m-20 space-x-10">
                     <JoinRoom />
                     <CreateRoom />
              </div>
       );
}