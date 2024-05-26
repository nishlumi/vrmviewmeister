# VRMViewMeister


# 概要

本アプリはMMDのようにVRoid(VRM)でアニメーションを手軽に作ることを目指したアプリです。
本格的な3Dアニメーションを目指したわけではないので、本アプリで作ったアニメーションは（今のところ）
本アプリでしか再生できませんが、Unityのエディタ上で直接作るより遥かに手軽にできるはずです。
それからウェブアプリになっているため、ウェブブラウザでどこでも使えるのが特徴です。
（技術的な面で制限がかかる機能もあります）



# リリース URL

https://vrmviewmeister.azurewebsites.net


# マニュアル

http://nishlumi-vrmviewmdoc.readthedocs.io/


# セットアップ


## For WebApp

* Linux/macOSの場合, 事前に`chmod z_mng/*.sh` コマンドを実行してください。

1. `npm install`
2. `npm run prepare1`

* Windowsでは `prepare1:ps` 、 Linux/macOSでは `prepare1:sh`を実行してください。
* ZIPファイル(.wasm,.unitywebなど、サイズの巨大なファイルが含まれています) のダウンロードが始まります。

3. `npm run prepare2`

* Windowsでは `prepare2:ps` 、 Linux/macOSでは `prepare2:sh`を実行してください。
* ZIPファイルを解凍し、`largef` フォルダを生成します。そして `./largef/public` フォルダの中身を `./public` フォルダへ全てコピーします。

4. `npm run wpbuild`

5. `npm run swbuild`

* `npm run fullbuild` でもかまいません。



## Electron版

1. `npm install` から `npm run swbuild` まではWebAppと同じです。
4. `npm run compile:electron`
5. `npm run electron`

## Electron のビルド

* Windows: `npm run build:win-portable`

* maxOS: `npm run build:mac`

* Linux: `npm run build:linux`


# ウェブアプリを起動する

1. `npm run watch`
2. `npm run dev`

* このコマンドは http://localhost を起動します。
* ポート番号はpackage.jsonに記載しています。

Optional:

3. `npm run ssldev`

* このコマンドは https で起動します。
* ポート番号は bs-config.js か、起動時のコンソールをご確認ください。


# 注意

You can not build Unity with the sources of this repository.
このリポジトリのソースではUnityビルドはできません。

# ライセンス

MIT


Copyright 2022, ISHII Eiju.