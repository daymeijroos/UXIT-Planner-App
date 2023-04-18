import { Button } from "../components/aria/button";
import { Card } from "../components/aria/card";
import Navigation from "../components/aria/navigation";
import { StaffingCard } from "../components/overview-components/staffing-card";

const Home = () => {
  return (
    <div>
      <Navigation/>
      <Button fillWidth color="error">
        Warn Button
      </Button>
      <Card button buttonText="dissmisss" buttonColor="success">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <p className="text-gray-500">This is a card</p>
      </Card>
      <StaffingCard staffing={{
        //Hier kan een staffing van de staffing endpoint in. Deze zijn compatibel met de staffing type van de staffing card
        id: "1",
        shift_id: "1",
        shift: {
          id: "1",
          start: new Date(),
          end: new Date(new Date().setTime(new Date().getTime() + 10000000)),
          staffings: [
            {
              user: {
                id: "1",
                first_name: "Henk",
              },
              shift_type: {
                id: "1",
                name: "Balie",
                description: "balie shift jawel",
              },
            },
            {
              user: {
                id: "2",
                first_name: "Laura",
              },
              shift_type: {
                id: "2",
                name: "Zaal",
                description: "balie shift jawel",
              },
            },
          ],
        },
        shift_type_id: "1",
        shift_type: {
          id: "1",
          name: "balie",
          description: "test",
        },
        user_id: "2",
      }}/>
    </div>
  );
};

export default Home;
