import { createFileRoute } from '@tanstack/react-router'
import { getJokes } from '../serverActions/jokesActions'
import { JokesList } from '../components/JokeList'


export const Route = createFileRoute('/')({
  loader: async () => {
    return getJokes()
  },
  component: App,
})

function App() {
  const jokes = Route.useLoaderData() || []

  return (
    <div className="p-4 flex flex-col">
      <h1 className="text-2xl">DevJokes</h1>
      <JokesList jokes={jokes} />
    </div>
  )
}