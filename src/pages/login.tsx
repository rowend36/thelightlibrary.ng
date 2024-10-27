import {
  Form,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { loginFn } from "../data/actions/authFn";
import { useEffect, useState } from "react";
import { loginSchema } from "../data/schemas/loginSchema";
import { useAuth } from "../data/services/user_manager";
import InputBase from "../components/base/InputBase";
import { ButtonBase } from "../components/base/ButtonBase";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import { AppLogo } from "../components/AppLogo";
import { ZodError, ZodIssue } from "zod";
import { ValidationError } from "../data/actions/queryFn";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  useEffect(() => {
    if (user) {
      navigate(
        params.get("redirect_url") ?? (user.role === "admin" ? "/admin" : "/"),
        {
          replace: true,
        },
      );
    }
  }, [navigate, user, params]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any>();
  console.log({ error, user, password });
  return (
    <>
      <Navbar />
      <div className="container max-w-md mx-auto py-16 pt-32">
        <div className="flex justify-center pointer-events-none">
          <AppLogo />
        </div>
        <form
          method="POST"
          onSubmit={async (e) => {
            setError(null);
            e.preventDefault();
            try {
              const data = loginSchema.parse({ email, password });
              const { data: user } = await loginFn(data);
              auth.setUser(user);
            } catch (e) {
              if (e instanceof ZodError) setError({ errors: e.errors });
              else if (e instanceof ValidationError) {
                setError(e.cause);
              } else {
                setError(e as Error);
              }
            }
          }}
        >
          <p className="text-sm text-red-700 mt-4 mb-2">
            {error && "error" in error ? error.error : error?.message}
          </p>
          <InputBase
            name="email"
            type="email"
            label="Email"
            error={
              error?.errors?.find(
                (e: ZodIssue) => e.path?.join(".") === "email",
              )?.message
            }
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <InputBase
            name="password"
            type="password"
            label="Password"
            className="mt-8"
            error={
              error?.errors?.find(
                (e: ZodIssue) => e.path?.join(".") === "password",
              )?.message
            }
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <ButtonBase className="mx-auto block mt-8" type="submit">
            Submit
          </ButtonBase>
        </form>
      </div>
      <Footer />
    </>
  );
}
