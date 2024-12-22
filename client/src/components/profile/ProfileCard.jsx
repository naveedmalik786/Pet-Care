import avatar from "../../assets/images/avatar.png";

const ProfileCard = () => {
  const [username, userLocation, phoneNo, email] = [
    localStorage.getItem("name"),
    localStorage.getItem("location"),
    localStorage.getItem("phoneNo"),
    localStorage.getItem("email"),
  ];
  return (
    <div className="rounded-[3rem] bg-[#F8AA26] relative pb-[0.5rem] pr-[0.5rem] mb-[1rem]">
      <div className="py-[1.5rem] px-[2rem] rounded-[3rem] bg-[#EEF3FF] border-t-2 border-l-2 border-[#0B0019] flex flex-col gap-[1rem] items-center">
        <img src={avatar} alt="pet_profile" className="w-[6rem]" />
        <div className="petDetails flex gap-[2rem] items-center">
          <div className="details text-[#0B0019] font-primary flex flex-col items-center">
            <h1 className="petName uppercase font-bold text-[2.5rem] leading-[2.5rem]">
              {username}
            </h1>
            <h2 className="dateRange font-semibold text-[1.5rem]">
              {`${userLocation}`}
            </h2>
            <h3 className="dateRange font-semibold text-[1.3rem]">
              {`+91 ${phoneNo}`}
            </h3>
            <h3 className="breed text-[1.3rem]">{email}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
