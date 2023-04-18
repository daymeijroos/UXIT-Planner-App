import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";
import Header from "../../components/aria/header";

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
