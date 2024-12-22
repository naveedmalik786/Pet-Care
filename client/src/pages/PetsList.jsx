import SectionHeading from "../components/SectionHeading";
import PetCard from "../components/pets/PetCard";
import DarkButton from "../components/buttons/DarkButton";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { pets as dummyPets } from "../constants/config";
import { BASE_URL } from "../utils/BASE_URL";
import Loader from "../components/Loader";
import useOnline from "../hooks/useOnline";
import Offline from "../components/Offline";

export default function PetsList() {
  const online = useOnline();
  const [loader, setLoader] = useState(false);
  const [pets, setPets] = useState(dummyPets);

  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    localStorage.getItem("token") && login();
  }, [login]);

  // Get All pets
  useEffect(() => {
    const handleAllPetsClick = async () => {
      setLoader(true);
      try {
        const response = await fetch(BASE_URL + "/pets/all", {
          method: "GET",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const data = await response.json();
        setPets(data.pets);
        console.log("All Pets response:", data);
      } catch (error) {
        console.error("Error during all pets request:", error);
      }
      setLoader(false);
    };
    handleAllPetsClick();
  }, []);

  if (!online) {
    return <Offline />;
  }

  return (
    <>
      <div className="bg-[#FEFFC0] w-full min-h-screen flex flex-col justify-center items-center">
        <SectionHeading heading="Pets" styles="mt-[6rem] vsm:mt-[10rem] mb-[1rem] gsm:mb-[1.5rem]" />
        {isLoggedIn && (
          <Link to="/add-pet">
            <DarkButton buttonText="Add your pet" />
          </Link>
        )}
        <div className="pets mt-[2rem] gsm:mt-[3rem] md:mt-[4rem] mb-[3rem] max-w-[90%] flex flex-wrap gap-x-[3rem] gap-y-[2rem] items-stretch justify-center">
          {pets.map(
            ({
              _id,
              petName,
              petType,
              petBreed,
              ownerMessage,
              startDate,
              endDate,
              profile,
            }) => {
              return (
                <PetCard
                  key={_id}
                  petId={_id}
                  petName={petName}
                  category={petType}
                  breed={petBreed}
                  ownerMessage={ownerMessage || ""}
                  startDate={
                    startDate
                      ? startDate.slice(0, 10).split("-").join("/")
                      : "15/01/2000"
                  }
                  endDate={
                    endDate
                      ? endDate.slice(0, 10).split("-").join("/")
                      : "25/01/2000"
                  }
                  profile={profile}
                />
              );
            }
          )}
        </div>
      </div>
      {loader && <Loader />}
    </>
  );
}
