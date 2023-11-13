## Running an Express App in Kubernetes
### PART-1: Create an Express App


Ref: https://expressjs.com/en/starter/installing.html

> Prerequisite:  
Install npm (Node Package Manager)
>
>```
>sudo apt update
>sudo apt install npm
>```
> Verify installation:  
>```
>~> nodejs --version
>v12.22.9
>~> npm -v
>8.5.1
>``````
>
>Create a folder that will contain app, any manifest files etc. I'm calling this parent folder `k8s-app`.

Create a directory to hold your application, and make that your working directory.

```
~/learnk8s/k8s-app> mkdir myapp
~/learnk8s/k8s-app> cd myapp/
```

Use the `npm init` command to create a `package.json` file for your application. Hit RETURN to accept the defaults. For `entry point: (index.js)`, enter `app.js` or whatever you want the name of the main file to be. You can hit RETURN to accept the suggested default file name as well.

```
~/learnk8s/k8s-app/myapp> npm init
This utility will walk you through creating a package.json file.
...
```

Install `express`, `os`, `ip` in the `myapp` directory and save it in the dependencies list in `package.json` file.


```
~/learnk8s/k8s-app/myapp> npm install express
~/learnk8s/k8s-app/myapp> npm install os
~/learnk8s/k8s-app/myapp> npm install ip
```

Sample `package.json`
```json
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "ip": "^1.1.8",
    "os": "^0.1.2"
  }
}
```


In the `myapp` directory, create a file named `app.js`

```js
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
```

Run the app with the following command `node app.js`:

```
~/learnk8s/k8s-app/myapp> node app.js
Example app listening on port 3000
YOUR_HOST_NAME
YOUR_IP
```

Load http://localhost:3000/ in a browser to see the output.  
You can also use `curl localhost:3000` to view the output.
