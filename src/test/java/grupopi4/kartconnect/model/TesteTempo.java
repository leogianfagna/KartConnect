package grupopi4.kartconnect.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TesteTempo {

    private Tempo tempo;

    @BeforeEach
    void setUp() throws Exception {
        tempo = new Tempo(1, 30, 500); // 1 minuto, 30 segundos, 500 milissegundos
    }

    @Test
    void testRandomPorSegundosMinimoNegativo() {
        Exception exception = assertThrows(Exception.class, () -> {
            Tempo.randomPorSegundos(-3, 10); // Deve lançar exceção
        });
        assertTrue(exception.getMessage().contains("Segundos negativos"));
    }

    @Test
    void testRandomPorSegundosMaximoNegativo() {
        Exception exception = assertThrows(Exception.class, () -> {
            Tempo.randomPorSegundos(10, -5); // Deve lançar exceção
        });
        assertTrue(exception.getMessage().contains("Segundos negativos"));
    }

    @Test
    void testRandomPorSegundosMinMaiorMax() {
        Exception exception = assertThrows(Exception.class, () -> {
            Tempo.randomPorSegundos(10, 5); // Deve lançar exceção
        });
        assertTrue(exception.getMessage().contains("Mínimo maior que máximo"));
    }

    @Test
    void testRandomPorSegundosValido() throws Exception {
        Tempo randomTempo = Tempo.randomPorSegundos(0, 60); // 0 a 60 segundos
        assertNotNull(randomTempo);
        assertTrue(randomTempo.getMinutos() >= 0 && randomTempo.getMinutos() < 1);
        assertTrue(randomTempo.getSegundos() >= 0 && randomTempo.getSegundos() < 60);
        assertTrue(randomTempo.getMilissegundos() >= 0 && randomTempo.getMilissegundos() < 1000);
    }

    @Test
    void testRandomPorSegundosValorAlto() throws Exception {
        Exception exception = assertThrows(Exception.class, () -> {
            Tempo.randomPorSegundos(10000, 20000);
        });

        Tempo randomTempo = Tempo.randomPorSegundos(10000, 20000);
        assertNotNull(randomTempo);
        assertTrue(randomTempo.getMinutos() >= 166 && randomTempo.getMinutos() < 333); // Verificando os minutos
        assertTrue(randomTempo.getSegundos() >= 0 && randomTempo.getSegundos() < 60); // Verificando segundos
        assertTrue(randomTempo.getMilissegundos() >= 0 && randomTempo.getMilissegundos() < 1000); // Verificando milissegundos

        exception = assertThrows(Exception.class, () -> {
            Tempo.randomPorSegundos(30000, 20000); // Mínimo maior que máximo deve lançar exceção
        });
        assertTrue(exception.getMessage().contains("Mínimo maior que máximo"));
    }

    @Test
    void testRandomPorSegundosMinMaxZero() throws Exception {
        Tempo randomTempo = Tempo.randomPorSegundos(0, 0); // 0 a 0 segundos
        assertNotNull(randomTempo);
        assertEquals(0, randomTempo.getMinutos());
        assertEquals(0, randomTempo.getSegundos());
        assertTrue(randomTempo.getMilissegundos() >= 0 && randomTempo.getMilissegundos() < 1000);
    }

    @Test
    void testRandomPorSegundosMinMaxMesmo() throws Exception {
        Tempo randomTempo = Tempo.randomPorSegundos(10, 10); // 10 a 10 segundos
        assertNotNull(randomTempo);
        assertEquals(0, randomTempo.getMinutos());
        assertEquals(10, randomTempo.getSegundos());
        assertTrue(randomTempo.getMilissegundos() >= 0 && randomTempo.getMilissegundos() < 1000);
    }
}