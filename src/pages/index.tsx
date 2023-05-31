import Head from "next/head";
import { Overview, NavigationBar } from "../components";

const Index = () => {
  return (
    <>
      <Head>
        <title>Rooster</title>
      </Head>
      <Overview />
      <NavigationBar />
    </>
  )
}

export default Index
