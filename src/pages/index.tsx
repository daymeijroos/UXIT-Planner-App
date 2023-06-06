import Head from "next/head"
import { NavigationBar, Tabs, TeamStaffingList, PersonalStaffingList } from "../components"
import { Item } from "react-stately"

const Index = () => {
  return (
    <>
      <Head>
        <title>Rooster</title>
      </Head>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <Tabs>
            <Item key="1" title="Team">
              <TeamStaffingList />
            </Item>
            <Item key="2" title="Persoonlijk">
              <PersonalStaffingList />
            </Item>
          </Tabs>
        </div>
      </div>
      <NavigationBar />
    </>
  )
}

export default Index
