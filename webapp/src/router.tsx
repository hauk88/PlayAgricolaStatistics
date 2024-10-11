import { createBrowserRouter, Navigate } from "react-router-dom";
import Table from "./pages/table/Table";
import Flashcards from "./pages/flashcards/Flashcards";
import AllCards from "./pages/allcards/AllCards";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate replace to="/table" />,
    },
    {
      path: "/table",
      element: <Table />,
    },
    {
      path: "/flashcards",
      element: <Flashcards />,
    },
    {
      path: "/nodeck",
      element: <AllCards />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export default router;
