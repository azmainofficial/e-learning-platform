<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'mystrix_int';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("DROP TABLE IF EXISTS contents, modules, courses, migrations;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
    echo "Tables dropped successfully\n";
} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage());
}
?>