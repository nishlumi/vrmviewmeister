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
  - `public/static/`: アプリケーションの静的ファイルが含まれます。
      - `css/`: アプリケーション全体のスタイルシートや、特定のUIコンポーネントのスタイルを定義します。
      - `img/`: アイコン、ボタン、背景画像など、UIで使用される画像ファイルが格納されています。
      - `js/`: 各種ダイアログやUIパーツなど、クライアントサイドのJavaScriptロジックが含まれています。
      - `lib/`: Vue, Quasar, three.js といった、サードパーティ製のライブラリが格納されています。
      - `locales/`: サポートする各言語の翻訳ファイル（i18n）が格納されています。
      - `res/`: アプリケーションで利用する定数や設定などの静的なリソースファイルが格納されています。
      - `win/`: Electronのウィンドウ（ダイアログ）として表示されるHTMLファイルや、それに関連するJavaScriptファイルが格納されています。


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


## 個別の機能

### VRMViewMeisterのIKのボーンの順番

|index|bone name|
|-|-|
|0 | IKParent|
|1 | EyeViewHandle|
|2 |Head|
|3 |LookAt|
|4 |Aim|
|5 |Chest|
|6 |Pelvis|
|7 |LeftShoulder|
|8 |LeftLowerArm|
|9 |LeftHand|
|10 |RightShoulder|
|11 |RightLowerArm|
|12 |RightHand|
|13 |LeftLowerLeg|
|14 |LeftLeg|
|15 |RightLowerLeg|
|16 |RightLeg|
|17 | |
|18 | |
|19 | |
|20 |LeftToes|
|21 |RightToes|

### MediaPipe

MediaPipeにより、カメラからリアルタイムでポーズ情報を取得している。
そのポーズデータを所定の形式にして、Unityに受け渡してVRMViewMeisterで使用しているポーズ情報に変換して反映している。

#### MediaPipeが返すポーズ情報

```
{
    poseLandmarks : [
        {x: 0.700, y: 0.444, z: -1.36, visibility: 0.99},
        ...
    ],
    poseWorldLandmarks : [
        {x: 0.700, y: 0.444, z: -1.36, visibility: 0.99},
        ...
    ]
}
```

