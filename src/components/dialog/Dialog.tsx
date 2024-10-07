"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function Popup({
  title,
  open,
  children,
  setOpen,
  actionButton,
}: {
  title?: string;
  open: boolean;
  children: React.ReactNode;
  setOpen: (open: boolean) => void;
  actionButton?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[100]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left flex-1">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900 mb-4"
                  >
                    {title}
                  </DialogTitle>
                  {children}
                </div>
              </div>
              <div className="flex justify-end">{actionButton}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
