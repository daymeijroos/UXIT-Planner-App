import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import Link from "next/link";
import { useRouter } from "next/router";

const Navigation = () => {
  return (
    <NavigationBar/>
  );
};

const NavigationButton = ({ day, linkTo, selected }) => {
  const { buttonProps, isPressed } = useButton({
    onPress: () => console.log(day),
  });
  const { isFocusVisible, focusProps } = useFocusRing();

  const isCurrentDay = linkTo === selected;

  return (
    <Link href={linkTo}>
      <div
        className={`${
          isPressed ? "bg-blue-400" : "bg-white"
        } text-black rounded-full h-12 w-12 flex flex-col items-center justify-center focus:outline-none focus:ring-4 ${
          isFocusVisible ? "ring-blue-300" : ""
        } ${
          isCurrentDay
            ? "bg-dark-teal"
            : isPressed
              ? "bg-dark-teal"
              : "bg-white text-gray-700"
        }`}
        {...buttonProps}
        {...focusProps}
      >
        <span className="sr-only">{day}</span>
        <span className="text-lg font-bold">{day.slice(0, 2)}</span>
        <span className="text-sm">{new Date(day).getDate()}</span>
      </div>
    </Link>
  );
};

const NavigationBar = () => {
  const router = useRouter();
  const selected = router.pathname;

  return (
    <nav className="bg-white py-2 px-4 rounded-lg flex space-x-2 justify-center">
      <NavigationButton day="Dinsdag 2023-04-18" linkTo="/rooster/dinsdag" selected={selected} />
      <NavigationButton day="Woensdag 2023-04-19" linkTo="/rooster/woensdag" selected={selected} />
      <NavigationButton day="Donderdag 2023-04-20" linkTo="/rooster/donderdag" selected={selected} />
      <NavigationButton day="Vrijdag 2023-04-21" linkTo="/rooster/vrijdag" selected={selected} />
      <NavigationButton day="Zaterdag 2023-04-22" linkTo="/rooster/zaterdag" selected={selected} />
      <NavigationButton day="Zondag 2023-04-23" linkTo="/rooster/zondag" selected={selected} />
    </nav>
  );
};

export default Navigation;
