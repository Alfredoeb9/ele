import Link from "next/link";

export default function Footer() {
  return (
    <footer className="m-4 dark:bg-gray-800">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 text-white lg:py-8">
        <div className="mflex md:justify-between ">
          {/* <div className=""> */}
          <div>
            <h4 className="mb-6 text-sm">COMPETITIONS</h4>
            <ul className="flex flex-col text-xs">
              <Link href={"/games"}>Games</Link>
              <Link href={"/game/mw3"}>Call of Duty</Link>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm">SUPPORT</h4>
            <ul className="flex flex-col text-xs">
              <Link href={"/tickets"}>Ticket Center</Link>
              <Link href={"#"}>FAQ</Link>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm">CONTACT</h4>
            <ul className="flex flex-col text-xs">
              <Link href={"#"}>Advertisements</Link>
            </ul>
          </div>

          <div>
            <h2 className="font-semibolduppercase mb-6 text-sm dark:text-white">
              Legal
            </h2>
            <ul className=" font-medium dark:text-gray-400">
              <li className="text-xs">
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="hover:underline">
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>
          {/* </div> */}
        </div>

        {/* <div className="text-sm text-white md:flex items-start mt-3 sm:mt-0 dark:text-gray-400 ">
                    <div>
                        <h4 className="text-sm">FOLLOW US</h4>
                        <ul className="flex gap-2 text-xs">
                            <Link href={"/Advertisements"}>Twitter</Link>
                            <Link href={"/Advertisements"}>Instagram</Link>
                        </ul>
                    </div>
                </div> */}

        {/* <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite™</a>. All Rights Reserved.</span> */}
      </div>
    </footer>
  );
}
