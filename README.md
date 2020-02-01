<br>

<p align="center"><img src="https://cdn.discordapp.com/attachments/618151759038251015/673181987716071473/logobig.png" height="250px">
</p><h1></h1><br><br>

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Google_Assistant_logo.svg/1200px-Google_Assistant_logo.svg.png" width="30%" align="right">

<p style="font-size:30px">Getting started</p>

The installation process is very straightforward  
You will need to have at __least__ Node `v12.14.1` installed  
Although `v13.2.0` is recommended.

```sh
# Clone the repository locally
$ git clone https://github.com/maaaaaaaaaaaaaaaaarin/GHD5.git

# Satisfy the project's dependencies
$ npm install 

# Call the start script, and, you're good to go!
$ npm start
```
<br>
<p style="font-size:30px">Testing</p>

The test suite can be found in similarily titled `test` directory.<br>
These depend on `mocha` and `chai`, and can be run using `$ npm test`.

<br>

<p style="font-size:30px">Additional notes</p>

For local testing, ports and variables concerning server specific configuration  
may or may not need to be adjusted, this goes specifically for Windows, but,  
should normally not cause any issues. *(e.g. port 80 being used by default)*

