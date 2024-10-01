import { createBrowserRouter, Navigate } from "react-router-dom";
import Table from "./pages/table/Table";

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
  ],
  { basename: import.meta.env.BASE_URL }
);

export default router;
