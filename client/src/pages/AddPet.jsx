import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { petBreeds } from "../constants/config";
import { BASE_URL } from "../utils/BASE_URL";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Loader";
import useOnline from "../hooks/useOnline";
import Offline from "../components/Offline";

// eslint-disable-next-line react/prop-types
export default function AddPet() {
  const online = useOnline();
  const [petId] = useState(localStorage.getItem("petId") || null);
  const [updatePet, setUpdatePet] = useState(
    localStorage.getItem("updatePet") || null
  );
  // eslint-disable-next-line no-unused-vars
  const [form, setForm] = useState({});
  const [profile, setProfile] = useState("");
  const [formOne, setFormOne] = useState(true);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [loader, setLoader] = useState(false);

  const [curType, setCurType] = useState("Cat");
  const petTypes = ["Cat", "Dog", "Rabbit"];

  function updateBreedOpts(event) {
    setCurType(event.target.value);
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // Toggle between first form and second form
  const toggleForm = () => {
    setFormOne(!formOne);
  };

  // Pet available for borrow or not handler
  const handleAvailability = (e) => {
    if (e.target.value === "Yes") {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
  };

  // Profile picture handler
  const updateProfileDataChange = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfile(reader.result);
      }
    };
  };

  // Form One submit handler
  const handleNextButtonSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("profile", profile);
    formData.forEach((value, key) => {
      if (key === "image") {
        return;
      }
      if (key === "availableForBorrow") {
        if (value === "Yes") {
          form[key] = "true";
        } else {
          form[key] = "false";
        }
        return;
      }
      form[key] = value;
    });
    toggleForm();
  };

  // Second form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.forEach((value, key) => {
      if (key == "yob") {
        form["petAge"] = `${new Date().getFullYear() - value}`;
        return;
      }
      form[key] = value;
    });
    const bodyData = Object.fromEntries(
      Object.entries(form).filter(([, value]) => value)
    );
    console.log(bodyData);
    if (updatePet) {
      try {
        setLoader(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/user/pet/${petId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accesstoken: token,
          },
          body: JSON.stringify({
            petName: bodyData.petName,
            profile: bodyData.profile,
            petType: bodyData.petType,
            petBreed: bodyData.petBreed,
            petGender: bodyData.petGender,
            availableForBorrow: bodyData.availableForBorrow,
            startDate: bodyData.startDate || "",
            endDate: bodyData.endDate || "",
            petAge: bodyData.petAge,
            petPrecautions: bodyData.petPrecautions,
            petInterests: bodyData.petInterests || "",
            ownerMessage: bodyData.ownerMessage || "",
          }),
        });
        const data = await res.json();
        console.log(data);
        if (data.success) {
          toast.success("Pet Updated Successfully!");
          localStorage.removeItem("updatePet");
          localStorage.removeItem("petId");
          setUpdatePet(false);
        }
      } catch (e) {
        console.error("Error in posting data to server: ", e.message);
      } finally {
        setLoader(false);
      }
    } else {
      try {
        setLoader(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accesstoken: token,
          },
          body: JSON.stringify({
            petName: bodyData.petName,
            profile: bodyData.profile,
            petType: bodyData.petType,
            petBreed: bodyData.petBreed,
            petGender: bodyData.petGender,
            availableForBorrow: bodyData.availableForBorrow,
            startDate: bodyData.startDate || "",
            endDate: bodyData.endDate || "",
            petAge: bodyData.petAge,
            petPrecautions: bodyData.petPrecautions,
            petInterests: bodyData.petInterests || "",
            ownerMessage: bodyData.ownerMessage || "",
          }),
        });
        const data = await res.json();
        console.log(data);
        if (data.success) {
          toast.success("Pet added successfully.");
        }
      } catch (e) {
        console.error("Error in posting data to server: ", e.message);
      } finally {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    setUpdatePet(localStorage.getItem("updatePet"));
  }, [updatePet]);

  if (!online) {
    return <Offline />;
  }

  return (
    <>
      {loader && <Loader />}
      <div className="w-full min-h-screen bg-[#FEFFC0] flex flex-col justify-center items-center gap-[1rem] pt-[8rem] pb-[5rem]">
        <SectionHeading heading="Add Pet" styles="text-[4rem]" />
        {formOne ? (
          <form
            onSubmit={handleNextButtonSubmit}
            id="formOne"
            // encType="multipart/form-data"
            className="w-[90%] vsm:w-[85%] max-w-md mx-auto px-[1rem] gsm:px-[1.5rem] msm:px-[2rem] md:px-[3rem] py-[2rem] shadow-md rounded-[1rem] bg-[#15022DCC] text-[#0B0019] font-semibold font-primary"
          >
            <input
              required
              type="text"
              name="petName"
              placeholder="Name"
              className="mb-4 w-full p-2 rounded-md outline-none bg-[#fefefe] outline-none text-[#0B0019]"
            />
            <div className="relative mb-4">
              <input
                required
                name="image"
                type="file"
                accept="image/"
                id="file"
                onChange={updateProfileDataChange}
                className="block w-full text-sm text-[#0B0019] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#fefefe] outline-none text-[#fefefe] file:text-[#0B0019]"
                placeholder="Upload a image"
              />
            </div>
            <div>
              <select
                className="mb-4 w-full p-2 rounded-md outline-none bg-[#fefefe] outline-none text-[#0B0019]"
                onChange={updateBreedOpts}
                name="petType"
              >
                {petTypes.map((petType) => (
                  <option key={petType} value={petType}>
                    {petType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                name="petBreed"
                className="mb-4 w-full p-2 rounded-md outline-none  bg-[#fefefe] outline-none text-[#0B0019]"
              >
                {curType ? (
                  petBreeds[curType].map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))
                ) : (
                  <option>Select a Type First</option>
                )}
              </select>
            </div>

            <div>
              <select
                className="mb-4 w-full p-2 rounded-md outline-none  bg-[#fefefe] outline-none text-[#0B0019]"
                name="petGender"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label htmlFor="availableForBorrow" className="text-[#fefefe]">
                Available for Borrow
              </label>
              <select
                className="mb-4 w-full p-2 rounded-md outline-none  bg-[#fefefe] outline-none text-[#0B0019]"
                name="availableForBorrow"
                onChange={handleAvailability}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {isAvailable ? (
              <>
                <div>
                  <label htmlFor="startDate" className="text-[#fefefe]">
                    From
                  </label>
                  <input
                    name="startDate"
                    type="date"
                    max={endDate}
                    onChange={handleStartDateChange}
                    value={startDate}
                    className="mb-4 w-full p-2 rounded-md outline-none  bg-[#fefefe] outline-none text-[#0B0019]"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="text-[#fefefe]">
                    To
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    onChange={handleEndDateChange}
                    value={endDate}
                    min={startDate}
                    className="mb-4 w-full p-2 rounded-md outline-none  bg-[#fefefe] outline-none text-[#0B0019]"
                  />
                </div>
              </>
            ) : (
              ""
            )}

            <button
              type="submit"
              className="w-full p-2 bg-[#f8aa26] text-[#0B0019] rounded-md hover:text-[#080909] uppercase font-semibold hover:bg-[#fefefe]"
            >{`Next Page >`}</button>
          </form>
        ) : (
          <form
            id="formTwo"
            onSubmit={handleSubmit}
            className="w-[95%] vsm:w-[85%] max-w-md mx-auto px-[1rem] gsm:px-[1.5rem] msm:px-[2rem] md:px-[3rem] py-[2rem] shadow-md rounded-[1rem] bg-[#15022DCC] text-[#0B0019] font-semibold font-primary"
          >
            <div>
              <input
                required
                title="Please enter a 4-digit year."
                className="mb-4 w-full p-2 rounded-md outline-none bg-[#fefefe] outline-none text-[#0B0019]"
                type="number"
                name="yob"
                placeholder="Year of Birth"
                pattern="\d{4}"
                min={2000}
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <textarea
                className="w-full bg-[#fefefe] outline-none rounded-md p-2 mb-2"
                placeholder="Precautions"
                required
                name="petPrecautions"
              ></textarea>
            </div>

            <div>
              <textarea
                className="w-full bg-[#fefefe] outline-none rounded-md p-2 mb-2"
                placeholder="Interests [Optional]"
                name="interests"
              ></textarea>
            </div>

            <div>
              <textarea
                className="w-full bg-[#fefefe] outline-none rounded-md p-2 mb-2"
                placeholder="Owner's Message [Optional]"
                name="ownerMessage"
              ></textarea>
            </div>

            <button
              className="w-full p-2 bg-[#f8aa26] text-[#0B0019] rounded-md hover:text-[#080909] uppercase font-semibold mb-2 hover:bg-[#fefefe]"
              onClick={toggleForm}
            >{`< Prev Page`}</button>

            <button
              type="submit"
              className="w-full p-2 bg-[#fefefe] text-[#0B0019] rounded-md hover:text-[#080909] uppercase font-semibold hover:bg-[#f8aa26]"
            >{`Submit`}</button>
          </form>
        )}
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}
