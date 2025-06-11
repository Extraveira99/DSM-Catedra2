const {response, request } = require("express");
const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");
const verifyGoogleToken = require("../utils/googleVerify");
//const sendEmail = require("../utils/sendEmail");

const login = async (req = request, res = response) => {

    try{
        const { mail, password } = req.body;

        // Veirfica si el usuario existe
        const user = await User.findOne({ where: { mail } });
        if(!user){
            return res.status(400).json({
                error: true,
                success: false,
                msg: 'Las credenciales de acceso son incorrectas o el usuario no está registrado.'
            });
        }

        // Verifica si el usuario está deshabilitado
        if (!user.isActive) {
            return res.status(403).json({
                error: true,
                success: false,
                msg: 'Usuario deshabilitado. Contacte soporte.'
            });
        }



        // Verifica la contraseña
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                error: true,
                success: false,
                msg: '“Las credenciales de acceso son incorrectas o el usuario no está registrado.'
            });
        }

        // Genera el JWT
        const token = await generateJWT(user.id);

        const {role_id, name, lastname, mail: userEmail, image, phone} = user;

        const dataUser = {
            id: user.id,
            role_id,
            name,
            lastname,
            mail: userEmail,
            image,
            phone,
            token
        };
        return res.status(200).json({
            success: true,
            data: dataUser,
            message: 'Usuario logueado correctamente',        
        });

    } catch (error){
        return res.status(500).json({
            success: false,
            error: true,
            msg: 'Error al iniciar sesión',
        });
    }
};



const validateToken = async(req = request, res = response) => {
    const authHeader = req.headers["authorization"];

    token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: true,
            success: false,
            msg: 'Token no proporcionado',
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(id);
        const { role, name, lastName, mail, image, phone } = user;
        const dataUser = {
            id: user.id,
            role,
            name,
            lastName,
            mail,
            image,
            phone,
            token
        };
        
        if(user){
            return res.status(200).json({
                success: true,
                data: dataUser,
                message: 'Token válido',
            });
        }
    } catch (error){
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                success: false,
                msg: 'Token expirado',
            });
        }

    }
    return res.status(401).json({
        error: true,
        success: false,
        msg: 'Token inválido',
    });

};


const register = async(req= request, res = response) => {
    
    try {
        const { mail, phone, password, passwordConfirmation, googleToken, name, lastName } = req.body;

        // Si viene un token de Google, intentamos autenticar con Google
        if (googleToken) {
            const googleUser = await verifyGoogleToken(googleToken);
            const { email, name, picture } = googleUser;

            let user = await User.findOne({ where: { mail: email } });

            if (!user) {
                // Si no existe el usuario, lo registramos
                user = new User({
                    mail: email,
                    name: name,
                    image: picture,
                    role_id: 3,
                    password: ":)", // valor dummy, no se usará
                });
                await user.save();
            }

            const token = await generateJWT(user.id);

            return res.status(200).json({
                success: true,
                error: false,
                message: user.createdAt ? "Registrado con Google" : "Login con Google",
                data: {
                    id: user.id,
                    mail: user.mail,
                    role_id: user.role_id,
                    token
                }
            });
        }
        //Validaciones de los campos obligatorios para registro
        if(!mail || !password || !passwordConfirmation){
            return res.status(400).json({
                success: false,
                error: true,
                message: "Todos los campos son obligatorios"
            });
        }

        //Validaciones del formato de correo electrónico
        const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!mailRegex.test(mail)){
            return res.status(400).json({
                success: false,
                error: true,
                message: "El correo electrónico no es válido"
            });
        }

        
        //Validaciones de longitud de contraseña
        if(password.length < 8 || password.length > 15){
            return res.status(400).json({
                success: false,
                error: true,
                message: "La contraseña debe tener entre 8 y 15 caracteres"
            });
        }

        //Verificacion de coincidencia entre amabas contraseñas
        if(password !== passwordConfirmation) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Las contraseñas no coinciden"
            });
        }

        //Verificacion si el usuario ya existe
        const existingUser = await User.findOne({where: {mail}});

        if (existingUser){
            return res.status(409).json({
                success: false,
                error: true,
                message: "El correo electrónico ya está registrado",
                
            });
        }

        //Creacion y guardado de usuario en la base de datos
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);

        const smsCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            name,
            lastName,
            mail,
            password: hashedPassword,
            role_id: 3,
            phone,
            phone_code: smsCode,
            isVerified: false
        });

        await user.save();

        // Simula envío de SMS
        console.log(`Código de verificación para ${user.phone}: ${smsCode}`);

        // Generar JWT
        const token = await generateJWT(user.id);

        return res.status(201).json({
            success: true,
            error:false,
            data: {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                mail: user.mail,
                role_id: user.role_id,
                token
            },
            message: "Se ha registrado con éxito"
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            error: true,
            message: "Error al registrar usuario"
        });
    }
    
}

const verifyPhoneCode = async (req = request, res = response) => {
    const { phone, code } = req.body;

    if (!phone || !code) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Teléfono y código son requeridos"
        });
    }

    try {
        
        const user = await User.findOne({ where: { phone } });

        if (!user || user.phone_code !== code) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Código incorrecto o teléfono inválido"
            });
        }

        user.isVerified = true;
        user.phone_code = null;
        await user.save();

        return res.status(200).json({
            success: true,
            error: false,
            message: "Teléfono verificado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: "Error al verificar el teléfono"
        });
    }
};


//Envio de codigo para restablecer
const forgotPassword = async (req = request, res = response) => {
    const { mail } = req.body;

    console.log("Request body:", req.body);
    if (!mail) {
        return res.status(400).json({ 
            success: false,
            error: true, 
            message: "El correo electrónico es obligatorio" 
        });
    }

    try {
        const normalizedMail = mail.trim().toLowerCase();
        console.log("Buscando usuario con correo:", normalizedMail);

        const user = await User.findOne({ where: { mail: normalizedMail } });

        if (!user) {
            console.log("No se encontró usuario con ese correo en la base de datos");
            return res.status(404).json({ 
                success: false,
                error: true, 
                message: "El correo electrónico no existe" 
            });
        }

        // Genera código aleatorio de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString(); 

        // Guarda el código en la base de datos temporalmente
        user.reset_code = code;
        await user.save();

        // Mostrar el código por consola
        console.log(`Código de recuperación para ${normalizedMail}: ${code}`);
        //await sendEmail(email, "Código de restablecimiento", `Tu código es: ${code}`);

        return res.status(200).json({ 
            success: true, 
            error: false,
            message: "Se generó un código de recuperación (ver consola)" 
        });

    } catch (error) {
        console.error("Error en forgotPassword:", error);
        return res.status(500).json({ 
            success: false,
            error: true,
            message: "Error interno del servidor" 
        });
    }
};
const resetPassword = async (req = request, res = response) => {
    const { mail, code, password, confirmPassword } = req.body;

    if (!mail || !code || !password || !confirmPassword) {
        return res.status(400).json({ 
            success: false,
            error: true, 
            message: "Todos los campos son obligatorios" 
        });
    }

    if (password.length < 8 || password.length > 15) {
        return res.status(400).json({ 
            success: false,
            error: true, 
            message: "La contraseña debe tener entre 8 y 15 caracteres" 
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ 
            success: false,
            error: true, 
            message: "Las contraseñas no coinciden" 
        });
    }

    const user = await User.findOne({ where: { mail: mail } });

    if (!user || user.reset_code !== code) {
        return res.status(400).json({ 
            success: false,
            error: true, 
            message: "Código inválido o correo incorrecto" 
        });
    }

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    user.reset_code = null;
    await user.save();

    // Envio de correo de confirmación de cambio
    console.log(`Se cambió la contraseña para ${mail}`);
    //await sendEmail(mail, "Contraseña restablecida", "Tu contraseña ha sido cambiada con éxito");

    return res.status(200).json({ 
        success: true, 
        error:false,
        message: "Contraseña restablecida correctamente" 
    });
};

const logout = async (req = request, res = response) => {
    return res.status(200).json({
        success: true,
        error: false,
        message: "Sesión cerrada correctamente"
    });
};

module.exports = {
    login,
    register,
    verifyPhoneCode,
    forgotPassword,
    resetPassword,
    logout
};