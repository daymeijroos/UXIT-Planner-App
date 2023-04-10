import { api } from "../../utils/api";
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function TrpcExample() {
  const [parent] = useAutoAnimate({
    
  })

  const example = api.example.posts.useQuery();

  if (example.isLoading) {
    return <div>loading...</div>;
  }

  if (example.error) {
    return <div>{example.error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4"
      ref={parent}>
      {example.data?.map((post) => (
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full" key={post.id}>
          <div className="px-4 py-2">
            <h1 className="text-gray-900 font-bold text-2xl">{post.title} <i className="text-gray-300">- {post.userName ?? "Anonymous"}</i></h1>
            <p className="mt-1 text-gray-600 text-sm">{post.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}