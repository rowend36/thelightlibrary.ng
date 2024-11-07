import { useAuth } from "../../data/services/user_manager";
import AvatarImage from "../AvatarImage";

export default function Avatar() {
  const user = useAuth().user;
  return user ? (
    <>
      <div className="mr-2 text-end max-sm:hidden">
        <div>{user.username}</div>
        <div className="text-sm">{user.email}</div>
      </div>
      <AvatarImage user={user} />
    </>
  ) : null;
}
