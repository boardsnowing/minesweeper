/**
 * game.js
 * Initialize the game
 * Copyright (c) 2021 Yuya.Eguchi
*/

"use strict"

var draw;
var difficulty;

//起動されたときに呼ばれる関数を登録する
window.addEventListener("load", () =>
{
    //まずステージを整える
    difficulty = "easy";          //難易度
    draw = new Draw(difficulty);  //描画用クラス
    initialize(difficulty);
});


//Easyボタンが押下されたら難易度初級の設定でゲーム再起動
const easyButton = document.getElementById("easy");
easyButton.addEventListener("click", function(){
    //難易度はeasy
    difficulty = "easy";
    initialize(difficulty);
});

//middleボタンが押下されたら難易度中級の設定でゲーム再起動
let middleButton = document.getElementById("middle");
middleButton.addEventListener("click", function(){
    //難易度はmiddle
    difficulty = "middle";
    initialize(difficulty);
});

//hardボタンが押下されたら難易度上級の設定でゲーム再起動
let hardButton = document.getElementById("hard");
hardButton.addEventListener("click", function(){
    //難易度はhard
    difficulty = "hard";
    initialize(difficulty);
});

//resetボタンが押下されたら同じ難易度でゲーム再起動
let resetButton = document.getElementById("reset");
resetButton.addEventListener("click", ()=>{
    initialize(difficulty);
});


//初期化
function initialize(difficulty){
    draw.clearTimer();
    draw = new Draw(difficulty);
    draw.initialize();
}

