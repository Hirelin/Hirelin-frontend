import React from "react";
import Link from "next/link";
import HeroAnimation from "./heroAnimation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section
      className="flex flex-col justify-around w-full h-screen px-8"
      id="hero"
    >
      <div className="w-full flex justify-center items-center py-20 mt-20 gap-10">
        <div className="lg:flex justify-center items-center w-full hidden">
          <HeroAnimation className="aspect-square h-[50vh]" />
        </div>

        <div className="font-bold md:text5xl text-3xl text-left w-full">
          <div className="md:text-8xl text-6xl font-bitcount font-normal bg-gradient-to-br from-orange-500 to-fuchsia-500 bg-clip-text text-transparent">
            Hirelin
          </div>
          <div>
            It's <br /> more than just <br />{" "}
            <span className="md:text-6xl text-4xl">Recruiting</span>
          </div>
          <div className="mt-2">
            <Link href={"/jobs"}>
              <Button className="bg-brand rounded-full font-semibold">
                Get your dream job
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Link href="#get-started" scroll={true}>
          <ChevronDown className="size-10 animate-bounce cursor-pointer" />
        </Link>
      </div>
    </section>
  );
}
