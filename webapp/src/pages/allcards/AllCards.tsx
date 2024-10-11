import { useStats } from "../../hooks";
import { CardData } from "../../types";
import { isUsed } from "../../cardutils";

const deckOrder = ["e", "i", "k", "wm", "fr"];

const AllCards = () => {
  const data = useStats();
  if (data.length === 0) return <div>Loading...</div>;
  const filterdData = data.filter((c) => isUsed(c));
  filterdData.sort((a, b) => {
    if (a.Type !== b.Type) {
      return -a.Type.localeCompare(b.Type);
    }
    if (a.alt_image !== null && b.alt_image === null) {
      return 1;
    }
    if (a.alt_image === null && b.alt_image !== null) {
      return -1;
    }
    if (a.Deck !== b.Deck) {
      const adeck = a.Deck ?? "";
      const bdeck = b.Deck ?? "";
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
