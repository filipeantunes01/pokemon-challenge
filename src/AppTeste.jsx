import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [pokemonName, setPokemonName] = useState(""); // Nome ou parte do nome do Pokémon
  const [isPokemonChosen, setIsPokemonChosen] = useState(false); // Verifica se um Pokémon foi escolhido
  const [pokemon, setPokemon] = useState({}); // Armazena os dados do Pokémon selecionado
  const [pokemonList, setPokemonList] = useState([]); // Lista completa de Pokémon
  const [filteredPokemonList, setFilteredPokemonList] = useState([]); // Lista de Pokémon filtrados

  // Buscar a lista de Pokémon quando a aplicação é carregada
  useEffect(() => {
    Axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000") // Obtém os primeiros 1000 Pokémon
      .then((response) => {
        setPokemonList(response.data.results); // Armazena a lista completa de Pokémon
      })
      .catch((error) => {
        console.error("Erro ao carregar a lista de Pokémon:", error);
      });
  }, []);

  // Função para buscar dados de um Pokémon pelo nome ou ID
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
        setFilteredPokemonList([]); // Limpa a lista filtrada após a escolha de um Pokémon
      })
      .catch(() =>
        alert("Não conseguimos encontrar o Pokémon que está à procura!")
      );
  };

  // Função para filtrar a lista de Pokémon com base no nome parcial
  const filterPokemon = (input) => {
    return pokemonList.filter((poke) =>
      poke.name.toLowerCase().includes(input.toLowerCase())
    );
  };

  // Função para lidar com os botões "Anterior" e "Próximo"
  const handlePrevious = () => {
    if (pokemon.id > 1) {
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
          placeholder="Procura um Pokémon?"
          autoFocus
          onChange={(event) => {
            const userInput = event.target.value.toLowerCase();
            setPokemonName(userInput);
            const filteredPokemons = filterPokemon(userInput);
            setFilteredPokemonList(filteredPokemons);
          }}
        />
        <button onClick={() => searchPokemon(pokemonName)}>
          Pesquisar Pokémon
        </button>
        {isPokemonChosen && (
          <button
            onClick={() => {
              setIsPokemonChosen(false);
              setPokemonName("");
            }}
          >
            Limpar
          </button>
        )}
      </div>
      {/* Mostrar a lista de Pokémon filtrados */}
      {filteredPokemonList.length > 0 && (
        <ul className="PokemonSuggestions">
          {filteredPokemonList.map((poke, index) => (
            <li key={index} onClick={() => searchPokemon(poke.name)}>
              {poke.name}
            </li>
          ))}
        </ul>
      )}
      {/* Mostrar detalhes do Pokémon escolhido */}
      {isPokemonChosen && (
        <div className="DisplaySection">
          <div className="PokemonImage">
            <img src={pokemon.img} alt={pokemon.name} />
          </div>
          <div className="PokemonInfo">
            <h2>{pokemon.name}</h2>
            <p>
              <b>Número: </b>
              {pokemon.id}
            </p>
            <p>
              <b>Tipo: </b>
              {pokemon.type}
            </p>
          </div>
          <div className="NavigationButtons">
            <button onClick={handlePrevious} disabled={pokemon.id === 1}>
              Anterior
            </button>
            <button onClick={handleNext}>Próximo</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
