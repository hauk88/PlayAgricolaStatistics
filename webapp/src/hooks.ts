import { useEffect, useState } from "react";

export const useStats = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "data/stats.json").then((r) =>
      r.json().then((d) => setData(d))
    );
  }, []);
  return data;
};
