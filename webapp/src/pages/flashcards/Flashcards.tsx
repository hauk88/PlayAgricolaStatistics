import { useState } from "react";
import { useStats } from "../../hooks";
import { CardData } from "../../types";

const isUsed = (card: CardData) => {
  if (card.banned) return false;
  const deck = card.Deck?.toLowerCase();
  if (
    deck === "e" ||
    deck === "i" ||
    deck === "k" ||
    deck === "wm" ||
    deck === "fr"
  )
    return true;
  if (card.alt_image !== null) return true;
  return false;
};

const hasStats = (card: CardData) => {
  return card.PWR !== null;
};

const Flashcards = () => {
  const data = useStats();
  if (data.length === 0) return <div>Loading...</div>;
  const filterdData = data.filter((c) => isUsed(c) && hasStats(c));
  return <FlashcardsGame data={filterdData} />;
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

const findMax = (values: number[]) => {
  let idx = 0;
  let m = values[idx];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > m) {
      idx = i;
      m = values[i];
    }
  }
  return idx;
};

const FlashcardsGame = ({ data }: FlashcardsGameProps) => {
  const [cards, setCards] = useState(getRandomCards(data));
  const [selected, setSelected] = useState(cards.length);
  const [reveil, setReveil] = useState(false);
  const winner =
    cards[findMax(cards.map((i) => data[i].PWR).filter((v) => v !== null))];

  const reset = () => {
    setReveil(false);
    const newCards = getRandomCards(data);
    setCards(newCards);
    setSelected(newCards.length);
  };
  return (
    <div>
      <div className="flash-cards-container">
        {cards.map((i) => {
          const url =
            import.meta.env.BASE_URL +
            "img/" +
            (data[i].alt_image ?? data[i].image);
          return (
            <div className="flash-card-container" key={url + i}>
              <img
                onClick={() => {
                  if (reveil) {
                    reset();
                  } else if (selected === i) {
                    setReveil(true);
                  } else {
                    setSelected(i);
                  }
                }}
                src={url}
                width="229px"
                height="357px"
                style={selected === i ? { border: "solid" } : {}}
              />
              {reveil && (
                <p style={winner === i ? { border: "solid" } : {}}>
                  PWR: {data[i].PWR}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Flashcards;
