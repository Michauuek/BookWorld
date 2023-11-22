import { useState } from "react";
import "./like_button.css";

type LikeButtonProps = {
    liked: boolean;
    onClick: (liked: boolean) => void;
}


export const LikeButton = (props: LikeButtonProps) => {
    const [liked, setLiked] = useState(props.liked);
    const [buttonClass, setButtonClass] = useState(props.liked ? 'heart-filled' : 'heart-outlined');


    const handleClick = () => {

        

        setButtonClass(!liked ? 'heart-filled' : 'heart-outlined');
        props.onClick(!liked);

        setLiked(!liked);

    };

    return (
        <div className="like-button-container">
            <div className={`like-button prevent-select`} onClick={handleClick}>
                <span className={`material-symbols-outlined ${buttonClass}`}>favorite</span>
            </div>
        </div>
    );
}