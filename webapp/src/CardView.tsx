import { CardData } from "./types";

type CardProps = {
  preferAlt?: boolean;
  card: CardData;
};

const CardView = ({ card, preferAlt }: CardProps) => {
  let main = card.img_name === null ? null : card.img_name + ".jpg";
  let alt = card.alt_image;
  if (preferAlt) {
    const tmp = main;
    main = alt;
    alt = tmp;
  }
  const img = main ?? alt;

  const url = process.env.PUBLIC_URL + "/img/" + img;
  return (
    <div className="grid-item">
      <img src={url} alt="Cant find" width="229px" height="357px" />
    </div>
  );
};

export default CardView;
