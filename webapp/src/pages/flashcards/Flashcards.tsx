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
  const first = randomInt(data.length);
  const firstCard = data[first];
  const sameTypeIdx = data
    .map((v, idx) => (v.Type === firstCard.Type ? idx : -1))
    .filter((v) => v !== -1);

  let filteredIdx = sameTypeIdx.filter((v) => v !== first);
  const second = filteredIdx[randomInt(filteredIdx.length)];

  filteredIdx = filteredIdx.filter((v) => v !== second);
  const third = filteredIdx[randomInt(filteredIdx.length)];
  return [first, second, third];
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
    <div className="flex flex-row gap-5">
      {cards.map((i) => {
        const url =
          import.meta.env.BASE_URL +
          "img/" +
          (data[i].alt_image ?? data[i].image);
        return (
          <div
            className="flex flex-col justify-center items-center gap-2"
            key={url + i}
          >
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
              className={selected === i ? "border-2 border-black" : ""}
            />
            {reveil && (
              <p className={winner === i ? "border-2 border-black" : ""}>
                PWR:{" "}
                {data[i].PWR === null ? 0 : Math.round(data[i].PWR * 100) / 100}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Flashcards;
