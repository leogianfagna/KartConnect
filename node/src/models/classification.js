import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    peso: String,
    nome: String,
    tempo: String,
    estado: String,
    kartodromo: String,
});

const Classification = mongoose.model('Classification', Schema);

export default Classification;