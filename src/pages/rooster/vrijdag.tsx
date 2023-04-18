import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";
import Header from "../../components/aria/header";
import Schedule from "../../components/aria/schedule";

const VrijdagPage = () => {
  const router = useRouter();

  return (
    <div>
      <Navigation/>
      <Schedule />
      <Header />
    </div>
  );
};

export default VrijdagPage;
