const express = require('express')
const app = express();
app.use(express.json());

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pokemon_db',
    password: '12345',
    port: 5432,
});


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

// VIZUALIZAR TODOS OS POKEMONS
app.get('/pokemons', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pokemons');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Pokémons.' });
    }
});

// VIZUALIZAR POKEMON POR ID
app.get('/pokemons/:number', async (req, res) => {
    const { number } = req.params;
    try {
        const result = await pool.query('SELECT * FROM pokemons WHERE number = $1', [number]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pokémon não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Pokémon.' });
    }
});

// INSERIR POKEMON
app.post('/pokemons', async (req, res) => {
    const { number, name, types} = req.body;
    if (!name || !number || !types || !Array.isArray(types)) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios, e types deve ser um array não vazio.' });
    }
    const invalidTypes = types.filter(type => !Object.values(PokemonType).includes(type));
    if (invalidTypes.length > 0) {
        return res.status(400).json({ message: `Tipos de Pokémon inválidos: ${invalidTypes.join(', ')}` });
    }
    try {
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`;
        const result = await pool.query(
            'INSERT INTO pokemons (number, name, types, image) VALUES ($1, $2, $3, $4) RETURNING *',
            [number, name, types, imageUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar Pokémon.' });
    }
});

// ATUALIZAR POKEMON
app.put('/pokemons/:number', async (req, res) => {
    const { number } = req.params;
    const { name, types} = req.body;
    if (!name || !number || !types || !Array.isArray(types) || types.length === 0) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios, e types deve ser um array não vazio.' });
    }
    const invalidTypes = types.filter(type => !Object.values(PokemonType).includes(type));
    if (invalidTypes.length > 0) {
        return res.status(400).json({ message: `Tipos de Pokémon inválidos: ${invalidTypes.join(', ')}` });
    }
    try {
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`;
        const result = await pool.query(
            'UPDATE pokemons SET name = $1, number = $2, types = $3, image = $4 WHERE number = $2 RETURNING *',
            [name, number, types, imageUrl]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pokémon não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar Pokémon.' });
    }
});

// DELETAR POKEMON
app.delete('/pokemons/:number', async (req, res) => {
    const { number } = req.params;
    try {
        const result = await pool.query('DELETE FROM pokemons WHERE number = $1 RETURNING *', [number]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pokémon não encontrado.' });
        }
        res.status(200).json({ message: 'Pokémon deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover Pokémon.' });
    }
});

const port = 8000
app.listen(port , ()=>{
    console.log('Servidor rodando na porta 8000')
})