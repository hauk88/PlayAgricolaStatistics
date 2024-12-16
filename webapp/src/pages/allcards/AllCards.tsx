import { useStats } from "../../hooks";
import { CardData } from "../../types";

const deckOrder = ["e", "i", "k", "wm", "fr"];

const AllCards = () => {
  const data = useStats();
  if (data.length === 0) return <div>Loading...</div>;
  const filterdData = data.filter((c) => c.is_no);
  filterdData.sort((a, b) => {
    if (a.type !== b.type) {
      return -a.type.localeCompare(b.type);
    }
    if (a.alt_image !== null && b.alt_image === null) {
      return 1;
    }
    if (a.alt_image === null && b.alt_image !== null) {
      return -1;
    }
    if (a.deck !== b.deck) {
      const adeck = a.deck ?? "";
      const bdeck = b.deck ?? "";
      return (
        deckOrder.findIndex((v) => v === adeck.toLowerCase()) -
        deckOrder.findIndex((v) => v === bdeck.toLowerCase())
      );
    }
    return a.name.localeCompare(a.name);
  });
  return <ShowAllCards data={filterdData} />;
};

type ShowAllCardsProps = {
  data: CardData[];
};

const ShowAllCards = ({ data }: ShowAllCardsProps) => {
  return (
    <div className="flex w-screen flex-row flex-wrap gap-1">
      {data.map((v) => {
        const url =
          import.meta.env.BASE_URL + "img/" + (v.alt_image ?? v.image);
        return <img key={v.id} src={url} width="229px" height="357px" />;
      })}
    </div>
  );
};

export default AllCards;
