# VRMViewMeister



# summary

This application is an application that aims to easily create animation with VRoid (VRM) like MMD.
It is not possible to create full-scale long 3D animations, and animations created with this app can only be played with this app.

However, users should be able to create it much easier than creating it directly in the Unity editor.
This application is made by web application. Therefore, the feature is that it can be used anywhere with a web browser.
(There may be technical restrictions)

本アプリはMMDのようにVRoid(VRM)でアニメーションを手軽に作ることを目指したアプリです。
本格的な3Dアニメーションを目指したわけではないので、本アプリで作ったアニメーションは（今のところ）
本アプリでしか再生できませんが、Unityのエディタ上で直接作るより遥かに手軽にできるはずです。
それからウェブアプリになっているため、ウェブブラウザでどこでも使えるのが特徴です。
（技術的な面で制限がかかる機能もあります）



# Release URL

https://vrmviewmeister.azurewebsites.net


# Manual

http://nishlumi-vrmviewmdoc.readthedocs.io/


# Installation

1. `npm install`

2. `npm run wpbuild`

3. `npm run swbuild`

* For Windows environment, you can also use 'npm run fullbuild'.<br>
  Windows環境の場合は npm run fullbuild でも可。

4. `npm run dev`

## For Electron

1. `npm install`
2. `npm run wpbuild`
3. `npm run swbuild`
4. `npm run compile:electron`
5. `npm run electron`

## For build of the Electron

* Windows: `npm run build:win-portable`

* maxOS: `npm run build:mac`

* Linux: `npm run build:linux`


# Caution

You can not build Unity with the sources of this repository.

# License

MIT


Copyright 2022, ISHII Eiju.