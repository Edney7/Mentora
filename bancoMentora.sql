CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    CPF VARCHAR(14) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Sexo CHAR(1),
    Dt_nascimento DATE,
    Tipo VARCHAR(20),
    Senha VARCHAR(255) NOT NULL
);
 
CREATE TABLE Turma (
    id_turma INT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Turno VARCHAR(20),
    serie_ano VARCHAR(20),
    ano_letivo INT
);
 
CREATE TABLE Aluno (
    id_aluno INT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idTurma INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (idTurma) REFERENCES Turma(id_turma)
);
 
CREATE TABLE Professor (
    id_professor INT PRIMARY KEY,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id_usuario)
);
 
CREATE TABLE Secretaria (
    id_secretaria INT PRIMARY KEY,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id_usuario)
);
 
CREATE TABLE Disciplina (
    id_disciplina INT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Descricao TEXT
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
    id_nota INT PRIMARY KEY,
    Valor DECIMAL(5,2),
    Dt_lancamento DATE,
    idAluno INT NOT NULL,
    idDisciplina INT NOT NULL,
    FOREIGN KEY (idAluno) REFERENCES Aluno(id_aluno),
    FOREIGN KEY (idDisciplina) REFERENCES Disciplina(id_disciplina)
);
 
CREATE TABLE Falta (
    id_falta INT PRIMARY KEY,
    Justificada BOOLEAN,
    idAluno INT NOT NULL,
    idDisciplina INT NOT NULL,
    FOREIGN KEY (idAluno) REFERENCES Aluno(id_aluno),
    FOREIGN KEY (idDisciplina) REFERENCES Disciplina(id_disciplina)
);
 
CREATE TABLE Presenca (
    id_presenca INT PRIMARY KEY,
    Presente BOOLEAN,
    idAluno INT NOT NULL,
    idDisciplina INT NOT NULL,
    FOREIGN KEY (idAluno) REFERENCES Aluno(id_aluno),
    FOREIGN KEY (idDisciplina) REFERENCES Disciplina(id_disciplina)
);
 
CREATE TABLE Ausencia (
    id_ausencia INT PRIMARY KEY,
    Data DATE,
    Motivo TEXT,
    idProfessor INT NOT NULL,
    FOREIGN KEY (idProfessor) REFERENCES Professor(id_professor)
);

CREATE TABLE Calendario (
    id_calendario INT PRIMARY KEY
);
 
CREATE TABLE Evento (
    id_evento INT PRIMARY KEY,
    titulo VARCHAR(100),
    Descricao TEXT,
    Data DATE,
    Tipo VARCHAR(50),
    idSecretaria INT NOT NULL,
    idCalendario INT NOT NULL,
    FOREIGN KEY (idSecretaria) REFERENCES Secretaria(id_secretaria),
    FOREIGN KEY (idCalendario) REFERENCES Calendario(id_calendario)
);
 