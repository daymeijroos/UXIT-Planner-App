
import { useRouter } from "next/router";
import Navigation from "../../components/aria/navigation";
import Header from "../../components/aria/header";

const account = () => {
  const router = useRouter();

  return (
    <div>
      <p>Account</p>
      <Header />
    </div>
  );
};

export default account;
