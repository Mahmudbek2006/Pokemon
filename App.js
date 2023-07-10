import React, { useEffect, useState } from 'react';
import PokemonThumb from './PokemonThumb';
import axios from 'axios';
import './App.css';

const App = () => {
  const [dt, setDt] = useState(false)
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon?limit=100');
  const [pokName, setPokName] = useState({
    name: '',
    species: '',
    img: '',
    attack: '',
    defense: '',
    type: '',
  });
  const getAllPokemons = async () => {
    try {
      const res = await fetch(loadMore);
      const data = await res.json();
      setLoadMore(data.next);

      const pokemonPromises = data.results.map(async (pokemon) => {
        const response = await axios.get(pokemon.url);
        const pokemonData = response.data;

        // Add the character image property to the Pokémon data
        const pokemonWithImage = {
          id: pokemonData.id,
          name: pokemonData.name,
          img: pokemonData.sprites.other.dream_world.front_default,
          attack: pokemonData.stats[1].base_stat,
          defense: pokemonData.stats[2].base_stat,
          type: pokemonData.types[0].type.name,
        };

        return pokemonWithImage;
      });

      const pokemonData = await Promise.all(pokemonPromises);
      setAllPokemons((currentList) => [...currentList, ...pokemonData]);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    getAllPokemons();
  }, []);

  const fetchPokemon = () => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokName}`)
      .then((response) => {
        setPokName({
          name: pokName,
          species: response.data.species.name,
          img: response.data.sprites.front_default,
          attack: response.data.stats[1].base_stat,
          defense: response.data.stats[2].base_stat,
          type: response.data.types[0].type.name,
        });
        console.log(response);
      setDt(!dt)

      })
      .catch(() => {
        console.error('Error');
      });
  };

  return (
    <div className="app-container">
      <h1 className="app">Pokemon App</h1>
      <div className="search-area">
        <input
          className="search"
          type="text"
          onChange={(event) => {
            setPokName(event.target.value);
          }}
        />
        <button onClick={fetchPokemon}>Search</button>
      </div>
        <h1>{pokName.name}</h1>
        <div className="result-card">
      {
        dt ? (<img src={pokName.img} alt={pokName.name} />)
        : ''
      }
        <p>{pokName.species}</p>
        <h3>{pokName.attack}</h3>
        <h4>{pokName.defense}</h4>
        <p>{pokName.type}</p>
      </div>
      <div className="pokemon-container">
        {allPokemons.map((pokemonStats) => (
          <div className="all-container" key={pokemonStats.id}>
            <PokemonThumb
              id={pokemonStats.id}
              image={pokemonStats.img}
              name={pokemonStats.name}
              type={pokemonStats.attack}
            />
          </div>
        ))}
        <button className="load-more" onClick={() => getAllPokemons()}>
          Load more
        </button>
      </div>
    </div>
  );
};

export default App;

