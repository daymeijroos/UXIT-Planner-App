import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import Link from "next/link";

const Navigation = () => {
  return (
    <NavigationBar/>
  );
};

const NavigationButton = ({ day, linkTo }) => {
  const { buttonProps, isPressed } = useButton({
    onPress: () => console.log(day),
  });
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <Link href={linkTo}>
      <div
        className={`${
          isPressed ? "bg-blue-400" : "bg-blue-500"
        } text-white rounded-full h-12 w-12 flex items-center justify-center focus:outline-none focus:ring-4 ${
          isFocusVisible ? "ring-blue-300" : ""
        }`}
        {...buttonProps}
        {...focusProps}
      >
        <span className="sr-only">{day}</span>
        <span>{day.slice(0, 2)}</span>
      </div>
    </Link>
  );
};

const NavigationBar = () => {
  return (
    <nav className="bg-gray-200 py-2 px-4 rounded-lg flex space-x-2 justify-center">
      <NavigationButton day="Dinsdag" linkTo="/rooster/dinsdag" />
      <NavigationButton day="Woensdag" linkTo="/rooster/woensdag" />
      <NavigationButton day="Donderdag" linkTo="/rooster/donderdag" />
      <NavigationButton day="Vrijdag" linkTo="/rooster/vrijdag" />
      <NavigationButton day="Zaterdag" linkTo="/rooster/zaterdag" />
      <NavigationButton day="Zondag" linkTo="/rooster/zondag" />
    </nav>
  );
};

export default Navigation;
