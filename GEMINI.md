# VRMViewMeister プロジェクト概要

このプロジェクトは `VRMViewMeister` という名前のアプリケーションです。VRoid (VRM) モデルを使用して、MMD（MikuMikuDance）のように手軽にアニメーションを作成することを目的としています。

## -p オプション付きでプロンプト実行後の挙動

- ユーザーからの承認が必要な操作が発生する場合、承認を求める前にコンソールに `=USER=` を出力して実行を終了する。

## 主な特徴

- **プラットフォーム**: ウェブブラウザ上で動作するウェブアプリケーションとして提供されるほか、Electronを使用してWindows, macOS, Linux向けのデスクトップアプリケーションとしてもビルドできます。
- **目的**: 専門的な3Dアニメーションツールよりも手軽に、VRMモデルのポージングやアニメーション制作を行えるようにすること。
- **技術スタック**:
    - **フロントエンド**: Vue.jsとQuasarフレームワークをベースに構築されています。
    - **バックエンド**: Node.jsとExpressでサーバーサイドの処理を行っています。
    - **ビルドシステム**: webpackによるモジュールのバンドルと、WorkboxによるPWA（プログレッシブウェブアプリ）対応が行われています。
    - **デスクトップアプリ**: Electronを使用して、ウェブ技術をベースにしたクロスプラットフォームのデスクトップアプリを生成します。


## ファイル構成

  - `public/`: ウェブサーバーのルートディレクトリで、HTML、CSS、画像、Unityビルドの出力などが含まれます。
  - `src/`: アプリケーションのメインのソースコード（JavaScript, Vueコンポーネントなど）が格納されています。
  - `routes/`: Expressサーバーのルーティング定義ファイルが含まれます。
  - `main.js`: Electronのメインプロセスファイルです。
  - `package.json`: プロジェクトの依存関係やスクリプトが定義されています。
  - `z_mng/`: 巨大なアセットファイル（Unityビルドなど）をAzure Blob Storageからダウンロード・展開するためのスクリプトが含まれています。
  - `src/js/`: アプリケーションの主要なJavaScriptコードが格納されています。UIコンポーネント、ビジネスロジック、データモデルなどがここにあります。
      - `model/`: 3Dモデルの読み込み、操作、コールバックなど、モデル関連のロジックを扱います。
      - `prop/`: アプリケーションのデータ構造（メインデータ、リボン、オブジェクトリスト、タイムラインなど）を定義します。
  - `src/lib/`: サードパーティのライブラリが含まれています。
  - `src/locales/`: 国際化（i18n）のための言語ファイルが格納されています。
  - `src/res/`: アプリケーション定数など、静的なリソースファイルが含まれています。


## 各種作業概要

### 開発環境再開時

ターミナルを複数起動して次を起動。

- `npm run watch`: webpackによるwatchの開始
- `npm run dev`: 開発環境の立ち上げ
- `npm run ssldev`: ローカルホストのSSL環境の立ち上げ

### 開発時のビルド

1. なにかコードやhtmlなどを修正する。
2. `npm run swbuild`: workboxによるserviece workerの再生成

※htmlファイルを更新した場合、下記が必要。

- `npm run compile:electron`: Electron環境で使うHTMLファイルに最新の内容を反映する

### リリース準備

- 下記2つのファイルの対象箇所が一致しているかを確認する。
    * `appmaindata.js` の`this.appinfo` の　`version` 
    * `package.json` の `version`
- `npm run mainte:largefile`: サイズが大きいファイルをzipにまとめる。
- `npm run mainte:upload`: ファイルをまとめたzipをAzureのストレージアカウントにアップロードする。

### ウィンドウ版のビルド

1. `npm run build:win-portable`: Electron製アプリのウィンドウ版のビルドをする。

### mac版およびLinux版のビルド

#### 共通

1. `chmod u+x z_mng/*.sh`: 管理系のシェルに実行権限を付与する。
2. `npm run prepare1:sh`: zipファイルをダウンロードする。
3. `npm run prepare2:sh`: zipファイルを展開し、各フォルダにコピーして貼り付ける。
4. `npm run fullbuild`: webpackとworkbox両方実行する
5. `npm run compile:electron`: HTMLファイルを編集した場合はこれも実行する
6. `npm run electron`: Electronの起動。目視や手作業で更新を確認する。

#### mac版

1. `npm run build:mac`: mac版のビルド開始。

#### Linux版

1. `npm run build:linux`: Linux版のビルド開始。

### ウェブ版のビルド

AzureDevOpsのリポジトリにコミット後、Pushする。（安全性を考慮し、アプリ自体のビルドとは別作業）


