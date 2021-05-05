
/**
 * config.js
 * Game Configuration
 * Copyright (c) 2021 Yuya.Eguchi
*/

//設定クラス

class Config {
    //コンストラクタ
    constructor(){
        //===   難易度の設定
        //Easy: 10x10  
        this.easy = {
            col: 10,
            row: 10,
            bombs: 15
        };
        //Middle: 16x16
        this.middle = {
            col: 16,
            row: 16,
            bombs: 40
        };
        //Hard: 16x30
        this.hard = {
            col: 30,
            row: 16,
            bombs: 99
        };



        //ボタンサイズ
        this.buttonWidth = 30;  //px
        this.buttonHeight = 30; //px
        // this.ImgWidth = 40;
        // this.ImgHeight = 40;

        //文字のカラーリング
        this.fontColors = [
            ""          //0: グレー
            , ""        //1: 青
            , ""        //2: 
            , ""        //3: 
            , ""        //4: 
            , ""        //5: 
            , ""        //6: 
            , ""        //7: 
            , ""        //8: 
        ];

        //背景のカラーリング
        this.backgroundColor = "rgb(231, 231, 231)";
        this.winBackgroundColor = "yellow";
        this.loseBackgroundColor = "red";
    }

    setDifficulty(diff) {
        //===   ゲーム設定
        //難易度をセットする
        this.difficulty = this.easy;
        if (diff == "middle") {
            this.difficulty = this.middle;
        }
        else if (diff == "hard") {
            this.difficulty = this.hard;
        }
    }

    //難易度取得
    getDifficulty(){
        return this.difficulty;
    }

    //ボタンサイズ取得
    getButtonSize(){
        return [this.buttonWidth, this.buttonHeight];
    }

    //文字カラーリング取得
    getFontColor(){
        return this.fontColors;
    }

    //背景カラーリング取得
    getBackgroundColor(){
        return this.backgroundColor;
    }

    getWinColor(){
        return this.winBackgroundColor;
    }

    getLoseColor(){
        return this.loseBackgroundColor;
    }



}









Config.fontHeight = 33;

Config.stageCols = 6;       //  ステージ横の個数
Config.stageRows = 12;      //  ステージの縦の個数

//フィールドサイズ追加
//高さが全部入るように調整
Config.puyoImgHeight = (window.innerHeight - Config.fontHeight) / (Config.stageRows);
Config.puyoImgWidth = Config.puyoImgHeight;


Config.stageBackgroundColor = '#ffffff';    //  ステージの背景色
Config.scoreBackgroundColor = '#24c0bb';    //  スコアの背景色

Config.freeFallingSpeed = 16;               //  自由落下のスピード
Config.erasePuyoCount = 8;                  //  何個揃ったらぷよを消すか
Config.eraseAnimationDuration = 30;         //  何フレームでぷよを消すか

Config.puyoColors = 10;                      //  何色のぷよを使うか
Config.playerFallingSpeed = 1;            //  プレイ中の自然落下のスピード
Config.playerDownSpeed = 10;                //  プレイ中の下キー押下時の落下スピード
Config.playerGroundFrame = 20;              //  何フレーム設置したらぷよを固定するか
Config.playerMoveFrame = 10;                //  左右移動に消費するフレーム数
Config.playerRotateFrame = 10;              //  回転に表皮するフレーム数

Config.zenkeshiDuration = 150;              //  全消し時のアニメーションミリセカンド
Config.gameOverFrame = 3000;                //  ゲームオーバー演出のサイクルフレーム



