import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    email: String,
    endereco: String,
    nome: String,
    telefone: String,
    whatsapp: String,
    desc: String,
    horario_funcionamento: String,
});

const Kart_Track = mongoose.model('Kart_Track', Schema);

export default Kart_Track;