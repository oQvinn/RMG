"use client";
import React, { useEffect, useState, useMemo } from "react";
import "./page.css";
import { RiMovieFill } from "react-icons/ri";
import { createListCollection } from "@chakra-ui/react";
import { MovieCard } from "../../components/MovieCard/movieCard";
import { RiRefreshLine } from "react-icons/ri";
import { SelectRoot } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

interface Genre {
  id: number;
  name: string;
}

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [toggle, setToggle] = useState(false);
  const [genres, setGenres] = useState<any>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const options = useMemo(
    () => ({
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_READ_KEY}`,
      },
    }),
    []
  );

  useEffect(() => {
    const fetchMovieGenres = async () => {
      const response = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list",
        options
      );
      const data = await response.json();
      setGenres(data.genres || []);
    };
    fetchMovieGenres();
  });

  const memoizedGenres = useMemo(() => {
    return createListCollection({
      items: genres || [],
      itemToString: (item: Genre) => item.name,
      itemToValue: (item: Genre) => item.id.toString(),
    });
  }, [genres]);

  useEffect(() => {
    setMovies([]);
    const fetchMoviesByCriteria = async () => {
      const randomPages = [
        Math.floor(Math.random() * 500) + 1,
        Math.floor(Math.random() * 500) + 1,
        Math.floor(Math.random() * 500) + 1,
      ].sort((a, b) => a - b);

      const fetchPage = async (page: any) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${
            selectedGenre ?? 27
          }&include_adult=true&page=${page}&sort_by=popularity.desc&language=en-US`,
          options
        );
        const data = await response.json();
        return data.results;
      };
      try {
        const [moviesPage1, moviesPage2, moviesPage3] = await Promise.all(
          randomPages.map((page) => fetchPage(page))
        );

        const getRandomMovies = (movies: any, count: number) => {
          const shuffled = movies.sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        };

        const finalMovies = [
          ...getRandomMovies(moviesPage1, 10),
          ...getRandomMovies(moviesPage2, 5),
          ...getRandomMovies(moviesPage3, 5),
        ];
        setMovies(finalMovies);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMoviesByCriteria();
  }, [toggle, selectedGenre, options]);

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <div className="homepage-header-left-group">
          <RiMovieFill className="homepage-header-icon" />
          <div className="homepage-header-text-container">
            <h1 className="homepage-header-primary-text">
              Random Movie Generator
            </h1>
            <h2 className="homepage-header-secondary-text">
              For the indecisive movie watchers :D
            </h2>
          </div>
        </div>
        <div className="homepage-header-right-group">
          <RiRefreshLine
            className="homepage-header-icon-refresh"
            onClick={() => setToggle(!toggle)}
          />
        </div>
      </div>
      <div className="homepage-body">
        <div>
          <SelectRoot
            collection={memoizedGenres}
            width={"300px"}
            onValueChange={(value) => setSelectedGenre(Number(value.value))}
          >
            <SelectTrigger backgroundColor={"var(--background-secondary)"}>
              <SelectValueText placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent width={"300px"} className="select-content">
              {genres
                ? genres.map((genre: any) => (
                    <SelectItem
                      item={genre}
                      key={genre.id}
                      padding={4}
                      className="select-item"
                    >
                      {genre.name}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </SelectRoot>
        </div>
      </div>
      <div className="movie-list">
        {movies.length > 0
          ? movies.map((item) => (
              <div key={item.id}>
                <MovieCard movie={item} />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
