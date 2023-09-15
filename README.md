# MERN-Authentication-JWT-based

The aim of this project is to build a full stack MERN application that resembles a real world authentication system.<br/>
The application's functionality includes user registration, otp-password reset and google oauth sign-in. 

<br/>

## General flow
* Users input credentials to login
  * Front-end form validation is done by Formik library
  * Back-end validation of user-input is done by Joi library
* Alternatively, Users can also login via Google account
* Once successfully authenticated, JSON Web Tokens (JWT) will be generated and be included in the cookie sent back to client.
* Before redirecting to protected views, client will send request to server to first validate the JWT in cookie.
  * if validation fails, users will be redirect to login page
  * if validation is succeesful, users will be redirect to home page   
* To render the content of home page, client will fetch the data via API from external providers
* Logout will destroy the cookie
<br/>

## Features
* User Registeration
* Email verification
* Credentials login
* Google oauth login
* Password Reset using OTP

<br/>

## Technologies used
* MongoDB
* Express
* ReactJS
* Node
* Cookie-parser
* Joi
* Nodemailer
* MailTrap 
* JSON Web Tokens (JWT)
* BCrypt
* Google-auth-library
* Formik
* React-otp-input
* React OAuth2 | Google

<br/>

## Screenshots

<div align="center">
   
![register](https://github.com/dude76vvv/MERN-Authentication-JWT-based/assets/131178280/493bdbab-a80b-4e44-a78f-cd63b3d21f08)
![verify email](https://github.com/dude76vvv/MERN-Authentication-JWT-based/assets/131178280/4b015849-a4a2-4a24-9d02-879ea5117e5f)
![email verification](https://github.com/dude76vvv/MERN-Authentication-JWT-based/assets/131178280/588ce7ca-7355-44a8-a3b5-f0ff7b20d60e)
![login](https://github.com/dude76vvv/MERN-Authentication-JWT-based/assets/131178280/f2f83a88-4b5b-4879-8485-88756288e7a5)
![home](https://github.com/dude76vvv/MERN-Authentication-JWT-based/assets/131178280/3aa4500a-8f2c-407c-baa5-133019e9a9b1)
![forget1](https://github.com/dude76vvv/MERN-Authentication-JWT-based/assets/131178280/eab7f67d-6794-4ef9-b9cd-8e32988e2660)
![forget2](https://github.com/dude76vvv/MERN-Authentication-JWT-based/assets/131178280/a682ab0a-4f58-4b18-81c4-d42628524672)
![forget3](https://github.com/dude76vvv/MERN-Authentication-JWT-based/assets/131178280/529e6474-9eaf-41a5-a540-19030a16b62a)

</div>

