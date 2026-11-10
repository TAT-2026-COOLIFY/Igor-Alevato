package com.estoque.backend.controller;

import com.estoque.backend.dto.EntradaEstoqueDTO;
import com.estoque.backend.dto.SaidaEstoqueDTO;
import com.estoque.backend.model.Movimentacao;
import com.estoque.backend.service.MovimentacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
@CrossOrigin(origins = "*")
public class MovimentacaoController {

    // Injeta o serviço responsável pelas regras de entrada e saída de estoque
    @Autowired
    private MovimentacaoService movimentacaoService;

    // Retorna o histórico completo de movimentações para os relatórios e gráficos
    @GetMapping
    public List<Movimentacao> listarTodas() {
        return movimentacaoService.listarTodas();
    }

    // Registra a chegada de mercadorias e soma a quantidade no estoque do produto
    @PostMapping("/entrada")
    public Movimentacao registrarEntrada(@RequestBody EntradaEstoqueDTO dto) {
        return movimentacaoService.registrarEntrada(dto);
    }

    // Registra a retirada de mercadorias e desconta a quantidade do estoque atual
    @PostMapping("/saida")
    public Movimentacao registrarSaida(@RequestBody SaidaEstoqueDTO dto) {
        return movimentacaoService.registrarSaida(dto);
    }
}