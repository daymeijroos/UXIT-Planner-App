import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";

const VrijdagPage = () => {
  const router = useRouter();

  return (
    <div>
      <Navigation/>
      <p>Rooster van vrijdag</p>
    </div>
  );
};

export default VrijdagPage;
