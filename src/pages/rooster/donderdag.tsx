import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";

const DonderdagPage = () => {
  const router = useRouter();

  return (
    <div>
      <Navigation/>
      <p>Rooster van donderdag</p>
    </div>
  );
};

export default DonderdagPage;
