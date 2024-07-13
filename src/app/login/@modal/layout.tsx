import { AppLogo } from "@/components/AppLogo";
import Image from "next/image";
import illustrationIntro2 from "@/assets/images/library.jpg";

export default function LoginModalLayout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] z-10 relative bg-black container px-0 flex shadow-lg rounded-l-2xl rounded-r-[48px]">
      <Image
        priority
        src={illustrationIntro2}
        className="opacity-40 object-cover max-md:hidden md:max-lg:w-2/5 lg:w-1/2 md:rounded-l-2xl"
        alt=""
      />
      <div className="flex-col flex justify-center items-center relative z-10 bg-white flex-grow container lg:px-12 py-4 md:rounded-l-none sm:rounded-2xl">
        <AppLogo className="text-sm mb-4 pt-0" href="#" disabled />

        {props.children}
      </div>
    </div>
  );
}
