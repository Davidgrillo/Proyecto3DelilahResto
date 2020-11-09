CREATE DATABASE DB_RESTAURANTEGRILLO;

-- Table Creation
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR (60) NOT NULL,
  password VARCHAR (60) NOT NULL,
  full_name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  phone INT NOT NULL,
  delivery_address VARCHAR (60) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  is_disabled BOOLEAN DEFAULT FALSE
);

-- Populate users table
INSERT INTO
  users
VALUES
  (NULL,"david","davidgrillo","David Grillo Colacho","grillo@gmail.com",320356,"San Antonio de Prado",TRUE,FALSE),
  (NULL,"bruno","brunofernandez","Bruno Fernandez Da Silva","bruno@radiohead.com",218956,"Dubai calle 23",FALSE,FALSE),
  (NULL,"javier","javierhernandez","Javier Hernandez Belalcazar","chicharo@gmail.com",324789,"Dubai por la calle 10",FALSE,FALSE),
  (NULL,"sandra","sandrarodriguez","Sandra Janeth Rodríguez Munera","sandraro@gmail.com",698745,"Camacol por Old Trafford",FALSE,FALSE),
  (NULL,"degea","daviddegea","David De Gea Suarez","daviddegea@gmail.com",288789,"Medellin Centro el Palo",FALSE,FALSE),
  (NULL,"ruud","ruudvannistelroy","Ruud Van Nistelroy","ruud10@gmail.com",326558,"Caldas calle 30 no 34",FALSE,FALSE),
  (NULL,"daniel","waynerooney","Wayne Rooney Mccallister","rooney10a@gmail.com",411121,"Amaga por la loma de abajo",FALSE,FALSE),
  (NULL,"merlanis","merlanismachu","Merlanis Machuca Reloat","merlanismachu@gmail.com",444789,"Caldas calle 14",FALSE,FALSE);
   
CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR (60) NOT NULL,
  price FLOAT NOT NULL,
  img_url VARCHAR(200) NOT NULL,
  description VARCHAR(150) NOT NULL,
  is_disabled BOOLEAN DEFAULT FALSE
);

-- Populate products table
INSERT INTO
  products
VALUES
  (NULL,"Empanadas Antioqueñas",360,"https://via.placeholder.com/732","Empanadas de papa acompañadas de ají",FALSE),
  (NULL,"Chicharrón",300,"https://via.placeholder.com/237","Entero o picado, servido con patacón y arepa",FALSE),
  (NULL,"Ceviche de Chicharrón",265,"https://via.placeholder.com/200","En ají de tomate de árbol y cebolla morada, con chips de plátano",FALSE),
  (NULL,"Entrada Típica",60,"https://via.placeholder.com/666","Chicharrón, chorizo, morcilla, patacón y arepa, con hogao y limón (para 1-4 personas)",FALSE),
  (NULL,"Crema de Maíz",400,"https://via.placeholder.com/444","Deliciosa crema de maíz, el ingrediente más importante de nuestros antepasados y de la cultura paisa",FALSE),
  (NULL,"Crema de Champiñones",450,"https://via.placeholder.com/999","La tradicional crema de champiñones de Grillo",FALSE),
  (NULL,"Sudado de Posta",450,"https://via.placeholder.com/999","LSudado de posta con salsa de carne, papa y yuca. servida con aguacate y arroz blanco",FALSE),
  (NULL,"Posta Negra Cartagenera",450,"https://via.placeholder.com/999","Servida con arroz con coco, plátanos confitados y una fresca ensalada",FALSE),
  (NULL,"Lengua en salsa de Carne",450,"https://via.placeholder.com/888","Sudado de Lengua servida con papa, yuca, arroz y aguacate",FALSE);
  
CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  status VARCHAR(60) NOT NULL,
  date DATETIME NOT NULL,
  description VARCHAR(150) NOT NULL,
  payment_method VARCHAR (60) NOT NULL,
  total FLOAT NOT NULL,
  user_id INT NOT NULL DEFAULT "0",
  is_disabled BOOLEAN DEFAULT FALSE,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

-- Populate orders table
INSERT INTO
  orders
VALUES
  (NULL,"delivered",NOW(),"1x EmpAnt, 1x CremChamp","card",400,7,FALSE),
  (NULL,"canceled",NOW(),"3x Chi, 2x Cev Chi","card",300,3,FALSE),
  (NULL,"sending",NOW(),"2x SudPost","cash",250,4,FALSE),
  (NULL,"preparing",NOW(),"4x PostNeg","cash",400,5,FALSE),
  (NULL,"confirmed",NOW(),"5x LengSal","card",460,3,FALSE),
  (NULL,"new",NOW(),"3x EmpAnt, 1X Crem","cash",410,6,FALSE);

CREATE TABLE orders_products (
  order_prod_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  product_amount INT NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(order_id),
  FOREIGN KEY(product_id) REFERENCES products(product_id)
);

-- Populate orders_products table
INSERT INTO
  orders_products
VALUES
  (NULL, 1, 8, 5), 
  (NULL, 2, 5, 4),
  (NULL, 2, 4, 3),
  (NULL, 4, 6, 6),
  (NULL, 5, 3, 1),
  (NULL, 5, 2, 4),
  (NULL, 6, 2, 8);