import { EventEmitter } from "events";
import { User } from "../models/user";
import { createContext, useContext, useEffect, useState } from "react";
import { APIError, fetcher } from "../actions/queryFn";

type UserEvents = {
  change: [User | null];
};
export class UserManager extends EventEmitter<UserEvents> {
  user: User | null | undefined;

  async sync() {
    try {
      const data = await fetcher("users/me");
      this.setUser(data.data);
    } catch (e) {
      if (
        this.user === undefined ||
        (e instanceof APIError &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e.cause as any).code === "auth/unauthenticated")
      ) {
        console.log({ e });
        this.setUser(null);
      }
    }
  }

  async setUser(user: User | null) {
    this.user = user;
    this.emit("change", user);
  }
}

export const UserContext = createContext<UserManager>(null!);
export const useAuth = () => {
  const user = useContext(UserContext);
  const [, setUpdate] = useState(1);
  useEffect(() => {
    const reset = () => setUpdate((e) => e + (1 % 3));
    user.on("change", reset);
  }, [user]);

  return user;
};
