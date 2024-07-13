"use client";
import { loginAction } from "@/actions/login";
import { signupAction } from "@/actions/signup";
import { ButtonBase } from "@/components/base/ButtonBase";
import InputBase from "@/components/base/InputBase";
import Link from "@/components/base/Link";
import { useFormStatus, useFormState } from "react-dom";
import { ArrowLeft2 } from "iconsax-react";

export default function LoginModalPage(props: { isSignUp: boolean }) {
  const [state, formAction] = useFormState(
    props.isSignUp ? signupAction : loginAction,
    void null
  );
  return (
    <form className="w-full" action={formAction}>
      <h1 className="text-2xl font-bold text-darkBlue pb-4">
        {props.isSignUp ? "Sign Up" : "Login"}
      </h1>
      <Link href="/" className="absolute top-4 left-4 inline-flex items-center">
        <ArrowLeft2 size={20} className="mr-2" /> Return to Home
      </Link>

      <InputBase
        placeholder="Email"
        name="email"
        type="email"
        className="mb-4"
      />
      {props.isSignUp && (
        <InputBase
          placeholder="Username"
          name="username"
          autoComplete="given-name"
          type="text"
          className="mb-4"
        />
      )}
      <InputBase
        type="password"
        autoComplete={props.isSignUp ? "new-password" : "current-password"}
        name="password"
        placeholder="Password"
        className="mb-4"
      />
      {props.isSignUp && (
        <InputBase
          type="password"
          autoComplete="new-password"
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
