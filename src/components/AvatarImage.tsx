import { User as UserIcon } from "iconsax-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AvatarImage({ user }: { user: any }) {
  return user.photo_url ? (
    <img
      src={user.photo_url}
      alt={user.name}
      width={40}
      height={40}
      className="rounded-full object-cover w-10 h-10"
    />
  ) : (
    <UserIcon
      size={20}
      className="border rounded-full border-text h-8 w-8 p-1"
    />
  );
}
