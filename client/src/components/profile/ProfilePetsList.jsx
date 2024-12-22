/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/images/avatar.png";
import { deletePetHandler } from "../../utils/profilePageHelpers";

const ProfilePetsList = ({
  id,
  profile,
  petName,
  petType,
  petBreed,
  petAge,
  toast,
}) => {
  const navigate = useNavigate();
  const updatePetHandler = (petId) => {
    localStorage.setItem("updatePet", "true");
    localStorage.setItem("petId", petId);
    navigate("/add-pet");
  };

  return (
    <div className="w-[95%] vsm:w-[80%] lg:w-[65%] xl:w-[50%] 2xl:w-[40%] 3xl:w-[30%] rounded-[3rem] bg-[#F8AA26] relative pb-[0.5rem] pr-[0.5rem]">
      <div className="py-[1rem] px-[2rem] rounded-[3rem] bg-[#EEF3FF] border-t-2 border-l-2 border-[#0B0019] flex flex-col gap-2 gsm:gap-[1.5rem] items-center">
        <div className="petDetails flex flex-col gsm:flex-row gap-[0.5rem] vsm:gap-[1rem] gsm:gap-[2rem] items-center">
          <div className="overflow-hidden w-[5rem] h-[5rem] lg:w-[6rem] lg:h-[6rem] rounded-[50%] border-2 border-black">
          <img
            src={profile ? profile : avatar}
            alt="pet_profile"
            className="w-full h-full object-cover"
          />
          </div>
          <div className="details text-[#0B0019] font-primary flex flex-col justify-center items-center">
            <h1 className="petName uppercase font-bold text-[2rem] vsm:text-[2.5rem] leading-[2.5rem]">
              {petName}
            </h1>
            <h3 className="breed text-gray-800 font-semibold text-[1.2rem] vsm:text-[1.5rem]">{`${petType}, ${petBreed}`}</h3>
            <h2 className="dateRange text-gray-600 font-bold text-[1.2rem] vsm:text-[1.5rem]">
              {`${petAge} Years`}
            </h2>
          </div>
        </div>
        <div className="buttons flex flex-col gsm:flex-row justify-between gap-[0.8rem] gsm:gap-[2rem]">
          <button
            className={`text-[1rem] vsm:text-[1.2rem] uppercase font-bold px-[3rem] py-[0.5rem] font-primary text-white rounded-[2rem] hover:bg-[#DFE8FD] hover:text-[#0B0019] border-2 border-[#0B0019] bg-red-500 px-[1rem] vsm:px-[1.5rem] vsm:py-[0.2rem]`}
            onClick={() => deletePetHandler(id, toast)}
          >
            Delete Pet
          </button>
          <button
            className={`text-[1rem] vsm:text-[1.2rem] uppercase font-bold px-[3rem] py-[0.5rem] font-primary text-[#DFE8FD] rounded-[2rem] hover:bg-[#DFE8FD] hover:text-[#0B0019] border-2 border-[#0B0019] bg-[#F8AA26] px-[1rem] vsm:px-[1.5rem] vsm:py-[0.2rem] text-black`}
            onClick={() => updatePetHandler(id)}
          >
            Update Pet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePetsList;
