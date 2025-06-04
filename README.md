# Microsserviço de Reserva de Livros

### Trabalho realizado por:

- Alison Luiz da Silva - RA: 220332812

- André Fragalli Vassoler - RA: 22012716-2

- Diogo Tizolim Cedran - RA: 22014212-2

- Felipe Cesar Tomazoti de Souza - RA: 220199772

- Nathan Lisandro Toppa - RA: 220199712

- Vagner Rodrigues Calado Junior - RA: 220142962


## Visão Geral

Este sistema é composto por dois microsserviços independentes:
- **book-service**: Gerencia o cadastro e status dos livros.
- **reservation-service**: Gerencia as reservas de livros por usuários.

Cada serviço possui seu próprio banco de dados PostgreSQL, e a comunicação entre eles ocorre via HTTP (REST).

## Como Funciona

- O usuário cadastra livros pelo book-service.
- Para reservar um livro, o reservation-service consulta o book-service para verificar a disponibilidade.
- Se disponível, a reserva é criada e o status do livro é atualizado para "reservado".
- É possível listar reservas de um usuário e cancelar reservas, liberando o livro novamente.

## Como Rodar Localmente

1. **Pré-requisitos:**
   - Docker e Docker Compose instalados
   - Node.js e npm instalados

2. **Suba os bancos de dados:**
   ```bash
   docker-compose up -d
   ```

3. **Instale as dependências dos serviços:**
   ```bash
   cd book-service
   npm install
   cd ../reservation-service
   npm install
   ```

4. **Inicie os microsserviços:**
   - Em um terminal:
     ```bash
     cd book-service
     npm run start:dev
     ```
   - Em outro terminal:
     ```bash
     cd reservation-service
     npm run start:dev
     ```

## Endpoints Disponíveis

### Book Service (http://localhost:3002)
- `POST /books` - Criar um novo livro
- `GET /books` - Listar todos os livros
- `GET /books/:id` - Buscar livro por ID
- `PUT /books/:id` - Atualizar informações do livro
- `PATCH /books/:id/status` - Atualizar status do livro

### Reservation Service (http://localhost:3001)
- `POST /reservations` - Criar uma nova reserva
- `GET /reservations/user/:userId` - Listar reservas de um usuário
- `DELETE /reservations/:id` - Cancelar uma reserva
