import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";

const DinsdagPage = () => {
  const router = useRouter();

  return (
    <div>
      <Navigation/>
      <p>Rooster van dinsdag</p>
    </div>
  );
};

export default DinsdagPage;
