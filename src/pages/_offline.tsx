export default function Offline() {
  //create a you are offline screen styled with TailwindCSS
  return (
    <div className="flex flex-col lg:flex-row justify-around min-h-screen bg-amber-200 items-center">
      <div className="flex flex-col gap-2 w-72">
        <h1 className="text-6xl font-bold text-blue-800">
          You are offline
        </h1>
      </div>
    </div>
  )
}