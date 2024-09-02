# 😎 Back-end da aplicação InfluenceHub

###

<br>

O projeto InfluenceHub consiste em uma API desenvolvida para simplificar a gestão de influenciadores e marcas. Com recursos que permitem criar, visualizar, atualizar e relacionar influenciadores e marcas de acordo com nichos, a plataforma visa aumentar a produtividade e a buscar o influenciador digital adequado para promover sua marca.

Para uma experiência completa, siga o passo-a-passo abaixo para iniciar o servidor e, depois, inicie a [interface front-end](https://github.com/rafittu/front-influence-hub) para interagir com a API!

<br>

## Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **Node.js** com framework **NestJS** e **TypeScript**;
- **Prisma ORM** para comunicação e manipulação do banco de dados **SQLite**;

- **Passport.js** para implementação de estratégias de autenticação;
- **JWT** para autenticação e autorização de acesso;
- **Bcrypt** e **Crypto** como ferramenta de criptografia;

- **Helmet** para configuração segura dos cabeçalhos HTTP;
- **CORS** para controle de acesso à API;
- **Docker** como uma ferramenta de containerização;
- **Jest** para execução e automação dos testes unitários;

<br>

## Funcionalidades
### Autenticação:
- Cadastro, login e logout de administradores.

### Gerenciamento de Influenciadores:
- Cadastro, listagem, visualização e edição de influenciadores.
- Preenchimento automático de endereço usando a API do [ViaCEP](https://viacep.com.br/).
- Filtros avançados para busca de influenciadores por nicho, alcance, cidade.

### Gerenciamento de Marcas:
- Cadastro, listagem, visualização e edição de marcas.

### Relacionamento Influenciador-Marca:
- Associação de influenciadores a marcas.
- Listagem de influenciadores de determinada marca.
- Identificação de nichos em comum entre influenciadores e marcas.

<br>

### 🚧 Futuras implementações:
- Ampliação de endpoints para gerenciar administradores, influenciadores e marcas;
    - listar, atualizar e excluir administradores;
    - desassociar influenciadores e marcas da plataforma;
  
- Endpoint para autenticação dos representantes de marcas;
    - representantes devem ser capazes de acessar o portfólio de influenciadores, além de atualizar informações cadastrais.
- Refatoração do código;
- Ampliação dos testes unitários;
- Documentação Swagger;

<br>

## Configuração do Projeto

### Requisitos para rodar a aplicação

- NodeJs (versão 18.x ou superior);
- Docker e Docker Compose;


### Instalação

1. Clonando o repositório:

```bash
$ git clone git@github.com:rafittu/back-influence-hub.git
$ cd back-influence-hub
```

2. Crie um arquivo `.env` na raiz do projeto e preencha as informações de acordo com o arquivo `.env.example` disponível.

3. Inicie o ambiente de desenvolvimento:

```bash
$ docker-compose up --build
```


### Testes

Para executar os testes unitários, utilize o seguinte comando:

```bash
$ npm run test
```

<br>

## Endpoints Principais
### Administradores:

- **`POST /admin/signup`:** Criar um novo administrador;
  ```
  {
    "name": "John Doe",
    "email": "john@doe.com",
    "password": "@Senha123",
    "passwordConfirmation": "@Senha123"
  }
  ```

- **`POST /signin`:** Login de administradores;
    * **Corpo da requisição:**
  ```
  {
    "email": "john@doe.com",
    "password": "@Senha123",
  }
  ```
   * **Resposta:**
  ```
  {
    "accessToken": "jwt.access.token.2024",
  }
  ```
  **O accessToken retornado na requisição de login deve ser utilizado no campo `Authorization` no formato `Bearer accessToken` dentro do cabeçalho Header para futuras operações na plataforma.**

- **`GET /me`:** Extrair usuário do accessToken enviado no `Header` da requisição;
  ```
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@doe.com"
    }
  ```
  
<br>

### Influenciadores:

- **`POST /influencer/create`:** Criar um novo influenciador;
  ```
  {
    "name": "Juju do Pix",
    "username": "jupix",
    "email": "judopix@bc.com",
    "niches": ["Artes", "Beleza & Maquiagem"],
    "reach": 150900,
    "photo": "http://example.com/photo.bucket.aws.com",
    "zipCode": "12345-678",
    "street": "Ezequiel Dias",
    "number": "45"
  }
  ```

- **`GET /influencer/all`:** Lista todos os influenciadores;
- **`GET /influencer/filter`:** Lista influenciadores por filtros;
  1. Filtros devem ser usados como `@Query()` nas requisições. Opções disponíveis:
     - reachMin
     - reachMax
     - niche
     - city
- **`GET /influencer/:id`:** Detalhes de um influencer;
- **`PATCH /influencer/:id`:** Editar um influenciador;

<br>

### Marcas:

- **`POST /brand/create`:** Criar uma nova marca;
  ```
  {
    "name": "M5",
    "description": "boom your style",
    "niches": ["Artes", "Beleza & Maquiagem"]
  }
  ```

- **`GET /brand/`:** Lista todas as marcas;
- **`GET /brand/:id`:** Detalhes de uma marca;
  ```
    {
    "id": 1,
    "name": "M5",
    "description": "booom your style",
    "niches": [
      "Artes",
      "Beleza & Maquiagem"
    ],
    "createdAt": "2024-08-31T17:33:28.555Z",
    "updatedAt": "2024-08-31T17:34:40.531Z"
    }
  ```
- **`PATCH /brand/:id`:** Editar dados de uma marca;

<br>

### Associações:

- **`POST /brand/associate-influencer`:** Associa um influenciador a uma marca e retorna os nichos em comum. O `id` do influenciador e da marca devem ser passados como `@Query()` na requisição respectivamente como `influencerId` e `brandId`;
  ```
  {
    "id": 10,
    "influencerId": 1,
    "brandId": 2,
    "createdAt": "2024-09-01T13:18:53.067Z",
    "updatedAt": "2024-09-01T13:18:53.067Z",
    "influencer": {
      "id": 1,
      "name": "Juju do Pix",
      "username": "jupix",
      "reach": 150900
    },
    "brand": {
      "id": 2,
      "name": "M5",
      "description": "boom your style"
    },
    "commonNiches": [
      "Artes",
      "Beleza & Maquiagem"
    ]
  }
  ```

- **`GET /brand/influencers/by-brand`:** Lista todas os influenciadores de determinada marca. O nome da marca deve ser passado na `@Query()` da requisição como `brand`;

<br>

##

<p align="right">
  <a href="https://www.linkedin.com/in/rafittu/">Rafael Ribeiro 🚀</a>
</p>
