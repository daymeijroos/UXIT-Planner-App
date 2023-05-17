import { Card } from "../components/aria/card";
import Image from "next/image";

export default function Offline() {
  //create a you are offline screen styled with TailwindCSS
  return (
    <div className="flex flex-col lg:flex-row justify-around min-h-screen bg-white items-center">
      <div className="flex flex-col gap-2 w-72">
        <Image src="/images/logo.svg" width={200} height={200} alt="logo" />
        <Card className="border-red-orange drop-shadow-md">
          <h1 className="text-2xl font-bold text-red-orange">
            U bent offline, verbind met het internet om verder te gaan.
          </h1>
        </Card>
      </div>
    </div>
  )
}