"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/create-group", {
      method: "POST",
      body: JSON.stringify({ groupName, groupDescription }),
    });
    if (response.ok) {
      router.push("/dashboard");
    } else {
      console.log(response.body);
      console.error("Failed to create group");
    }
  };

  return (
    <div className="min-h-screen w-full h-full flex justify-center items-center ">
      <div className="w-full h-full flex flex-col justify-center items-center gap-8">
        <h2 className="">Create a new Group Chat</h2>
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
        >
          <div className="sm:col-span-4">
            <label
              htmlFor="groupName"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Group Name
            </label>
            <div className="mt-2">
              <div className="flex items-center rounded-md bg-white/5 pl-3 ">
                <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">
                  Group Name
                </div>
                <input
                  id="groupName"
                  name="groupName"
                  type="text"
                  placeholder="Enter Group Name"
                  className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base  sm:text-sm/6 bg-transparent text-white placeholder:text-gray-500"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="groupDescription"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Group Description
            </label>
            <div className="mt-2">
              <textarea
                id="groupDescription"
                name="groupDescription"
                rows={3}
                className="block border w-full px-3 py-1.5 text-base sm:text-sm/6 bg-transparent text-white placeholder:text-gray-500"
                defaultValue={""}
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            </div>
            <p className="mt-3 text-sm/6 text-gray-400">
              Write a few sentences about the group.
            </p>
          </div>
          <button type="submit" className="mt-10 cursor-pointer">
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}
