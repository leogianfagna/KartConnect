import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    peso: String,
    nome: String,
    tempo: {
        minutos: Number,
        segundos: Number,
        milissegundos: Number,
        totalEmMs: Number
    },
    estado: String,
    kartodromo: String,
}, { versionKey: false } );

const Classification = mongoose.model('Classification', Schema);

export default Classification;