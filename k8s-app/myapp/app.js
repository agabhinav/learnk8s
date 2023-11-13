const express = require('express')
const os = require('os')
const ip = require('ip')

const app = express()
const port = 3000

app.get('/', (req, res) => {
    const hostname = os.hostname(); //process.env.HOSTNAME
    const localIpAddress = ip.address();

    res.send(`HOSTNAME: ${hostname}, IP: ${localIpAddress}`);
    /*
    res.send(`
    <style>
        table { border-collapse: collapse; }
        tr, td { border: 2px solid black; padding: 10px; text-align: left; }
    </style>
    <table>
        <tr>
            <td>HOSTNAME</td>
            <td>${hostname}</td></tr>
        <tr>
            <td>IP</td>
            <td>${localIpAddress}</td>
        </tr>
    </table>
    `);
    */
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log(os.hostname());
    console.log(ip.address())
})