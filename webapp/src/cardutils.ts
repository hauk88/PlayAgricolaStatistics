import { CardData } from "./types";

export const isUsed = (card: CardData) => {
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
