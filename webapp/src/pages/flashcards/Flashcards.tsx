import { useState } from "react";
import { useStats } from "../../hooks";
import { CardData } from "../../types";

const Flashcards = () => {
  const data = useStats();
  if (data.length === 0) return <div>Loading...</div>;
  return <FlashcardsGame data={data} />;
};

type FlashcardsGameProps = {
  data: CardData[];
};

const randomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const getRandomCards = (data: CardData[]) => {
  return [
    randomInt(data.length),
    randomInt(data.length),
    randomInt(data.length),
  ];
};

const FlashcardsGame = ({ data }: FlashcardsGameProps) => {
  const [cards, setCards] = useState(getRandomCards(data));
  const [selected, setSelected] = useState(cards.length);
  const [reveil, setReveil] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setReveil(false);
          setCards(getRandomCards(data));
        }}
      >
        Refresh
      </button>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {cards.map((i) => {
          const url =
            import.meta.env.BASE_URL +
            "img/" +
            (data[i].alt_image ?? data[i].image);
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
              }}
            >
              <img
                onClick={() => {
                  if (selected === i) {
                    setReveil(true);
                  } else {
                    setSelected(i);
                  }
                }}
                key={url + i}
                src={url}
                width="229px"
                height="357px"
                style={selected === i ? { border: "solid" } : {}}
              />
              {reveil && <p>PWR: {data[i].PWR}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Flashcards;
