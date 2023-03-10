# Análisis

## Requisitos
* NodeJS/TypeScript
* Debe tener persistencia (in memory o BBDD convencional)
* API HTTP con 3 endpoints
    * Add task
    * Mark task as done
    * List status (task + status)
* Dockerfile para build & execute

## Definition of done
* considerarse lista para producción
* ser fácilmente extensible con nuevas funcionalidades
* incluir README con comentarios sobre qué partes (supuestos) se han incluido y qué partes se han omitido, así como el razonamiento detrás de los elementos implementados.

# Toma de decisiones

## Modelo de datos
El modelo de datos es simple, tendriamos una entidad llamada tarea con las siguientes propiedades:
* id: string
* name: string
* isDone: boolean

## Servidor HTTP
Se va a implementar un server HTTP usando la librería Fastify por ser una solución robusta y simple de implementar.

## Comunicaciones
Se elije usar el paradigma de API REST y llamadas a la API con la información en un body JSON.

## Persistencia
Por los requisitos, tiene sentido usar una base de datos que sea ligera, preferiblemente NoSQL para no tener que definir un esquema rigido de cara a nuevas funcionalidades y fácil de instalar y configurar.

Se ha escogido una BBDD documental in memory fácil de implantar: https://github.com/techfort/LokiJS

A tener en cuenta que no debemos hacer un hard-coupling entre los endpoints y la BBDD. Deberíamos usar un patrón estrategia para desacoplar el servidor HTTP de la solución de persistencia.

## Testing
Se implementarán tests end2end para comprobar el correcto funcionamiento del servicio.

## Lenguaje
Se va a usar TypeScript para facilitar el desarrollo ya que es más friendly a la hora de implementar el paradigma de orientación a objetos, que es algo que haremos al usar patrones de diseño.

## Docker
Se ha añadido un dockerfile y los comandos para construirlo y lanzarlo en el package.json de forma que no ocurra el famoso "en mi local funciona". Se ha usado una imagen alpine para que sea más ligera en la máquina donde se ejecute.

## Postman
Se añadirá una carpeta con la coleccion de requests de postman para poder probar los endpoints de forma sencilla.

# Diseño

## Servidor HTTP

Se aplica una estructura en capas asignando a cada capa una responsabilidad:

* Capa Servidor: es la capa más externa, expone los endpoints.
* Capa Rutas: es la capa a la que accede el servidor y que se comunica con el middleware. Su responsabilidad será configurar los endpoints.
* Capa Middleware: es la capa que interconecta los endpoints con la capa de persistencia. Su responsabilidad será la gestión de la petición.
* Capa de persistencia: es la capa más profunda, la que conecta el middleware con la solución de persistencia que se adopte. Su responsabilidad es abstraer a las capas superiores de la solución adoptada, gestionar la BBDD y transformar desde y hacia el modelo de datos de la BBDD las entidades. La capa de persitencia será implementada también como un singleton mezclado con patrón estrategia de forma que de cara a cambiar el tipo de BBDD, no haya que crear y destruir constantemente las conexiones. La parte de estrategia es en base a la variable de entorno DB_SOLUTION. En caso de indicarse una BBDD inexistente por env vars, la aplicación lanzará una excepción y finalizará la ejecución.

A su vez el microservicio estará protegido mediante una clave que deberá llevar en el header.

Se hará uso de los logs por defecto de Fastify para que de cara a futuro se pueda usar algún componente que los pueda recolectar y analizar.

## Modelo BBDD
BBDD NoSQL in memory que permita rápida iteración y modificación del modelo de datos.

Se creará una colección de tareas que contendrán documentos con el siguiente formato:
{
    id: string
    name: string
    isDone: boolean
}

## Contrato Endpoints
Se implementará un esquema JSON para comprobar que los datos introducidos son correctos.

### Securización
Todas las requests tienen que tener como cabecera el token de seguridad y clave. En caso de no poseerlo o ser incorrecto el servidor rechazará la request respondiendo con un 401.

### /add
Añade una tarea a la BBDD.

* POST
* headers: clave-seguridad: valor
* body (JSON): 
```
{
    "name": string
}
```
* response (JSON), statusCode: 201: inserción correcta, contiene el ID de la tarea creada:
```
{
    "Status": "Task created",
    "ID": "cef25720-a4b8-4c88-b029-5183c21a37d2"
}
```

### /done
Marca una tarea como hecha.
* POST
* headers: clave-seguridad: valor
* body (JSON): 
```
{
	"id": string
}
```
* response (JSON), statusCode: 404: ID no encontrado en la BBDD:
```
{
    "Status": "Task with ID 1bb3ca07-a51a-4d2b-b831-156df952caed not found"
}
```
* response (JSON), statusCode: 200: tarea marcada como finalizada:
```
{
    "Status": "Task with ID cef25720-a4b8-4c88-b029-5183c21a37d2 marked as done"
}
```

### /list
Muestra una lista de tareas con sus IDs, nombre y estado.

* POST
* headers: clave-seguridad: valor
* body: no necesita
* response (JSON), statusCode: 200: listado conseguido:
```
{
    "Status": "Task list",
    "Tasks": [
        "Task ID: cef25720-a4b8-4c88-b029-5183c21a37d2. Task 'Tarea 3'. Status: Done"
    ]
}
```


## Variables de Entorno
Se ha optado por añadir variables de entorno para así evitar hardcodear variables susceptibles a cambios según el entorno de despliegue y para posibilitar añadir valores sensibles como la clave de la API. Estas variables de entorno se podrían guardar en un secret manager (GCloud) de forma que estén completamente protegidas. El .env ha de contener las siguientes claves:

SERVER_PORT=

SERVER_HOST=

SERVER_SECURITY_HEADER=

SERVER_SECURITY_KEY=

DB_SOLUTION=

DB_LOCATION=

## Estructura del proyecto folders
```
.
├── Dockerfile
├── package.json
├── postman => Carpeta con la colección postman de las requests.
│   └── Challenge.postman_collection.json
├── readme.md
├── src
│   ├── config => Archivos para la configuración de los endpoints.
│   │   ├── endpoints.ts
│   │   └── schemas.ts
│   ├── index.ts => Entrypoint de la app, capa de servidor.
│   ├── middleware => Capa middleware.
│   │   ├── addTaskMiddleware.ts
│   │   ├── listTaskMiddleware.ts
│   │   └── markDoneMiddleware.ts
│   ├── persitence => Capa de persistencia.
│   │   ├── dbFactory.ts
│   │   └── loki.ts
│   ├── routes => Capa de rutas.
│   │   ├── addTaskRoute.ts
│   │   ├── listTaskRoute.ts
│   │   └── markDoneRoute.ts
│   ├── tests => Carpeta que contiene los tests e2e de la app.
│   ├── ts => Carpeta que contiene modelos e interfaces.
│   │   ├── interfaces
│   │   │   ├── db.interface.ts
│   │   │   └── task.interface.ts
│   │   └── models
│   │       └── task.model.ts
│   └── utils => Carpeta con archivos supletorios de utilidades.
│       └── utils.ts
└── tsconfig.json
```
# Ejecución

Requisito: tener docker instalado.

Basta con lanzar los siguientes comandos, estando en el root del proyecto:

```npm run build:docker```

```npm run start:docker```

Y ya se podrían lanzar requests a los endpoints a través de localhost:5000.

# Futuras Mejoras

## ESLint Precommit
Con ESLint podríamos asegurar la santadrización del código y adopción de buenas prácticas. Además si lo metemos en el hook de precommit de git, obligamos a que solo se pueda subir código que implemente esos estándares de calidad.

## CICD
Un flujo de CICD que buildease la webapp y la expusiese en algún endpoint.

## Métricas
Si fuese desplegado en un CloudRun o equivalente de Google Cloud, podrían obtenerse métricas del rendimiento de la webapp, llamadas a los endpoints, etc...

## Herramienta de documentación
Habría que generar una documentación de forma automatizada con el CICD a raíz de los comentarios que hay en código.

# Referencias
* https://www.fastify.io/docs/latest
* https://github.com/techfort/LokiJS
* https://nodejs.org/en/docs/guides/nodejs-docker-webapp/