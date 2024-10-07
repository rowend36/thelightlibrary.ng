import { useQuery } from "@tanstack/react-query";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useResolvedPath,
  useSearchParams,
} from "react-router-dom";
import BookItem from "../components/books/BookItem";
import Footer from "../components/home/Footer";
import Navbar from "../components/home/Navbar";
import { mapResponseToPuchase } from "../data/actions/mappers";
import { authQueryFn, fetcher } from "../data/actions/queryFn";
import { formatNaira } from "../utils/formatNumber";
import { ButtonBase } from "../components/base/ButtonBase";
import { ArrowLeft } from "iconsax-react";
import InputBase from "../components/base/InputBase";
import { useEffect, useState } from "react";
import { useAuth } from "../data/services/user_manager";
import Link from "../components/base/Link";
import CartItem from "../components/cart/CartItem";

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const { data: purchase } = useQuery({
    queryKey: ["cart", "/checkout", "/" + params.get("reference")],
    queryFn: authQueryFn,
    select: mapResponseToPuchase,
  });
  const navigate = useNavigate();
  const user = useAuth().user;
  const [email, setEmail] = useState<string>();
  const pathname = useLocation().pathname;

  useEffect(() => {
    if (user) setEmail(user.email);
  }, [user]);
  useEffect(() => {
    console.log(purchase);
  }, [purchase]);
  const [error, setError] = useState<string>();
  return (
    <>
      <Navbar />
      <div className="h-24 bg-black max-md:h-36 max-sm:h-24" />
      <div className="container  pt-12">
        <button
          className="text-primary -left-4 relative hover:bg-primary/10 active:bg-primary/20 rounded-full p-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={32} />
        </button>
      </div>
      <div className="container pb-8 bg-gray-50">
        {!purchase ? (
          <div className="text-lg text-center my-16">
            <div className="mx-auto mb-4 border-4 border-b-transparent border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
            <span className="text-sm text-gray-700">
              Loading. Please wait ...
            </span>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row-reverse">
            <div className="bg-primaryDark text-white rounded-md pt-8 px-4 md:px-8 xl:px-16 relative pb-8 flex-grow basis-48">
              <table className="mb-24">
                <thead>
                  <tr>
                    <th className="text-primaryHover text-start text-xs">
                      Item
                    </th>
                    <th className="text-primaryHover text-start text-xs">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-lg w-full">
                      Total Cost of Books ({purchase.cart?.books.length})
                    </td>
                    <td className="text-xl">
                      {formatNaira(purchase?.purchase_price)}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-lg w-full">VAT</td>
                    <td className="text-xl">{formatNaira(0)}</td>
                  </tr>

                  <tr className="h-24"></tr>
                  <tr>
                    <td className="text-lg w-full">Sum Total</td>
                    <td className="text-xl border-t">
                      {formatNaira(purchase?.purchase_price)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <InputBase
                label="Email Address"
                value={email}
                disabled={!!user}
                onChange={(e) => setEmail(e.target.value)}
                description={
                  user ? null : (
                    <>
                      Provide your email address so we can send you a copy of
                      the download link for safe-keeping. We will <b>NEVER</b>{" "}
                      send you spam.
                    </>
                  )
                }
              />
              {user ? null : (
                <>
                  <div className="flex items-center my-4">
                    <div className="border-t-white border-t mx-2 flex-grow" />
                    <span>OR</span>
                    <div className="border-t-white border-t mx-2 flex-grow" />
                  </div>
                  <ButtonBase
                    className="w-full block text-center"
                    as={Link}
                    href={"/login?redirect_url=" + encodeURIComponent(pathname)}
                  >
                    Log In
                  </ButtonBase>
                </>
              )}
              <ButtonBase
                className="bg-green-600 w-full mt-8"
                disabled={!email}
                onClick={async () => {
                  const { paymentURL } = await fetcher(
                    "cart/checkout/" + purchase.reference + "/pay",
                    {
                      data: {
                        email,
                      },
                    }
                  );
                  open(paymentURL);
                }}
              >
                Make Payment of {formatNaira(purchase?.purchase_price)}
              </ButtonBase>
            </div>
            <div className="pb-8 pt-4 flex-grow container pl-0 basis-96">
              <h3 className="text-2xl font-bold text-darkBlue pb-4">
                Cart Items
              </h3>
              {purchase.cart!.books.map((book) => (
                <CartItem book={book} key={book.book_id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="pb-12" />
      <Footer />
    </>
  );
}
