package com.estoque.backend.controller;

import com.estoque.backend.dto.VendaDTO;
import com.estoque.backend.model.Venda;
import com.estoque.backend.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "*")
public class VendaController {

    // Injeta o serviço responsável pelo processamento de vendas
    @Autowired
    private VendaService vendaService;

    // Lista o histórico de todas as vendas realizadas
    @GetMapping
    public List<Venda> listarTodas() {
        return vendaService.listarTodas();
    }

    // Registra uma nova venda e seus respectivos itens
    @PostMapping
    public Venda realizarVenda(@RequestBody VendaDTO dto) {
        return vendaService.realizarVenda(dto);
    }
}