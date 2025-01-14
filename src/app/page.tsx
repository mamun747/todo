import Header from "@/components/header";
import MainArea from "@/components/mainArea";

export default function Home() {
  return (
    <>
    <section className="bg-gradient-to-tr from-sky-300 via-indigo-300  to-red-300 w-full h-screen flex justify-center items-center">
      <div className="w-full max-w-[70vh] bg-white max-h-[60vh] h-full rounded-xl overflow-y-auto">
        <Header/>
        <MainArea/>
      </div>
    </section>
    </>
  );
}
