import { useEffect, useState } from "react";
import "./like_button.css";

type LikeButtonProps = {
    liked: boolean;
    onClick: (liked: boolean) => void;
}


export const LikeButton = (props: LikeButtonProps) => {
    const [liked, setLiked] = useState(props.liked);
    const [buttonClass, setButtonClass] = useState(props.liked ? 'heart-filled' : 'heart-outlined');

    useEffect(() => {
        setLiked(props.liked);
        setButtonClass(props.liked ? 'heart-filled' : 'heart-outlined');
      }, [props.liked])

    const handleClick = () => {

        setButtonClass(!liked ? 'heart-filled' : 'heart-outlined');
        props.onClick(!liked);
        console.log(!liked ? 'heart-filled' : 'heart-outlined');

    };

    return (
        <div className="like-button-container">
            <div className={`like-button prevent-select`} onClick={handleClick}>
                <span className={`material-symbols-outlined ${buttonClass}`}>favorite</span>
            </div>
        </div>
    );
}