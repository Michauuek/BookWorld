import { useEffect, useState } from "react";
import { Genre } from "../../../common/genreAPI";
import { Author } from "../../../common/authorAPI";
import { GetAuthorLikes, GetGenreLikes } from "../../../common/favouriteAPI";
import { Link } from "react-router-dom";

type LikedSectionProps = {
    user: string;
}

export const LikedSection = (props: LikedSectionProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [likedAuthors, setLikedAuthors] = useState<Author[]>([]);
    const [likedGenres, setLikedGenres] = useState<Genre[]>([]);

    useEffect(() => {
        GetAuthorLikes(props.user).then((response) => {
            setLikedAuthors(response.data);
            setIsLoading(false);
        }
        );
        
        GetGenreLikes(props.user).then((response) => {
            setLikedGenres(response.data);
            setIsLoading(false);
        }
        );
    }, [props.user])
    
    return (
        <div className="liked-section">
        <h2 className="liked-section__title">Liked</h2>
        {isLoading ? (
            // <Spinner />
            "Loading..."
        ) : (
            <div className="liked-section__books">
            <h3>Authors</h3>
            {likedAuthors.map((author) => (
                <Link key={author.id} to={`/author/${author.id}`}> {author.name} {author.lastName}, </Link> 
            ))}
            <h3>Genres</h3>
            {likedGenres.map((genre) => (
                <Link key={genre.id} to={`/genre/${genre.id}`}> {genre.name}, </Link>
            ))}
            </div>
        )}
        </div>
    );
    }