import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";

const ZaterdagPage = () => {
  const router = useRouter();

  return (
    <div>
      <Navigation/>
      <p>Rooster van zaterdag</p>
    </div>
  );
};

export default ZaterdagPage;
