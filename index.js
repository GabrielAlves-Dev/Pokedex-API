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

let pokemons = [];
let nextId = 1;

app.get('/pokemons', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pokemons');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Pokémons.' });
    }
});

app.get('/pokemons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM pokemons WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pokémon não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Pokémon.' });
    }
});

app.post('/pokemons', async (req, res) => {
    const { name, number, type, image } = req.body;
    if (!name || !number || !type || !image) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO pokemons (name, number, type, image) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, number, type, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar Pokémon.' });
    }
});

app.put('/pokemons/:id', async (req, res) => {
    const { id } = req.params;
    const { name, number, type, image } = req.body;
    if (!name || !number || !type || !image) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    try {
        const result = await pool.query(
            'UPDATE pokemons SET name = $1, number = $2, type = $3, image = $4 WHERE id = $5 RETURNING *',
            [name, number, type, image, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pokémon não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar Pokémon.' });
    }
});

app.delete('/pokemons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM pokemons WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pokémon não encontrado.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover Pokémon.' });
    }
});

const port = 8000
app.listen(port , ()=>{
    console.log('Servidor rodando na porta 8000')
})