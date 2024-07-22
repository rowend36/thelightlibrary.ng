"use client";
import { deleteBookAction, fetchBooks } from "@/actions/book_actions";
import UploadBooksForm from "@/components/admin/books/UploadBooksForm";
import { ButtonBase } from "@/components/base/ButtonBase";
import Modal from "@/components/Modal";
import { Book } from "@/data/models/book";
import { useEffect, useState } from "react";

export default function ManageBooksPage() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [books, setBooks] = useState([] as Book[]);
  const [refreshToken, setRefreshToken] = useState(1);
  const refresh = () => {
    setRefreshToken((e) => {
      return e + 1;
    });
  };
  useEffect(() => {
    fetchBooks(page).then(setBooks);
  }, [page, refreshToken]);
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

      <table className="w-full mt-8">
        <tr className="bg-slate-500 text-white">
          <th className="p-1 border-r border-black">ID</th>
          <th className="p-1 border-r border-black">Title</th>
          <th className="p-1 border-r border-black">Date Uploaded</th>
          <th className="p-1 border-black">Actions</th>
        </tr>
        {books.map((e) => (
          <tr key={e.book_id} className="odd:bg-slate-100">
            <td className="p-1 w-8 border-r border-black">{e.book_id}</td>
            <td className="p-1 pl-4 border-r border-black">{e.title}</td>
            <td className="p-1 pl-4">{e.created_at?.toLocaleString()}</td>
            <td className="w-8 px-4">
              <ButtonBase
                size="small"
                onClick={() => {
                  deleteBookAction(e.book_id);
                  setBooks((books) => {
                    return books.filter((f) => e !== f);
                  });
                  refresh();
                }}
              >
                Delete
              </ButtonBase>
            </td>
          </tr>
        ))}
      </table>
    </>
  );
}
