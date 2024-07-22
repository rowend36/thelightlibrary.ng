import { User } from "@/data/models/user";
import { use } from "react";
import AvatarImage from "../AvatarImage";

export default function Header({ user: userPromise }: { user: Promise<User> }) {
  const user = use(userPromise);
  return (
    <>
      <h1 className="text-lg font-bold text-darkGrayishBlue">
        NYSC ABIA E-LIBRARY DASHBOARD
      </h1>
      <div className="flex-grow" />
      <div className="mr-2 text-end">
        <div>{user.username}</div>
        <div className="text-sm">{user.email}</div>
      </div>
      <AvatarImage user={user} />
    </>
  );
}
