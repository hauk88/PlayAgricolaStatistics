import { CardData } from "./types"

type CardProps={
    card: CardData
}


const CardView = ({ card }: CardProps) => {
    const url = process.env.PUBLIC_URL + '/img/' + card.img_name + '.jpg';
    return (
    <div className="grid-item">
        <img src={url} alt="Cant find image" />
    </div>)
}

export default CardView