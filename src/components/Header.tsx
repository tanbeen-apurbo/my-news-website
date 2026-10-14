import Image from "next/image";
import { connection } from "next/server";
import NavLinks from "./NavLinks";

export default async function Header() {
  await connection();

  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });

  return (
  <header className="w-full bg-white">
  <div className="mx-auto grid min-h-[100px] w-full max-w-[1536px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 2xl:px-0">
    <div className="col-start-2 flex items-center gap-2.5 justify-self-center">
      <Image
        src="/logo.webp"
        alt=""
        width={50}
        height={50}
        className="h-[50px] w-[50px] rounded-xl object-cover"
      />
      <div>
        <h1 className="whitespace-nowrap font-serif text-[30px] font-bold leading-8 text-[#b60000]">
          Bangla News 24
        </h1>
        <p className="mt-0.5 whitespace-nowrap text-[13px] leading-4 text-[#777]">
          {date}
        </p>
      </div>
    </div>

    <nav aria-label="Account" className="col-start-3 flex items-center justify-self-end gap-4">
      <button className="h-10 whitespace-nowrap text-[14px] text-[#222]">
        সাইন ইন
      </button>
      <button className="h-10 whitespace-nowrap rounded-md bg-[#c90000] px-4 text-[15px] font-medium text-white">
        সাইন আপ
      </button>
    </nav>
  </div>

<NavLinks></NavLinks>

</header>
  );
}