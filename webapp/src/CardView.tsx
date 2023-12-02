import { CardData } from "./types";

type CardProps = {
  card: CardData;
};

const CardView = ({ card }: CardProps) => {
  const img = card.alt_image ?? card.img_name + ".jpg";
  const url = process.env.PUBLIC_URL + "/img/" + img;
  return (
    <div className="grid-item">
      <img src={url} alt="Cant find image" />
    </div>
  );
};

export default CardView;
