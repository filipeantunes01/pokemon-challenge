import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [pokemonName, setPokemonName] = useState(""); // Stores the name of the Pokemon written by the user in the input
  const [isPokemonChosen, setIsPokemonChosen] = useState(false); // Checks if a Pokemon has been chosen
  const [pokemon, setPokemon] = useState({}); // Stores the data fetched about the searched Pokemon
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);

  // Get the list of Pokemons
  useEffect(() => {
    Axios.get("https://pokeapi.co/api/v2/pokemon?limit=1025")
      .then((response) => {
        setPokemonList(response.data.results);
      })
      .catch((error) => {
        console.error("Error loading the Pokemon list:", error);
      });
  }, []);

  // Handles the API request
  const searchPokemon = (nameOrId) => {
    Axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
      .then((response) => {
        setPokemon({
          id: response.data.id,
          name: response.data.name,
          img: response.data.sprites.front_default,
          type: response.data.types[0].type.name,
        });

        setIsPokemonChosen(true);
        setFilteredPokemonList([]); // Clears the filtered list after the user has chosen a result
      })
      .catch(() => alert("We could not find the Pokemon you're looking for!"));
  };

  // Filter the pokemon list based on a partial input of a name
  const filterPokemon = (input) => {
    if (!input) {
      setFilteredPokemonList([]);
      return;
    }

    const filteredList = pokemonList.filter((poke) =>
      poke.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredPokemonList(filteredList);
  };

  // Functions to handle "previous" and "next" buttons
  const handlePrevious = () => {
    if (pokemon.id > 1) {
      // ID's start at 1
      searchPokemon(pokemon.id - 1);
    }
  };

  const handleNext = () => {
    searchPokemon(pokemon.id + 1);
  };

  return (
    <div className="App">
      <div className="TitleSection">
        <img
          id="pokemon-logo"
          src="/images/pokemon-logo.png"
          alt="pokemon-logo"
        />
        <input
          type="text"
          placeholder="Looking for a Pokemon?"
          autoFocus
          onChange={(event) => {
            const userInput = event.target.value.toLowerCase();
            setPokemonName(userInput);
            filterPokemon(userInput);
          }}
        />
        <button
          onClick={() => {
            searchPokemon(pokemonName);
          }}
        >
          Search Pokemon
        </button>
        {isPokemonChosen && (
          <button
            onClick={() => {
              setIsPokemonChosen(false);
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Show filtered Pokemons */}
      {filteredPokemonList.length > 0 && (
        <div className="OuterBox">
          <ul className="PossiblePokemons">
            {filteredPokemonList.map((poke, index) => (
              <li
                key={index}
                onClick={() => {
                  searchPokemon(poke.name);
                }}
              >
                {poke.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show detailed info */}
      {isPokemonChosen && (
        <div className="OuterBox">
          <div className="DisplaySection">
            <div className="PokemonImage">
              <img src={pokemon.img} alt={pokemon.name} />
            </div>
            <div className="PokemonInfo">
              <h2>{pokemon.name}</h2>
              <p>
                <b>Number: </b>
                {pokemon.id}
              </p>
              <p>
                <b>Type: </b>
                {pokemon.type}
              </p>
            </div>
          </div>

          <div className="NavigationButtons">
            <button onClick={handlePrevious} disabled={pokemon.id === 1}>
              Previous
            </button>
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
