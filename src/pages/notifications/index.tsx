import { useRouter } from "next/router";
import Navigation from "../../components/aria/date-switcher";
import Header from "../../components/aria/navigation-bar";

const notifications = () => {
  const router = useRouter();

  return (
    <div>
      <p>notifications</p>
      <Header />
    </div>
  );
};

export default notifications;
