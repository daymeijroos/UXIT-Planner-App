import { useRouter } from "next/router";
import Header from "../../components/aria/header";
import Navigation from "../../components/aria/navigation";
import Schedule from "../../components/aria/schedule";

const DonderdagPage = () => {
  const router = useRouter();

  return (
    <div>
      <Navigation/>
      <Schedule />
      <Header />
    </div>
  );
};

export default DonderdagPage;
