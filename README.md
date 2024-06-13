# Proyecto To-Do con Apollo Server, DynamoDB y TypeScript

Este proyecto es una aplicación de lista de tareas (To-Do) que utiliza Apollo Server con TypeScript y DynamoDB. La aplicación permite a los usuarios iniciar sesión, gestionar distintas tareas y asignar niveles de relevancia a las mismas. Además, se utiliza Docker para contenerizar la aplicación.

## Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características

- **Apollo Server**: Un servidor GraphQL para manejar consultas y mutaciones.
- **DynamoDB**: Base de datos NoSQL con diseño de tabla única (single table design).
- **TypeScript**: Un superconjunto de JavaScript que añade tipos estáticos.
- **Docker**: Contenerización de la aplicación para facilitar la implementación y el desarrollo.
- **To-Do List**: Gestión de tareas con niveles de relevancia y contenedor de tareas.
- **Autenticación**: Inicio de sesión de usuario.

## Requisitos

- Node.js (v14 o superior)
- Docker
- AWS CLI configurado (para acceso a DynamoDB)

## Instalación

1. Clona el repositorio:

    ```sh
    git clone https://github.com/tu-usuario/nombre-del-repo.git
    cd nombre-del-repo
    ```

2. Instala las dependencias:

    ```sh
    npm install
    ```

3. Configura las variables de entorno:

    Copia el archivo `.env.example` y renómbralo a `.env`. Luego, completa las variables necesarias.

## Uso

1. Inicia el servidor de desarrollo:

    ```sh
    npm run dev
    ```

2. La aplicación estará disponible en `http://localhost:4000`.

## Estructura del Proyecto

```plaintext
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── clientDynamo.ts
├── createJwt.ts
├── graphql
│   └── schema.graphql
├── index.ts
├── package.json
├── pnpm-lock.yaml
├── resolvers
│   ├── creations.ts
│   ├── deletes.ts
│   ├── querys.ts
│   └── updates.ts
├── tsconfig.json
├── types.ts
└── utils.ts
