import { User } from "../../data/models/user";

import AvatarImage from "../AvatarImage";

export default function Header({
  user: userPromise,
  title,
}: {
  user: Promise<User>;
  title: string;
}) {
  const user: any = void userPromise;
  return (
    <div className="container lg:px-8 xl:px-12">
      <h1 className="max-sm:pl-8 max-sm:text-xl text-2xl font-bold text-text sm:mt-4">
        {title}
      </h1>
      <div className="flex-grow" />

      {user ? (
        <>
          <div className="mr-2 text-end">
            <div>{user.username}</div>
            <div className="text-sm">{user.email}</div>
          </div>
          <AvatarImage user={user} />
        </>
      ) : null}
    </div>
  );
}
