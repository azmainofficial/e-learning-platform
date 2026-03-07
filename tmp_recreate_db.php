<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->exec("DROP DATABASE IF EXISTS mystrix_int");
    $pdo->exec("CREATE DATABASE mystrix_int");
    echo "Database reset successfully\n";
} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage());
}
?>