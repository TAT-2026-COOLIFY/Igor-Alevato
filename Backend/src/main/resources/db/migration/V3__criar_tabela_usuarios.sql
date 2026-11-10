CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(200) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    pode_gerenciar_produtos BOOLEAN NOT NULL DEFAULT false,
    pode_fazer_entrada BOOLEAN NOT NULL DEFAULT false,
    pode_fazer_saida BOOLEAN NOT NULL DEFAULT false,
    pode_gerenciar_usuarios BOOLEAN NOT NULL DEFAULT false,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);