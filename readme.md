# Análisis

## Requisitos
* NodeJS/TypeScript
* Debe tener persistencia (in memory o BBDD convencional)
* API HTTP con 3 endpoints
    * Add task
    * Mark task as done
    * List status (task + status)
* Dockerfile para build & execute

## Definition of Done
* considerarse lista para producción
* ser fácilmente extensible con nuevas funcionalidades
* incluir README con comentarios sobre qué partes (supuestos) se han incluido y qué partes se han omitido, así como el razonamiento detrás de los elementos implementados.

# Toma de Decisiones

## Modelo de datos
El modelo de datos es simple, tendriamos una entidad llamada tarea con las siguientes propiedades:
* Identificador: num o string si uuid, pero lo determinará la solución de BBDD que se use.
* Nombre: string
* Status: bool

## Servidor HTTP
Se va a implementar un server HTTP usando la librería Fastify por ser una solución robusta y simple de implementar.

## Persistencia
Por los requisitos cuadra una base de datos que sea ligera, preferiblemente NoSQL para no tener que definir un esquema rigido de cara a nuevas funcionalidades y fácil de instalar y configurar.
BBDD https://github.com/techfort/LokiJS

A tener en cuenta que no debemos hacer un hard-coupling entre los endpoints y la BBDD. Deberíamos usar un patrón estrategia para desacoplar el servidor HTTP de la solución de persistencia.

## Lenguaje
Se va a usar TypeScript para facilitar el desarrollo ya que es más friendly a la hora de implementar el paradigma de orientación a objetos, que es algo que haremos al usar patrones de diseño.

## Testing
Se van a hacer pruebas para comprobar los outputs del endpoint.

# Diseño

## Servidor HTTP

Va a implementar un modelo en capas separadas por responsabilidad.

* Capa Servidor: es la capa más externa que gestiona las requests, los endpoints y su conexión con el middleware.
* Capa Middleware: es la capa intermedia que interconecta la capa de servidor y persitencia. Permite hacer el manejo de datos que vienen en la request y prepararlos para la capa de persitencia.
* Capa de Persistencia: es la capa más interna que gestiona la conexión con la BBDD y permite abstraer el servidor HTTP de la solución de BBDD.

## Modelo BBDD