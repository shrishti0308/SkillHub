require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createSuperuser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillhub');
        console.log('Connected to MongoDB');

        // Check if any superuser already exists
        const existingSuperuser = await Admin.findOne({ role: 'superuser' });
        if (existingSuperuser) {
            console.log('A superuser already exists!');
            process.exit(1);
        }

        // Get superuser details
        const name = await question('Enter superuser name: ');
        const email = await question('Enter superuser email: ');
        const password = await question('Enter superuser password: ');

        // Validate input
        if (!name || !email || !password) {
            console.log('All fields are required!');
            process.exit(1);
        }

        if (password.length < 8) {
            console.log('Password must be at least 8 characters long!');
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create superuser
        const superuser = new Admin({
            name,
            email,
            password: hashedPassword,
            role: 'superuser',
            permissions: [
                'manageUsers',
                'manageJobs',
                'manageBids',
                'manageTransactions',
                'viewReports',
                'manageAdmins',
                'manageSettings'
            ]
        });

        await superuser.save();

        console.log('\nSuperuser created successfully!');
        console.log('Email:', email);
        console.log('Role: superuser');
        console.log('\nYou can now log in at /admin/login');

    } catch (error) {
        console.error('Error creating superuser:', error.message);
    } finally {
        rl.close();
        await mongoose.connection.close();
        process.exit(0);
    }
}

createSuperuser();
