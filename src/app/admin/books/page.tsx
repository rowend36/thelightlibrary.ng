"use client";
import UploadBooksForm from "@/components/admin/books/UploadBooksForm";
import { ButtonBase } from "@/components/base/ButtonBase";
import Modal from "@/components/Modal";
import { useMemo, useState } from "react";

export default function ManageBooksPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <h1 className="font-bold text-xl text-darkBlue mt-4">Manage Books</h1>
      <div className="flex justify-end">
        <ButtonBase onClick={() => setShowModal(true)}>
          Upload New Book
        </ButtonBase>
      </div>
      <Modal title="Upload New Book" open={showModal} onClose={setShowModal}>
        {showModal ? (
          <UploadBooksForm onSubmit={() => setShowModal(false)} />
        ) : null}
      </Modal>
    </>
  );
}
