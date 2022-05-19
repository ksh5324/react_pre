import axios from "axios";
import { useQuery } from "react-query";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

export const RQSuperHeroesPage = () => {
  const { isLoading, data, isError, error } = useQuery(
    "super-heroes",
    fetchSuperHeroes
  );

  if (isLoading) {
    return <h2>로딩중...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <h2>
      {data?.data.map((hero) => (
        <div key={hero.id}>{hero.name}</div>
      ))}
    </h2>
  );
};
