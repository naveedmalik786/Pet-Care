import SectionHeading from "../components/SectionHeading";
import { BASE_URL } from "../utils/BASE_URL";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Label from "../components/register/Label";
import Input from "../components/register/Input";
import useOnline from "../hooks/useOnline";
import Offline from "../components/Offline";

// eslint-disable-next-line no-unused-vars, react-refresh/only-export-components
export default function Login() {
  const online = useOnline();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update authentication state upon successful login
        login();
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("location", data.user.location);
        localStorage.setItem("phoneNo", data.user.phoneNo);
        localStorage.setItem("isLoggedIn", "true");
        toast.success("Login Successful!");
        navigate("/profile");
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      console.error("Error during login request:", error);
    }
  };

  if (!online) {
    return <Offline />;
  }

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="w-full h-screen bg-[#FEFFC0] flex flex-col justify-center items-center">
        <SectionHeading heading="Login"/>
        <form
          method="POST"
          className="w-[90%] vsm:w-[75%] gsm:w-[65%] max-w-md mx-auto px-[3rem] py-[2rem] shadow-md rounded-[1rem] bg-[#f8aa26] text-[#0B0019] font-semibold font-primary"
        >
          <Label htmlFor={"email"} text={"Email"} />
          <Input required={true} type={"email"} name={"email"} id={"email"} />
          <Label htmlFor={"password"} text={"Password"} />
          <Input required={true} type={"password"} name={"password"} id={"password"} />
          <button
            type="submit"
            onClick={handleLoginSubmit}
            className="w-full p-2 bg-[#bbdafa] text-[#080909] text-[1.2rem] md:text-[1.5rem] rounded-md hover:text-[#FEFFC0] hover:bg-[#0B0019] uppercase font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
