import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-header></app-header>

    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SneakerStreet - La mejor tienda de Sneakers online</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        body {
            background-color: #f4f4f4;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        header {
            background-color: rgba(255, 255, 255, 0.95);
            position: fixed;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .nav-links {
            display: flex;
            gap: 30px;
        }
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        .nav-links a:hover {
            color: #ff4500;
        }
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: url('https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
            background-size: cover;
            background-position: center;
            color: white;
            text-align: center;
        }
        .hero-content {
            background-color: rgba(0, 0, 0, 0.6);
            padding: 40px;
            border-radius: 8px;
        }
        .hero h1 {
            font-size: 48px;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }
        .hero p {
            font-size: 18px;
            margin-bottom: 30px;
        }
        .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #ff4500;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 30px;
            transition: background-color 0.3s ease;
        }
        .cta-button:hover {
            background-color: #e63900;
        }
        .featured-products {
            padding: 80px 0;
            background-color: white;
        }
        .featured-products h2 {
            text-align: center;
            font-size: 36px;
            margin-bottom: 40px;
        }
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }
        .product-card {
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .product-card:hover {
            transform: translateY(-5px);
        }
        .product-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .product-info {
            padding: 20px;
        }
        .product-info h3 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        .product-info p {
            color: #ff4500;
            font-weight: bold;
        }
        footer {
            background-color: #333;
            color: white;
            padding: 40px 0;
            text-align: center;
        }
    </style>
</head>
<body>

    <main>
        <section class="hero">
            <div class="hero-content">
                <h1>RENDIMIENTO EXCEPCIONAL</h1>
                <p>Descubre la nueva colección de calzado deportivo de élite</p>
                <a href="catalogo" class="cta-button">Explorar Colección</a>
            </div>
        </section>

        <section id="productos" class="featured-products">
            <div class="container">
                <h2>Productos Destacados</h2>
                <div class="product-grid">
                    <div class="product-card">
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Tenis Velocidad X">
                        <div class="product-info">
                            <h3>Velocidad X</h3>
                            <p>$199.99</p>
                        </div>
                    </div>
                    <div class="product-card">
                        <img src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80" alt="Tenis Aero Boost">
                        <div class="product-info">
                            <h3>Aero Boost</h3>
                            <p>$179.99</p>
                        </div>
                    </div>
                    <div class="product-card">
                        <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2187&q=80" alt="Tenis Ultra Flex">
                        <div class="product-info">
                            <h3>Ultra Flex</h3>
                            <p>$229.99</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 SneakerStreet. Todos los derechos reservados.</p>
        </div>
    </footer>
</body>
</html>
  `,
  imports: [HeaderComponent]
})
export class HomeComponent { }
