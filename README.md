# VRMViewMeister



# summary

This application is an application that aims to easily create animation with VRoid (VRM) like MMD.
It is not possible to create full-scale long 3D animations, and animations created with this app can only be played with this app.

However, users should be able to create it much easier than creating it directly in the Unity editor.
This application is made by web application. Therefore, the feature is that it can be used anywhere with a web browser.
(There may be technical restrictions)




# Release URL

https://vrmviewmeister.azurewebsites.net


# Manual

http://nishlumi-vrmviewmdoc.readthedocs.io/


# Installation


## For WebApp

* On Linux/macOS, please do `chmod z_mng/*.sh` command before executing.

1. `npm install`
2. `npm run prepare1`

* `prepare1:ps` for Windows, `prepare1:sh` for Linux/macOS
* Start to download compressed zip file (includes .wasm,.unityweb,etc large size files)

3. `npm run prepare2`

* `prepare2:ps` for Windows, `prepare2:sh` for Linux/macOS
* Extract zip file (generated `largef` folder). And copy ./largef/public to ./public 

4. `npm run wpbuild`

5. `npm run swbuild`

* You can also use `npm run fullbuild`.



## For Electron

1. `npm install` ~ `npm run swbuild` same as WebApp
4. `npm run compile:electron`
5. `npm run electron`

## For build of the Electron

* Windows: `npm run build:win-portable`

* maxOS: `npm run build:mac`

* Linux: `npm run build:linux`


# Run the WebApp

1. `npm run watch`
2. `npm run dev`

* This command can be tested running with http://localhost.
* The port number is listed in package.json.

Optional:

3. `npm run ssldev`

* This command can be tested running with https on your local host.
* The port number is listed in bs-config.js or Console.


# Caution

You can not build Unity with the sources of this repository.

# License

MIT


Copyright 2022, ISHII Eiju.