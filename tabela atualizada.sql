CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    sexo CHAR(1),
    dt_nascimento DATE,
    tipo VARCHAR(20),
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE Turma (
    id_turma SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    turno VARCHAR(20),
    serie_ano VARCHAR(20),
    ano_letivo INT
);

CREATE TABLE Aluno (
    id_aluno SERIAL PRIMARY KEY,
    idUsuario INT NOT NULL,
    idTurma INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (idTurma) REFERENCES Turma(id_turma)
);

CREATE TABLE Professor (
    id_professor SERIAL PRIMARY KEY,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Secretaria (
    id_secretaria SERIAL PRIMARY KEY,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Disciplina (
    id_disciplina SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE Turma_disciplina (
    idTurma INT NOT NULL,
    idDisciplina INT NOT NULL,
    PRIMARY KEY (idTurma, idDisciplina),
    FOREIGN KEY (idTurma) REFERENCES Turma(id_turma),
    FOREIGN KEY (idDisciplina) REFERENCES Disciplina(id_disciplina)
);

CREATE TABLE Professor_disciplina (
    idProfessor INT NOT NULL,
    idDisciplina INT NOT NULL,
    PRIMARY KEY (idProfessor, idDisciplina),
    FOREIGN KEY (idProfessor) REFERENCES Professor(id_professor),
    FOREIGN KEY (idDisciplina) REFERENCES Disciplina(id_disciplina)
);

CREATE TABLE Turma_professor (
    id_professor INT NOT NULL,
    idTurma INT NOT NULL,
    PRIMARY KEY (id_professor, idTurma),
    FOREIGN KEY (id_professor) REFERENCES Professor(id_professor),
    FOREIGN KEY (idTurma) REFERENCES Turma(id_turma)
);

CREATE TABLE Nota (
    id_nota SERIAL PRIMARY KEY,
    valor DECIMAL(5,2),
    dt_lancamento DATE,
    idAluno INT NOT NULL,
    idDisciplina INT NOT NULL,
    FOREIGN KEY (idAluno) REFERENCES Aluno(id_aluno),
    FOREIGN KEY (idDisciplina) REFERENCES Disciplina(id_disciplina)
);

CREATE TABLE Falta (
    id_falta SERIAL PRIMARY KEY,
    justificada BOOLEAN,
    idAluno INT NOT NULL,
    idDisciplina INT NOT NULL,
    FOREIGN KEY (idAluno) REFERENCES Aluno(id_aluno),
    FOREIGN KEY (idDisciplina) REFERENCES Disciplina(id_disciplina)
);

CREATE TABLE Presenca (
    id_presenca SERIAL PRIMARY KEY,
    presente BOOLEAN,
    idAluno INT NOT NULL,
    idDisciplina INT NOT NULL,
    FOREIGN KEY (idAluno) REFERENCES Aluno(id_aluno),
    FOREIGN KEY (idDisciplina) REFERENCES Disciplina(id_disciplina)
);

CREATE TABLE Ausencia (
    id_ausencia SERIAL PRIMARY KEY,
    data DATE,
    motivo TEXT,
    idProfessor INT NOT NULL,
    FOREIGN KEY (idProfessor) REFERENCES Professor(id_professor)
);

CREATE TABLE Calendario (
    id_calendario SERIAL PRIMARY KEY
);

CREATE TABLE Evento (
    id_evento SERIAL PRIMARY KEY,
    titulo VARCHAR(100),
    descricao TEXT,
    data DATE,
    tipo VARCHAR(50),
    idSecretaria INT NOT NULL,
    idCalendario INT NOT NULL,
    FOREIGN KEY (idSecretaria) REFERENCES Secretaria(id_secretaria),
    FOREIGN KEY (idCalendario) REFERENCES Calendario(id_calendario)
);

ALTER TABLE Usuario ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
ALTER TABLE Turma ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
