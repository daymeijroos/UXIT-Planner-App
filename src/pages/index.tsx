import Head from "next/head"
import { NavigationBar, Overview } from "../components"

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
