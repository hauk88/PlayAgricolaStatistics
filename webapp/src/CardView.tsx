import { CardData } from "./types";

type CardProps = {
  preferAlt?: boolean;
  card: CardData;
};

const CardView = ({ card, preferAlt }: CardProps) => {
  const img = preferAlt ? card.alt_image ?? card.image : card.image;

  const url = process.env.PUBLIC_URL + "/img/" + img;
  return (
    <div className="grid-item">
      <img src={url} alt="Cant find" width="229px" height="357px" />
    </div>
  );
};

export default CardView;
