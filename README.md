1) Para Registar un usuario 

Metodo POST 
RUTA: http://localhost:3000/api/auth/register

Body: (ejemplo)
{
  "name": "Felipe",
  "email": "felipe@example.com",
  "password": "admin123",
  "number": "+1234567890"
}

2) Para loguear un usuario 

Metodo POST
RUTA: http://localhost:3000/api/auth/login

Body: (ejemplo)
{
  "email": "felipe@example.com",
  "password": "admin123"
}

3) Para consultar el perfil del usuario

Metodo GET
RUTA : http://localhost:3000/api/auth/profile

Body:  (vacío)

AUTH/BEARER -> INGRESAR TOKEN GENERADO EN EL LOGIN

