# Sea Tecnologia - Frontend Web

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Este é o módulo **Frontend** desenvolvido para o desafio técnico da Sea Tecnologia. Trata-se de uma Single Page Application (SPA) robusta construída com React e Vite, focada em performance, segurança e uma Experiência de Usuário (UX) premium.

O sistema consome uma API RESTful em Spring Boot e gerencia a autenticação, controle de acesso e operações de CRUD de Clientes e Usuários através de uma interface moderna baseada no conceito de *Glassmorphism*.

---

## Principais Funcionalidades

* **Autenticação e Segurança:** Login integrado com JWT (JSON Web Tokens). O token e as *claims* (permissões) são decodificados no cliente para gerenciar sessões.
* **Proteção de Rotas (Private Routes):** Acesso restrito a áreas do painel dependendo do estado de autenticação do usuário.
* **Controle de Acesso (RBAC):** Renderização condicional de componentes e rotas (ex: a tela de gerenciamento de usuários é exclusiva para perfil `ROLE_ADMIN`).
* **UI/UX Premium (Glassmorphism):** Interface translúcida, limpa e moderna.
* **Feedback Visual Avançado:** * Notificações flutuantes elegantes com `react-hot-toast`.
  * Modais de confirmação de ações críticas com `sweetalert2`.
* **Gestão de Clientes:** Listagem, cadastro, edição e exclusão de clientes, com formatação e validação de dados.
* **Gestão de Usuários:** Administração de acessos ao sistema (Criação e revogação de credenciais).

---

## Tecnologias Utilizadas

A aplicação foi desenvolvida utilizando o ecossistema moderno do React:

* **[React](https://react.dev/):** Biblioteca para construção da interface de usuário.
* **[Vite](https://vitejs.dev/):** Bundler extremamente rápido para desenvolvimento.
* **[React Router DOM](https://reactrouter.com/):** Gerenciamento de rotas e navegação da SPA.
* **[Axios](https://axios-http.com/):** Cliente HTTP para requisições à API REST.
* **[React Hot Toast](https://react-hot-toast.com/):** Biblioteca leve para notificações (Toasts).
* **[SweetAlert2](https://sweetalert2.github.io/):** Substituição moderna para pop-ups nativos do navegador.

---

## Estrutura de Diretórios

A arquitetura do projeto foi pensada para ser escalável e de fácil manutenção:

```text
src/
├── assets/             # Imagens, logotipos e recursos estáticos
├── components/         # Componentes globais e reutilizáveis (ex: Header)
├── pages/              # Páginas principais da aplicação (Login, Clientes, Usuarios)
├── RotasPrivadas/      # Lógica de proteção e controle de acesso de rotas
├── services/           # Configuração do Axios e chamadas à API (api.js)
├── App.jsx             # Componente raiz e configuração do Toaster
└── main.jsx            # Ponto de entrada da aplicação Vite

```

---

## Como Utilizar o Sistema

A experiência de uso é guiada pelo nível de acesso (permissão) de quem faz o login:

### 1. Tela de Login

* Insira seu e-mail corporativo e senha. O sistema valida as credenciais com o Backend e, em caso de sucesso, armazena o token JWT para manter a sessão ativa, redirecionando você para o painel.

### 2. Visão de Usuário Padrão (`ROLE_USER`)

* **Listagem:** O usuário tem acesso apenas de **leitura** ao Painel de Clientes (ID, Nome, CPF e Cidade/UF).
* **Segurança:** Botões de criação, edição, exclusão e a aba de gestão de usuários são invisíveis e bloqueados, garantindo a integridade dos dados.

### 3. Visão de Administrador (`ROLE_ADMIN`)

* **Gestão de Clientes:** Acesso total. Pode criar novos clientes via formulário completo, editar dados existentes e excluir clientes (ação protegida por um modal de confirmação).
* **Gestão de Acessos:** Acesso à área restrita clicando em **"🛡️ Gerenciar Usuários"**. Aqui, o administrador lista todas as contas, pode criar novos acessos definindo permissões e revogar credenciais imediatamente via botão "Excluir".

### 4. Navegação Global

* O logotipo da empresa no cabeçalho fixo funciona como um botão **Home** interativo. Um clique em qualquer tela do painel recarrega a listagem inicial com fluidez.

---

## Como Executar o Projeto na Sua Máquina

Para rodar esta interface, você precisará ter o [Node.js](https://nodejs.org/) (versão 16 ou superior) instalado no seu computador.

**Passo a passo:**

1. **Clone este repositório:**
```bash
git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO_FRONTEND.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO_FRONTEND.git)

```


2. **Acesse a pasta do projeto:**
```bash
cd nome-da-pasta-do-frontend

```


3. **Instale as dependências do projeto:**
```bash
npm install

```


4. **Inicie o servidor local:**
```bash
npm run dev

```


5. **Acesse no Navegador:**
O terminal exibirá um link (geralmente `http://localhost:5173/`). Copie e cole no seu navegador.

> **⚠️ IMPORTANTE:** Para que o login e o fluxo de dados funcionem corretamente, certifique-se de que o **Backend (Spring Boot)** já esteja em execução na sua máquina, preferencialmente na porta `8080`.

---

## Integração com a API

Certifique-se de que o arquivo `src/services/api.js` está apontando para a base URL correta do seu backend. Por padrão, ele espera que a API do Spring Boot esteja rodando em:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080' // Ajuste de acordo com a porta do seu backend
});

export default api;

```

---

## 👨‍💻 Autor

Desenvolvido por **Caio Victor**.

