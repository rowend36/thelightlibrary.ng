import { CloseCircle, Menu } from "iconsax-react";
import { ReactElement, ReactNode, Suspense } from "react";
import { AppLogo } from "../AppLogo";
import Empty from "../Empty";

export default function DashboardLayout({
  main,
  sidebar,
  header = <Empty />,
  footer = <Empty />,
  sidebarLoader = (
    <div className="text-darkGrayishBlue text-center">
      <i>Loading...</i>
    </div>
  ),
  headerLoader = (
    <div className="text-darkGrayishBlue text-center">
      <i>Loading...</i>
    </div>
  ),
  mainLoader = (
    <div className="text-darkGrayishBlue text-center">
      <i>Loading...</i>
    </div>
  ),
}: Partial<
  Record<"sidebarLoader" | "headerLoader" | "mainLoader", ReactNode> &
    Record<"sidebar" | "header" | "main" | "footer", ReactElement>
>) {
  return (
    <div className="flex md:h-screen max-md:min-h-screen bg-gradient-to-tr from-gray-50 to-green-50 min-h-80">
      <input type={"checkbox"} id={"menu-toggle"} className="hidden peer" />
      <label
        htmlFor="menu-toggle"
        className="py-3 px-3 md:hidden fixed top-0 z-30 cursor-pointer peer-checked:translate-x-48 transition-transform peer-checked:invisible"
      >
        <Menu className="w-8 h-8 p-1 text-veryDarkBlue " />
      </label>
      <label
        htmlFor="menu-toggle"
        className="py-3 px-3 md:hidden fixed top-0 z-30 cursor-pointer peer-checked:translate-x-48 transition-transform invisible peer-checked:visible"
      >
        <CloseCircle className="w-8 h-8 p-1 text-veryDarkBlue" />
      </label>
      <div className="flex flex-col w-64 p-4 xl:p-8 pt-2 xl:pt-2 max-md:fixed max-md:bg-white max-md:shadow-lg max-md:hidden max-md:peer-checked:flex max-md:z-10 max-md:h-full">
        <AppLogo className="text-[0.625rem]" />
        <Suspense fallback={sidebarLoader}>{sidebar}</Suspense>
      </div>
      <div className="flex flex-col flex-grow md:pb-4 md:pr-4 xl:pb-8 xl:pr-8">
        <div className="h-14 md:h-16 flex items-center rounded-b-sm max-md:bg-white max-md:fixed max-md:w-full max-md:shadow-md pl-12 pr-4 md:pr-0 md:pl-4">
          <Suspense fallback={headerLoader}>{header}</Suspense>
        </div>
        <div className="flex-grow h-0 bg-[#f3faf5] sm:bg-white md:rounded-[32px] py-8 px-4 xl:px-8 max-md:mt-14 shadow-md shadow-gray-100">
          <div className="overflow-auto max-h-full">
            <Suspense fallback={mainLoader}>{main}</Suspense>
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
}
