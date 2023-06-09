const { connectDb, client } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const generatedOtp = Math.floor(1000 + Math.random() * 9000)


exports.loginController = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        if (role === "doctor") {

            const query = `SELECT * FROM doctors WHERE email = $1`;
            const values = [email];

            const result = await client.query(query, values);

            if (result.rows.length === 0) {
                return res.status(400).json({ noUser: "Invalid credentials" });
            }

            const isMatch = bcrypt.compareSync(req.body.password, result.rows[0].password);

            if (!isMatch) {
                return res.status(400).json({ wrongPassword: "Invalid credentials" });
            }

            const id = result.rows[0].did
            const role = result.rows[0].role

            let mailTransporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_PASSWORD
                }
            });

            let mailDetails = {
                from: process.env.SENDER_EMAIL,
                to: result.rows[0].email,
                subject: 'otp for login',
                text: `Your OTP is ${generatedOtp}`
            };

            console.log(process.env.SENDER_EMAIL)

            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    res.json({ error: "Error in sending email" });
                } else {
                    res.status(200).json({ otpSend: "OTP sent to your email", id, role });
                }
            });

        }

        if (role === "lab") {

            const query = `SELECT * FROM lab WHERE email = $1`;
            const values = [email];

            const result = await client.query(query, values);

            if (result.rows.length === 0) {
                return res.json({ noUser: "Invalid credentials" });
            }

            const isMatch = bcrypt.compareSync(req.body.password, result.rows[0].password);

            if (!isMatch) {
                return res.json({ wrongPassword: "Invalid credentials" });
            }

            const payload = {
                id: result.rows[0].lid,
                name: result.rows[0].name,
                role: result.rows[0].role,
            };

            const id = result.rows[0].lid
            const role = result.rows[0].role

            let mailTransporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_PASSWORD
                }
            });

            let mailDetails = {
                from: process.env.SENDER_EMAIL,
                to: result.rows[0].email,
                subject: 'otp for login',
                text: `Your OTP is ${generatedOtp}`
            };

            console.log(process.env.SENDER_EMAIL)

            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    res.json({ error: "Error in sending email" });
                } else {
                    res.status(200).json({ otpSend: "OTP sent to your email", id, role });
                }
            });
        }
        if (role === "admin") {
            const query = `SELECT * FROM admin WHERE email = $1`;
            const values = [email];

            const result = await client.query(query, values);

            if (result.rows.length === 0) {
                return res.json({ noUser: "Invalid credentials" });
            }

            const isMatch = req.body.password === result.rows[0].password

            if (!isMatch) {
                return res.json({ wrongPassword: "Invalid credentials" });

            }


            const role = result.rows[0].role

            let mailTransporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_PASSWORD
                }
            });

            let mailDetails = {
                from: process.env.SENDER_EMAIL,
                to: result.rows[0].email,
                subject: 'otp for login',
                text: `Your OTP is ${generatedOtp}`
            };

            console.log(process.env.SENDER_EMAIL)

            const sent = mailTransporter.sendMail(mailDetails)
            if (sent) {

                res.status(200).json({ otpSend: "OTP sent to your email", role });
            }
            else {
                res.json({ error: "Error in sending email" });
            }
        }

        if (role === "patient") {

            const query = `SELECT * FROM patients WHERE email = $1`;
            const values = [email];

            const result = await client.query(query, values);

            if (result.rows.length === 0) {
                return res.json({ noUser: "Invalid credentials" });
            }

            const isMatch = bcrypt.compareSync(req.body.password, result.rows[0].password);

            if (!isMatch) {
                return res.json({ wrongPassword: "Invalid credentials" });
            }

            const id = result.rows[0].pid
            const role = result.rows[0].role
            const mail = result.rows[0].email
            console.log(mail)

            let mailTransporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_PASSWORD
                }
            });

            let mailDetails = {
                from: process.env.SENDER_EMAIL,
                to: result.rows[0].email,
                subject: 'otp for login',
                text: `Your OTP is ${generatedOtp}`
            };

            console.log(process.env.SENDER_EMAIL)

            const sent = mailTransporter.sendMail(mailDetails)
            if (sent) {

                res.status(200).json({ otpSend: "OTP sent to your email", id, role, mail });
            }
            else {
                res.json({ error: "Error in sending email" });
            }
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.registerController = async (req, res) => {
    const role = req.body.role;

    try {

        if (role === "doctor") {
            const { name, email, did } = req.body;
            const password = "123abc";

            const hashedPassword = await bcrypt.hash(password, 10);

            if (!name || !email || !did) {
                return res.status(400).json({ error: "Please fill all the fields" });
            }

            const query = `SELECT * FROM doctors WHERE email = $1`;
            const values = [email];

            const result = await client.query(query, values);

            if (result.rows.length > 0) {
                return res.status(400).json({ userExists: "Email already exists" });
            }
            else {

                const query = `INSERT INTO doctors (name, email, password, role, did) VALUES ($1, $2, $3, $4, $5)`;
                const values = [name, email, hashedPassword, role, did];

                const result = await client.query(query, values)
                res.status(200).json({ message: "Doctor registered successfully" });
            }
        }

        if (role === "lab") {
            const { name, email, lid } = req.body;
            const password = "123abc";

            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `SELECT * FROM lab WHERE email = $1`;
            const values = [email];

            const result = await client.query(query, values);

            if (result.rows.length > 0) {
                return res.status(400).json({ userExists: "Email already exists" });
            }
            else {
                const query = `INSERT INTO lab (name, email, password, role, lid) VALUES ($1, $2, $3, $4, $5)`;
                const values = [name, email, hashedPassword, role, lid];

                const result = await client.query(query, values)
                res.status(200).json({ message: "Lab Assistant registered successfully" });
            }
        }

        if (role === "patient") {
            const { name, email, citizenship, age, password, pid } = req.body; // generate pid from frontend 

            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `SELECT * FROM patients WHERE citizenship = $1`;
            const values = [citizenship];
            const result = await client.query(query, values);

            if (result.rows.length > 0) {
                return res.json({ userExists: "user already exists" });
            }
            else {
                const query = `INSERT INTO patients (name, email, citizenship, age, password, role, pid) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
                const values = [name, email, citizenship, age, hashedPassword, role, pid];

                const result = client.query(query, values);
                res.status(200).json({ message: "Patient registered successfully" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });

    }
}

exports.logoutController = async (req, res) => {
    res
        .clearCookie("access_token", {
            sameSite: true,
            secure: true,
        })
        .status(200)
        .json({ message: "Logout successful" });
}


exports.changePassword = async (req, res) => {

}


exports.otpController = async (req, res) => {

    const { otp } = req.body;
    try {

        check = otp == generatedOtp;
        console.log(otp, generatedOtp)
        if (otp == generatedOtp) {
            const token = jwt.sign(otp, process.env.SECRET_KEY);
            return res.status(200).json({ message: "OTP verified successfully", token });
        }

        return res.json({ wrongOtp: "Invalid OTP" });


    } catch (err) {
        res.status(500).json({ error: err.message });

    }

}