import Head from "next/head"
import { NavigationBar } from "../components/elements/navigation-bar"
import { Overview } from "../components/elements/schedule/overview"

const Index = () => {
  return (
    <>
      <Head>
        <title>Home | Pulchri Planner</title>
      </Head>
      <Overview />
      <NavigationBar />
    </>
  )
}

export default Index
