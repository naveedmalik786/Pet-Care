import SectionHeading from "../components/SectionHeading";
import Offline from "../components/Offline";
import useOnline from "../hooks/useOnline";

export default function Error() {
  const online = useOnline();
  if (!online) {
    return <Offline />;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <SectionHeading
        heading="Invalid Route, Try Again."
      />
    </div>
  );
}
