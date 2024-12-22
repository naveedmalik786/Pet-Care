import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Register, { action as registerAction } from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AddPet from "./pages/AddPet";
import Petfolio from "./pages/Petfolio";
import Error from "./pages/Error";
import PetsList from "./pages/PetsList";
import { AuthProvider } from "./contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        action: registerAction,
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "add-pet",
        element: <AddPet />,
      },
      {
        path: "pets",
        element: <PetsList />,
      },
      {
        path: "pets/:petId",
        element: <Petfolio />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
