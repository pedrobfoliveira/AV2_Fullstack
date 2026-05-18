CREATE DATABASE IF NOT EXISTS agenda_flow;

USE agenda_flow;

CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS espacos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    espaco_id INT NOT NULL,
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    status ENUM('agendado', 'confirmado', 'pendente', 'cancelado', 'concluido', 'bloqueado') DEFAULT 'agendado',
    observacao VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (espaco_id) REFERENCES espacos(id)
);

INSERT INTO clientes (nome, email, telefone) VALUES
('Ana Souza', 'ana@email.com', '71999990000'),
('Carlos Lima', 'carlos@email.com', '71988880000');

INSERT INTO espacos (nome, descricao) VALUES
('Sala 01', 'Sala para atendimento individual'),
('Sala 02', 'Sala para reuniões e consultas');

DELETE FROM agendamentos WHERE id > 0;
DELETE FROM clientes WHERE id > 0;

ALTER TABLE agendamentos AUTO_INCREMENT = 1;
ALTER TABLE clientes AUTO_INCREMENT = 1;

USE agenda_flow;
ALTER TABLE agendamentos
ADD COLUMN google_event_id VARCHAR(255),
ADD COLUMN google_event_link VARCHAR(500);

USE agenda_flow;

ALTER TABLE agendamentos
MODIFY cliente_id INT NULL;