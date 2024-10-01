import { createBrowserRouter, Navigate } from "react-router-dom";
import Table from "./pages/table/Table";
import Flashcards from "./pages/flashcards/Flashcards";

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
  ],
  { basename: import.meta.env.BASE_URL }
);

export default router;
