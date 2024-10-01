import { useEffect, useState } from "react";
import { CardData } from "./types";

export const useStats = () => {
  const [data, setData] = useState<CardData[]>([]);
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "data/stats.json").then((r) =>
      r.json().then((d) => setData(d))
    );
  }, []);
  return data;
};
