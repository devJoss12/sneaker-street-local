<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Credenciales de la base de datos
$host = "localhost";
$db_name = "sneaker_street";
$username = "root";  // Si tienes una contraseña en MySQL, colócala aquí
$password = "";

// Conexión a la base de datos
$conn = new mysqli($host, $username, $password, $db_name);

// Verifica si la conexión es exitosa
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta SQL para obtener los productos
$sql = "SELECT id, nombre, descripcion, precio, url_imagen FROM catalogo";
$result = $conn->query($sql);

$productos = array();

// Si hay resultados, los agregamos al array
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
}

// Enviar los productos como JSON
echo json_encode($productos);

// Cerrar la conexión
$conn->close();
?>
