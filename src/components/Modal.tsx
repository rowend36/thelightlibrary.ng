import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CloseCircle } from "iconsax-react";
import { ButtonBase } from "./base/ButtonBase";

export default function Modal({
  open,
  onClose: setOpen,
  title = "",
  children,
  alert = false,
  dismissible = false,
}: {
  open: boolean;
  alert?: boolean;
  onClose: (open: boolean) => void;
  title?: string;
  dismissible?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (dismissible) {
          setOpen(false);
        }
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div
        className={`z-50 fixed inset-0 flex justify-center ${
          alert ? "items-center" : "items-end sm:items-center"
        }`}
      >
        <DialogPanel
          transition
          className={`max-h-[90%] flex flex-col rounded-2xl relative  ${
            alert ? "w-72" : "w-full sm:w-96 md:w-1/2 max-w-lg"
          } bg-white p-4 sm:p-12 duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-50 shadow-xl border`}
        >
          {alert ? null : (
            <ButtonBase
              className="self-end absolute top-4 right-4 p-2 text-darkBlue hover:bg-primaryLight hover:text-primary rounded-full"
              onClick={() => setOpen(false)}
              size="icon"
              variant="transparent"
            >
              <CloseCircle />
            </ButtonBase>
          )}
          {title ? (
            <DialogTitle className="font-bold text-lg text-text">
              {title}
            </DialogTitle>
          ) : null}
          <div
            className={
              alert
                ? "flex flex-col justify-center min-h-52"
                : "flex-grow overflow-auto pt-4 -mr-4 -ml-1 pl-1 pr-4"
            }
          >
            {children}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
