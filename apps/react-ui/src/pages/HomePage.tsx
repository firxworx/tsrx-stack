import { Posts } from '../components/features/blog/Posts'

export function HomePage(): JSX.Element {
  return (
    <>
      <h1 className="text-4xl tracking-tight font-bold mb-8">Home</h1>
      <p className="my-4">The mock blog posts are randomly generated in-memory every time the back-end starts.</p>
      <p className="my-4">The code is extended from the example in the ts-rest repo.</p>
      <h2 className="text-2xl tracking-tight font-semibold py-6 sm:py-8">Blog Posts</h2>
      <Posts />
    </>
  )
}
