CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_venda DECIMAL(10,2) NOT NULL,
    quantidade_atual DECIMAL(10,2) NOT NULL DEFAULT 0,
    estoque_minimo DECIMAL(10,2) NOT NULL DEFAULT 0,
    tipo_unidade VARCHAR(10) NOT NULL,
    categorias_id BIGINT NOT NULL,
    CONSTRAINT fk_produtos_categorias FOREIGN KEY (categorias_id) REFERENCES categorias(id)
);