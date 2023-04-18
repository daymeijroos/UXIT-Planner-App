import Header from "../components/aria/header";
import { DateSwitcher } from "../components/aria/navigation";
import Schedule from "../components/aria/schedule";

const index = () => {

  return (
    <div>
      <DateSwitcher />
      <Schedule />
      <Header />
    </div>
  );
};

export default index;
