import Wheel from "@/components/Wheel";
import background from "@/assets/background-3.jpg";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="relative w-screen h-screen py-10 overflow-hidden">
      {/* <img
        src={background.src}
        alt="background"
        className="absolute top-0 left-0 z-[-1] object-cover w-full h-full"
      /> */}
      <Wheel />
    </div>
  );
}
