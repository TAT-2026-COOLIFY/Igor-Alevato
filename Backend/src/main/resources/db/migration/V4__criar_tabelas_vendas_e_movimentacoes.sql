-- Tabela de Vendas
CREATE TABLE vendas (
    id BIGSERIAL PRIMARY KEY,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    usuarios_id BIGINT NOT NULL,
    CONSTRAINT fk_vendas_usuarios FOREIGN KEY (usuarios_id) REFERENCES usuarios(id)
);

CREATE TABLE itens_venda (
    id BIGSERIAL PRIMARY KEY,
    quantidade DECIMAL(10,2) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    vendas_id BIGINT NOT NULL,
    produtos_id BIGINT NOT NULL,
    CONSTRAINT fk_itens_venda_vendas FOREIGN KEY (vendas_id) REFERENCES vendas(id),
    CONSTRAINT fk_itens_venda_produtos FOREIGN KEY (produtos_id) REFERENCES produtos(id)
);

CREATE TABLE movimentacoes (
    id BIGSERIAL PRIMARY KEY,
    tipo_movimentacao VARCHAR(20) NOT NULL, -- 'ENTRADA' ou 'SAIDA'
    quantidade DECIMAL(10,2) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarios_id BIGINT NOT NULL,
    produtos_id BIGINT NOT NULL,
    CONSTRAINT fk_movimentacoes_usuarios FOREIGN KEY (usuarios_id) REFERENCES usuarios(id),
    CONSTRAINT fk_movimentacoes_produtos FOREIGN KEY (produtos_id) REFERENCES produtos(id)
);