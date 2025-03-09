const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY?.trim();
const SPOONACULAR_API_URL = 'https://api.spoonacular.com/recipes';

if (!SPOONACULAR_API_KEY) {
    console.error('ERROR: Spoonacular API key is not set in .env file');
    process.exit(1);
}

// Search recipes by ingredients
app.get('/api/recipes/findByIngredients', async (req, res) => {
    try {
        const { ingredients } = req.query;
        if (!ingredients) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }

        console.log('Searching for ingredients:', ingredients);
        
        const url = `${SPOONACULAR_API_URL}/findByIngredients`;
        const response = await axios.get(url, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                ingredients,
                number: 12,
                ranking: 2,
                ignorePantry: true
            }
        });

        if (!response.data || response.data.length === 0) {
            return res.status(404).json({ message: 'No recipes found for these ingredients' });
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Error fetching recipes',
            details: error.response?.data || error.message 
        });
    }
});

// Get recipe details
app.get('/api/recipes/:id/information', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching details for recipe:', id);
        
        const response = await axios.get(`${SPOONACULAR_API_URL}/${id}/information`, {
            params: {
                apiKey: SPOONACULAR_API_KEY
            }
        });

        if (!response.data) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Error fetching recipe details',
            details: error.response?.data || error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('API Key:', SPOONACULAR_API_KEY.substring(0, 8) + '...');
}); 