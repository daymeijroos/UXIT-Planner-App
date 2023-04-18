import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";
import Schedule from "../../components/aria/schedule";
import Header from "../../components/aria/header";

const ZondagPage = () => {
  const router = useRouter();

  return (
    <div>
      <Navigation/>
      <Schedule />
      <Header />
    </div>
  );
};

export default ZondagPage;
