import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";

const WoensdagPage = () => {
  const router = useRouter();

  return (
    <div>
      <Navigation/>
      <p>Rooster van woensdag</p>
    </div>
  );
};

export default WoensdagPage;
