const express = require('express')
const app = express();
app.use(express.json());

const PokemonType = {
    FIRE: 'Fire',
    WATER: 'Water',
    GRASS: 'Grass',
    ELECTRIC: 'Electric',
    ICE: 'Ice',
    FIGHTING: 'Fighting',
    POISON: 'Poison',
    GROUND: 'Ground',
    FLYING: 'Flying',
    PSYCHIC: 'Psychic',
    BUG: 'Bug',
    ROCK: 'Rock',
    GHOST: 'Ghost',
    DARK: 'Dark',
    DRAGON: 'Dragon',
    STEEL: 'Steel',
    FAIRY: 'Fairy',
};

let pokemons = [];
let nextId = 1;

app.get('/pokemons', (req, res) => {
    res.json(pokemons);
});

app.get('/pokemons/:id', (req, res) => {
    const { id } = req.params;
    const pokemon = pokemons.find(p => p.id === parseInt(id));
    if (!pokemon) {
        return res.status(404).json({ message: 'Pokémon não encontrado.' });
    }
    res.json(pokemon);
});

app.post('/pokemons', (req, res) => {
    const { name, number, type, image } = req.body;
    if (!name || !number || !type || !image) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    if (!Object.values(PokemonType).includes(type)) {
        return res.status(400).json({ message: 'Tipo de Pokémon inválido.' });
    }
    const newPokemon = { id: nextId++, name, number, type, image };
    pokemons.push(newPokemon);
    res.status(201).json(newPokemon);
});

app.put('/pokemons/:id', (req, res) => {
    const { id } = req.params;
    const { name, number, type, image } = req.body;
    const pokemonIndex = pokemons.findIndex(p => p.id === parseInt(id));
    if (pokemonIndex === -1) {
        return res.status(404).json({ message: 'Pokémon não encontrado.' });
    }
    if (!name || !number || !type || !image) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    if (!Object.values(PokemonType).includes(type)) {
        return res.status(400).json({ message: 'Tipo de Pokémon inválido.' });
    }
    const updatedPokemon = { id: parseInt(id), name, number, type, image };
    pokemons[pokemonIndex] = updatedPokemon;
    res.json(updatedPokemon);
});

app.delete('/pokemons/:id', (req, res) => {
    const { id } = req.params;
    const pokemonIndex = pokemons.findIndex(p => p.id === parseInt(id));
    if (pokemonIndex === -1) {
        return res.status(404).json({ message: 'Pokémon não encontrado.' });
    }
    pokemons.splice(pokemonIndex, 1);
    res.status(204).send();
});

const port = 8000
app.listen(port , ()=>{
    console.log('Servidor rodando na porta 8000')
})