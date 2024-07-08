"use client";
import { login } from "@/actions/login";
import { ButtonBase } from "@/components/base/ButtonBase";
import InputBase from "@/components/base/InputBase";
import Link from "@/components/base/Link";

export default function LoginPage(props: { isSignUp: boolean }) {
  return (
    <form className="w-full" action={login}>
      <ButtonBase as={Link} href="/" className="absolute top-0 text-red-500">
        Return to Home
      </ButtonBase>
      {props.isSignUp && (
        <InputBase
          placeholder="Username"
          name="username"
          type="text"
          className="mb-4"
        />
      )}
      <InputBase
        placeholder="Email"
        name="email"
        type="email"
        className="mb-4"
      />
      <InputBase
        type="password"
        name="password"
        placeholder="Password"
        className="mb-4"
      />
      {props.isSignUp && (
        <InputBase
          type="confirmpassword"
          name="confirmpassword"
          placeholder="Confirm Password"
          className="mb-4"
        />
      )}
      <button className="my-8 w-full h-12 rounded-2xl bg-primary text-white">
        {props.isSignUp ? "Sign Up" : "Login"}
      </button>
      <div className="text-center">
        {props.isSignUp ? (
          <span>
            Already own an account?<Link href="/login">Log in instead</Link>
          </span>
        ) : (
          <span>
            {"Don't have an account?"}
            <Link href="/signup">Sign Up Now</Link>
          </span>
        )}
      </div>
    </form>
  );
}
