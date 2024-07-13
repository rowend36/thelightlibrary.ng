import { User } from "@/data/models/user";
import Image from "next/image";
import { User as UserIcon } from "iconsax-react";

export default function AvatarImage({ user }: { user: User }) {
  return (user as any).photo_url ? (
    <Image
      src={(user as any).photo_url}
      alt={(user as any).name}
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
