require('dotenv').config();

module.exports = {
    ip: {
        local: process.env.HOST,
        SUB_HOST: process.env.SUB_HOST,
    },
}