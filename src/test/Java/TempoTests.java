import org.junit.jupiter.api.Test;

import grupopi4.kartconnect.model.Tempo;

import static org.junit.jupiter.api.Assertions.*;

class TempoTests {

    @Test
    void testRandomPorSegundosValido() throws Exception {
        Tempo randomTempo = Tempo.randomPorSegundos(100, 200); // 0 a 60 segundos
        assertNotNull(randomTempo);
        assertTrue(randomTempo.getMinutos() > 0 && randomTempo.getMinutos() < 60);
        assertTrue(randomTempo.getSegundos() >= 0 && randomTempo.getSegundos() < 60);
        assertTrue(randomTempo.getMilissegundos() >= 0 && randomTempo.getMilissegundos() < 1000);
    }

    @Test
    void testRandomPorSegundosMaximoNegativo() {
        Exception exception = assertThrows(Exception.class, () -> {
            Tempo.randomPorSegundos(20, -10); // Deve lançar exceção
        });
        assertTrue(exception.getMessage().contains("Segundos negativos"));
    }

    @Test
    void testRandomPorSegundosMinimoNegativo() {
        Exception exception = assertThrows(Exception.class, () -> {
            Tempo.randomPorSegundos(-200, 60); // Deve lançar exceção
        });
        assertTrue(exception.getMessage().contains("Segundos negativos"));
    }

    @Test
    void testRandomPorSegundosMinMaiorMax() {
        Exception exception = assertThrows(Exception.class, () -> {
            Tempo.randomPorSegundos(10, 5); // Deve lançar exceção
        });
        assertTrue(exception.getMessage().contains("Valor mínimo maior que máximo"));
    }

    @Test
    void testRandomPorSegundosMinMaxMesmo() throws Exception {
        Exception exception = assertThrows(Exception.class, () -> {
            Tempo.randomPorSegundos(666, 666); // Deve lançar exceção
        });
        assertTrue(exception.getMessage().contains("Valores não devem ser iguais"));
    }

    @Test
    void testRandomPorSegundosValorAlto() throws Exception {
        Tempo randomTempo = Tempo.randomPorSegundos(2147484, 2147485); //Retorna valor de número invalido, devido a overflow
        assertNotNull(randomTempo);
        assertFalse(randomTempo.getMinutos() > 0 && randomTempo.getMinutos() < 60);
        assertFalse(randomTempo.getSegundos() >= 0 && randomTempo.getSegundos() < 60);
        assertFalse(randomTempo.getMilissegundos() >= 0 && randomTempo.getMilissegundos() < 1000);
    }
}