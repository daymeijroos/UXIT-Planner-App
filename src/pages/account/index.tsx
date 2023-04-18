
import { useRouter } from "next/router";
import Navigation from "../../components/aria/date-switcher";
import Header from "../../components/aria/navigation-bar";

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
