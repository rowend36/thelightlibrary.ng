import Image from "next/image";
import illustrationIntro from "@/assets/images/library2.jpg";
import illustrationIntro2 from "@/assets/images/library.jpg";
import { AppLogo } from "@/components/AppLogo";
import { ButtonBase } from "@/components/base/ButtonBase";
import Link from "@/components/base/Link";

export default function LoginLayout(props: {
  children: any;
  isSignUp?: boolean;
}) {
  return (
    <>
      <style global>{`
            html {
              background: linear-gradient(-45deg, rgba(20, 35, 30), rgba(15, 30, 35));
            }
            body {
              background-color: transparent;
            }
          `}</style>
      <div className="min-h-screen flex justify-center sm:items-center sm:container sm:max-w-none md:py-8">
        <Image
          priority
          src={illustrationIntro}
          className="object-cover min-h-full absolute inset-0 opacity-10"
          alt=""
        />
        <div className="z-10 relative bg-black container px-0 flex shadow-lg rounded-l-2xl rounded-r-[48px]">
          <Image
            priority
            src={illustrationIntro2}
            className="opacity-40 object-cover max-md:hidden md:w-2/5 lg:w-1/2 md:rounded-l-2xl"
            alt=""
          />
          <div className="flex-col flex justify-center items-center relative z-10 bg-white flex-grow container lg:px-12 py-16 md:rounded-l-none sm:rounded-2xl">
            <AppLogo className="text-xl mb-8 pt-0" href="#" disabled />
            <h1 className="text-2xl font-bold text-darkBlue pb-4">
              {props.isSignUp ? "Sign Up" : "Login"}
            </h1>
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}
