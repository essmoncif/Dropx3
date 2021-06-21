const Web3 = require('web3')

const provider = `${process.env.WEB3_PROTOCOL}://${process.env.WEB3_HOST}:${process.env.WEB3_PORT}`;
const web3 = new Web3(new Web3.providers.HttpProvider(provider));

export default web3;