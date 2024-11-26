const express = require('express');
const stripe = require('stripe')('sk_test_51QF9fJ2LbbVNJuW3LBkS67BZPmY5kjLsWJ7vnD7nSywxj3dzLf3HF4K5HSw397FbOV78w4jr5s3mUwaTT7vkyAzo006WzqShwL');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

// Aumentar el límite del body parser para manejar el XML
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'morenojos00@gmail.com',
    pass: 'dhla pgek ojcp ttsc'
  }
});

// Endpoint para Stripe (sin cambios)
app.post('/charge', async (req, res) => {
  try {
    let { token, amount } = req.body;
    let charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token.id,
      description: 'Compra de tenis'
    });
    res.status(200).send(charge);
  } catch (error) {
    console.error('Error al procesar el cargo:', error);
    res.status(500).send(error);
  }
});

// Endpoint actualizado para el envío de correo
app.post('/send-order-confirmation', async (req, res) => {
  try {
    const { orderNumber, items, total, userEmail, date, reciboXML } = req.body;

    console.log('Recibiendo solicitud de envío de correo');
    console.log('XML recibido:', reciboXML ? 'Sí' : 'No');
    
    // Preparar los adjuntos
    const attachments = [];
    
    if (reciboXML) {
      // Asegurar que el XML tenga la codificación correcta
      const xmlBuffer = Buffer.from(reciboXML, 'utf-8');
      
      attachments.push({
        filename: `recibo-${orderNumber}.xml`,
        content: xmlBuffer,
        contentType: 'application/xml',
        encoding: 'utf-8'
      });
      
      console.log('Adjunto XML preparado:', {
        filename: `recibo-${orderNumber}.xml`,
        contentLength: xmlBuffer.length
      });
    } else {
      console.log('No se recibió XML en la solicitud');
    }

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { 
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(45deg, #ff3366, #ff6b3d);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            border: 1px solid #ddd;
          }
          .item {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          .total {
            font-weight: bold;
            text-align: right;
            padding: 10px;
            background-color: #f9f9f9;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Gracias por tu compra en Sneaker Street!</h1>
          </div>
          <div class="content">
            <h2>Detalles de tu pedido</h2>
            <p>Número de orden: ${orderNumber}</p>
            <p>Fecha: ${date}</p>
            
            <div class="items">
              ${items.map(item => `
                <div class="item">
                  <h3>${item.nombre}</h3>
                  <p>Cantidad: ${item.cantidad}</p>
                  <p>Precio unitario: $${item.precio}</p>
                  <p>Subtotal: $${(item.precio * item.cantidad).toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
            
            <div class="total">
              <h3>Total (incluyendo IVA): $${total.toFixed(2)}</h3>
            </div>
          </div>
          <div class="footer">
            <p>Gracias por comprar en Sneaker Street</p>
            ${attachments.length > 0 ? '<p>Encontrarás tu recibo XML adjunto a este correo.</p>' : ''}
            <p>Si tienes alguna pregunta, no dudes en contactarnos</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('Preparando opciones de correo');
    const mailOptions = {
      from: 'morenojos00@gmail.com',
      to: userEmail,
      subject: `Confirmación de pedido #${orderNumber} - Sneaker Street`,
      html: emailContent,
      attachments: attachments
    };

    console.log('Enviando correo con adjuntos:', {
      attachmentsCount: attachments.length,
      recipientEmail: userEmail
    });

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente');

    res.json({ 
      message: 'Correo de confirmación enviado exitosamente',
      attachmentsCount: attachments.length,
      hasXML: attachments.length > 0
    });
  } catch (error) {
    console.error('Error detallado al enviar el correo:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack,
      phase: 'email_sending'
    });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
  console.log('Configurado para manejar archivos XML y envío de correos');
});