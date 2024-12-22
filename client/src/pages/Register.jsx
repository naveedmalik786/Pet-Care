import { BASE_URL } from "../utils/BASE_URL";
import isStrongPassword from "../utils/isStrongPassword";
import { Form } from "react-router-dom";
import Input from "../components/register/Input";
import Label from "../components/register/Label";
import SectionHeading from "../components/SectionHeading";
import { ToastContainer, toast } from "react-toastify";
import useOnline from "../hooks/useOnline";
import Offline from "../components/Offline";

// eslint-disable-next-line no-unused-vars, react-refresh/only-export-components
export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const phoneNo = formData.get("phoneNo");
  const location = formData.get("location");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!isStrongPassword(password)) {
    console.error("Please enter a strong password.");
  } else if (password !== confirmPassword) {
    console.error("Passwords do not match!");
  } else {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phoneNo: phoneNo,
          password: password,
          location: location,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Registration successful!");
      }
      console.log("Register response:", data);
    } catch (error) {
      toast.error(error);
    }
  }
  return null;
}

export default function Register() {
  const online = useOnline();
  if (!online) {
    return <Offline />;
  }

  return (
    <>
      <div className="w-full min-h-screen bg-[#FEFFC0] flex flex-col justify-center items-center md:gap-[1rem] pt-[4rem] vsm:pt-[8rem] pb-[2rem] vsm:pb-[3.5rem] md:pb-[5rem]">
        <SectionHeading heading="Register" />
        <Form
          method="post"
          className="w-[90%] vsm:w-[75%] gsm:w-[65%] max-w-md mx-auto px-[1.5rem] vsm:px-[2rem] md:px-[3rem] py-[1.5rem] md:py-[2rem] shadow-md rounded-[1rem] bg-[#bbdafa] text-[#0B0019] font-semibold font-primary"
        >
          <Label htmlFor={"name"} text="Name" />
          <Input required={true} type={"text"} name="name" id="name" />
          <Label htmlFor={"email"} text="Email" />
          <Input required={true} type={"email"} name="email" id="email" />
          <Label htmlFor={"phoneNo"} text="Phone Number" />
          <Input required={true} type={"tel"} name="phoneNo" id="phoneNo" />
          <Label htmlFor={"location"} text="Location" />
          <Input required={true} type={"text"} name="location" id="location" />
          <Label htmlFor={"password"} text="Password" />
          <Input
            required={true}
            type={"password"}
            name="password"
            id="password"
          />
          <Label htmlFor={"confirmPassword"} text="Confirm Password" />
          <Input
            type={"password"}
            name="confirmPassword"
            id="confirmPassword"
          />
          <button
            type="submit"
            className="w-full py-2 mt-4 md:mt-0 md:p-2 bg-[#f8aa26] text-[#080909] text-[1.1rem] md:text-[1.5rem] rounded-md hover:text-[#FEFFC0] hover:bg-[#0B0019] uppercase font-semibold"
          >
            Register
          </button>
        </Form>
      </div>
      <ToastContainer position="top-center" closeOnClick={true} closeButton={true}/>
    </>
  );
}
