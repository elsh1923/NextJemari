"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { FollowButton } from "./FollowButton";

interface UserListItem {
  id: string;
  username: string;
  image: string | null;
  bio: string | null;
  isFollowing?: boolean;
}

interface UserListProps {
  users: UserListItem[];
  currentUserId?: string;
  showFollowButton?: boolean;
}

export function UserList({ users, currentUserId, showFollowButton = true }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
        <User className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">No users found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-[#1A1A1C] dark:bg-[#111113] dark:hover:border-blue-500/50"
        >
          <Link
            href={`/u/${user.username}`}
            className="flex flex-1 items-center space-x-4"
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-slate-200 transition-all duration-300 group-hover:border-blue-500 dark:border-[#1A1A1C]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.username}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-[#1A1A1C]">
                  <User className="h-6 w-6 text-slate-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                @{user.username}
              </h3>
              {user.bio && (
                <p className="text-sm text-slate-600 line-clamp-1 dark:text-slate-400">
                  {user.bio}
                </p>
              )}
            </div>
          </Link>
          {showFollowButton && currentUserId !== user.id && (
            <FollowButton
              userId={user.id}
              initialFollowing={user.isFollowing || false}
              initialFollowerCount={0} // We don't display count here, so 0 is fine
            />
          )}
        </div>
      ))}
    </div>
  );
}
