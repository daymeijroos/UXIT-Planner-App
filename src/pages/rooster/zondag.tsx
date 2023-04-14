import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";

const ZondagPage = () => {
  const router = useRouter();

  return (
    <div>
      <Navigation/>
      <p>Rooster van zondag</p>
    </div>
  );
};

export default ZondagPage;
