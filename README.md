# Proyecto3DelilahResto

Esta API le permitirá interactuar con nuestro restaurante Grillo de comída típica colombiana. Usted podrá registrarse, ver el listado de nuestros productos y realizar uno o varios pedidos. El administrador podrá recibir y actualizar el estado de los pedidos al igual que podrá actualizar, crear y eliiminar órdenes y usuarios.


Recursos y tecnologías utilizadas:

-	Nodemon
-	Node.js
-	JWT para autenticación via Token
-	Express
-	Sequelize
-	MySQL
-	Postman para manejo de testing & endpoints
-	Swagger para documentación de API

Documentación de la API:

Abrir el archivo documentation.yaml y copiar su contenido en Swagger.

Inicio del Proyecto

#1 Clonar el repositorio:

git clone https://github.com/Magalygv/prioyecto3-delilahexports.git

#2. Instalar dependencias

dotenv
express
jsonwebtoken
mysql
mysql2
helmet
sequelize

#3 Crear base de datos

•	Abrir XAMPP y sobre el puerto 3306 ejecutar los servicios de Apache y MySQL.
•	Abrir (admin) del servicio MySQL.
•	Generar una nueva Base de datos: db_restaurantegrillo desde el panel de control.
•	Abrir el archivo en bd.sql y dentro del panel de control de la base de datos ejecutar la serie de queries del archivo.

#4 Iniciando el servidor
Abrir archivo desde la consola en nodemon server.js

Por último:
Ejecutar los endpoints desde postman para poder hacer uso de la API y base de datos.
