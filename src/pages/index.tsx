// import TrpcExample from '../components/example/trpc.example'
// import AuthExample from '../components/example/auth.example'
// import LoginExample from '../components/example/login.example'
//
// export default function Home() {
//   return (
//     <div className="flex flex-col lg:flex-row justify-around min-h-screen bg-amber-200 items-center">
//       <div className="flex flex-col gap-2 w-72">
//         <h1 className="text-6xl font-bold text-blue-800">
//           Welcome to <a href="https://nextjs.org" className="text-blue-600 underline">Next.js!</a>
//         </h1>
//         <LoginExample/>
//       </div>
//       <div className="flex flex-col gap-2">
//         <TrpcExample/>
//         <AuthExample/>
//       </div>
//     </div>
//   )
// }

import Navigation from "../components/aria/navigation";

const Home = () => {
  return (
    <div>
      <Navigation/>
    </div>
  );
};

export default Home;
