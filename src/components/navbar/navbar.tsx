import React from "react";
import AuthButton from "../buttons/authButton";
import { routes } from "./routes";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-20">
      <div className="px-8 h-full mx-auto flex flex-row justify-between items-center">
        <div className="font-bitcount text-4xl font-medium">Hirelin</div>
        <div className="flex flex-row justify-center items-center gap-4">
          <div>
            {routes.map((route) => {
              return <Link href={route.link}>{route.name}</Link>;
            })}
          </div>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
