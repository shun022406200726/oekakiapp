// キャンバス要素を取得
const canvas = document.getElementById('drawingCanvas');
// 2D描画コンテキストを取得
const ctx = canvas.getContext('2d');
// 描画中かどうかを示すフラグ
let drawing = false;
// 現在の描画色
let currentColor = 'black';
// 現在のブラシサイズ
let currentBrushSize = 5;
// 背景画像を保持する変数
let backgroundImage = null;

// マウスイベント
// マウスボタンが押されたときに描画を開始
canvas.addEventListener('mousedown', () => drawing = true);
// マウスボタンが離されたときに描画を終了
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath(); // 新しいパスを開始
});
// マウスが動いたときに描画を行う
canvas.addEventListener('mousemove', draw);

// タッチイベント
// タッチが始まったときに描画を開始
canvas.addEventListener('touchstart', (e) => {
    drawing = true;
    e.preventDefault(); // デフォルトのタッチ動作を無効化
});
// タッチが終了したときに描画を終了
canvas.addEventListener('touchend', () => {
    drawing = false;
    ctx.beginPath(); // 新しいパスを開始
});
// タッチが移動したときに描画を行う
canvas.addEventListener('touchmove', (e) => {
    if (drawing) {
        const touch = e.touches[0];
        draw({ clientX: touch.clientX, clientY: touch.clientY });
    }
    e.preventDefault();
});

// 描画を行う関数
function draw(event) {
    if (!drawing) return; // 描画中でなければ終了
    ctx.lineWidth = currentBrushSize; // 線の太さを設定
    ctx.lineCap = 'round'; // 線の端を丸くする
    ctx.strokeStyle = currentColor; // 線の色を設定

    // 現在の位置に線を引く
    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke(); // 線を描画
    ctx.beginPath(); // 新しいパスを開始
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

// キャンバスをクリアする関数（背景画像を保持）
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバス全体をクリア
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
}

// 白紙に戻す関数
function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgroundImage = null;
}

// 描画色を変更する関数
function changeColor(color) {
    ctx.globalCompositeOperation = 'source-over';  // 通常の描画モードに戻す
    ctx.strokeStyle = color;
    // 消しゴムの選択を解除
    document.querySelector('.eraser').classList.remove('selected');
}

// ブラシサイズを変更する関数
function changeBrush(size) {
    currentBrushSize = size; // 現在のブラシサイズを更新
}

// 画像をキャンバスに描画する機能
const imageLoader = document.getElementById('imageLoader');
// 画像が選択されたときにhandleImage関数を呼び出す
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e) {
    const reader = new FileReader(); // ファイルリーダーを作成
    reader.onload = function(event) {
        const img = new Image(); // 新しい画像オブジェクトを作成
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 画像をキャンバスに描画
            backgroundImage = img; // 背景画像を保持
        }
        img.src = event.target.result; // 画像のソースを設定
    }
    reader.readAsDataURL(e.target.files[0]); // ファイルをデータURLとして読み込む
}

function activateEraser() {
    // 消しゴム機能の実装
    canvas.on('mouse:down', function(options) {
        if (isEraserActive) {
            var pointer = canvas.getPointer(options.e);
            var eraser = new fabric.Circle({
                left: pointer.x,
                top: pointer.y,
                radius: eraserSize,
                fill: 'white', // 背景色と同じ色
                selectable: false,
                evented: false
            });
            canvas.add(eraser);
            canvas.renderAll();
        }
    });
}

function setEraser() {
    ctx.globalCompositeOperation = 'destination-out';
    // 現在選択されているブラシボタンから selected クラスを削除
    document.querySelectorAll('.brush-button').forEach(button => {
        button.classList.remove('selected');
    });
    // 消しゴムボタンに selected クラスを追加
    document.querySelector('.eraser').classList.add('selected');
}