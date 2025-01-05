import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Collapsible,
} from "@chakra-ui/react";
import "./movieCard.css";
import { RiStarFill } from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";
import { RiEyeOffLine } from "react-icons/ri";
import { useState } from "react";

interface MovieCardProps {
  movie: any;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [descOpen, setDescOpen] = useState(false);
  return (
    <Card.Root className="movie-card" id={movie.id}>
      <CardHeader className="movie-card-header">
        <div>{movie.original_title}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "4px",
            alignItems: "center",
          }}
        >
          <RiStarFill fill="var(--icon-color-yellow)" />
          <div>{movie.vote_average}</div>
        </div>
      </CardHeader>
      <Image
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        className="movie-poster"
        alt="movie poster"
      />
      <CardBody className="movie-card-body">
        <Collapsible.Root onOpenChange={(isOpen) => setDescOpen(isOpen.open)}>
          <Collapsible.Trigger className="trigger-container">
            {descOpen ? (
              <div className="trigger-content">
                <h1>Hide Description</h1>
                <RiEyeOffLine className="card-icon" />
              </div>
            ) : (
              <div className="trigger-content">
                <h1>Show Description</h1>
                <RiEyeLine className="card-icon" />
              </div>
            )}
          </Collapsible.Trigger>
          <Collapsible.Content>{movie.overview}</Collapsible.Content>
        </Collapsible.Root>
      </CardBody>
      <CardFooter />
    </Card.Root>
  );
};
