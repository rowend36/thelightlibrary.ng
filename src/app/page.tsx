import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features.jsx";
import Testimonial from "@/components/Testimonial";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: todos } = await supabase.from("todos").select();
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      {/* <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <ul>
          {todos?.map((todo: any) => (
            <li key={undefined}>{todo}</li>
          ))}
        </ul>
      </main> */}
      <Testimonial />
      <CallToAction />
      <Footer />
    </>
  );
}
