CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    sexo VARCHAR(15),
    data_nascimento DATE,
    tipo_usuario VARCHAR(20) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE turma (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    turno VARCHAR(20),
    serie_ano VARCHAR(20),
    ano_letivo INT,
    ativa BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE aluno (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    turma_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES turma(id) ON DELETE RESTRICT
);

CREATE TABLE professor (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE secretaria (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE disciplina (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);


CREATE TABLE turma_disciplina (
    turma_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    PRIMARY KEY (turma_id, disciplina_id),
    FOREIGN KEY (turma_id) REFERENCES turma(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE CASCADE
);


CREATE TABLE professor_disciplina (
    professor_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    PRIMARY KEY (professor_id, disciplina_id),
    FOREIGN KEY (professor_id) REFERENCES professor(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE CASCADE
);

CREATE TABLE turma_professor (
    professor_id INT NOT NULL,
    turma_id INT NOT NULL,
    PRIMARY KEY (professor_id, turma_id),
    FOREIGN KEY (professor_id) REFERENCES professor(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES turma(id) ON DELETE CASCADE
);

CREATE TABLE nota (
    id SERIAL PRIMARY KEY,
    valor DECIMAL(5,2) CHECK (valor >= 0 AND valor <= 100),
    data_lancamento DATE DEFAULT CURRENT_DATE,
    aluno_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE RESTRICT
);

CREATE TABLE falta (
    id SERIAL PRIMARY KEY,
    data_falta DATE NOT NULL,
    justificada BOOLEAN DEFAULT FALSE,
    descricao_justificativa TEXT,
    aluno_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (aluno_id, disciplina_id, data_falta),
    FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE RESTRICT
);

CREATE TABLE presenca (
    id SERIAL PRIMARY KEY,
    data_aula DATE NOT NULL,
    presente BOOLEAN NOT NULL,
    aluno_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (aluno_id, disciplina_id, data_aula),
    FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE RESTRICT
);

CREATE TABLE ausencia_professor (
    id SERIAL PRIMARY KEY,
    data_ausencia DATE NOT NULL,
    motivo TEXT,
    professor_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES professor(id) ON DELETE CASCADE
);

CREATE TABLE calendario (
    id SERIAL PRIMARY KEY,
    ano_letivo INT NOT NULL,
    descricao VARCHAR(255),
    data_inicio DATE,
    data_fim DATE
);

CREATE TABLE evento (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_evento TIMESTAMP NOT NULL,
    tipo_evento VARCHAR(50),
    secretaria_id INT,
    calendario_id INT NOT NULL,
    FOREIGN KEY (secretaria_id) REFERENCES secretaria(id) ON DELETE SET NULL,
    FOREIGN KEY (calendario_id) REFERENCES calendario(id) ON DELETE CASCADE
);