// Google Apps Script 網址
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuTIRXY2Zdu6vqgxJORhAwydyAKjBETy56o3kj8KpRKgA1uYgO-QReE78lzOhPKHpF/exec';

let comments = [];
let knockCount = 0;
let hasKnocked = false;
let isMobile = false;

// 進入主畫面
function enterMainScreen() {
    console.log('進入主畫面');
    const tvScreen = document.getElementById('tvScreen');
    const mainScreen = document.getElementById('mainScreen');
    
    if (!tvScreen || !mainScreen) {
        console.error('找不到必要元素');
        return;
    }
    
    // 淡出入站圖
    tvScreen.style.opacity = '0';
    
    setTimeout(() => {
        tvScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        
        // 淡入主畫面
        setTimeout(() => {
            mainScreen.classList.add('fade-in');
        }, 50);
        
        // 載入留言
        loadComments();
    }, 500);
}

// 敲門功能 - 更新版
function knockDoor() {
    console.log('敲門功能觸發');
    const input = document.getElementById('storyInput');
    const content = input.value.trim();
    
    if (content === '') {
        alert('請輸入你的想法再敲門');
        return;
    }
    
    // 播放滿版GIF動畫
    playFullscreenGif();
    
    // 建立留言物件
    const comment = {
        nickname: '匿名房客',
        content: content,
        timestamp: new Date().toLocaleString('zh-TW')
    };
    
    // 發送到 Google 試算表
    submitComment(comment);
    
    // 清空輸入框
    input.value = '';
    
    hasKnocked = true;
}

// 播放滿版GIF - 修改版本：直接顯示/隱藏，播放一次後自動消失
function playFullscreenGif() {
    console.log('開始播放 GIF');
    
    const doorImage = document.getElementById('doorImage');
    const fullscreenContainer = document.getElementById('fullscreenGifContainer');
    const fullscreenGifImage = document.getElementById('fullscreenGifImage');
    
    // 根據設備選擇對應的GIF
    let gifUrl;
    if (isMobile) {
        gifUrl = doorImage.getAttribute('data-animated-mobile');
        console.log('使用手機版 GIF:', gifUrl);
    } else {
        gifUrl = doorImage.getAttribute('data-animated-desktop');
        console.log('使用桌面版 GIF:', gifUrl);
    }
    
    // 檢查 GIF URL 是否有效
    if (!gifUrl || gifUrl.includes('https://i.meee.com.tw/v5rbkPs.gif')) {
        console.log('GIF URL 無效，使用預設桌面版 GIF');
        gifUrl = 'https://i.meee.com.tw/RZ76tn1.gif';
    }
    
    // 添加播放次數控制參數，確保重新載入GIF
    const timestamp = new Date().getTime();
    const gifUrlWithTimestamp = `${gifUrl}?t=${timestamp}`;
    
    console.log('最終 GIF URL:', gifUrlWithTimestamp);
    
    // 直接顯示容器（無動畫效果）
    fullscreenContainer.style.display = 'flex';
    fullscreenContainer.style.position = 'fixed';
    fullscreenContainer.style.top = '0';
    fullscreenContainer.style.left = '0';
    fullscreenContainer.style.width = '100vw';
    fullscreenContainer.style.height = '100vh';
    fullscreenContainer.style.zIndex = '999';
    fullscreenContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    
    // 設置GIF
    fullscreenGifImage.src = gifUrlWithTimestamp;
    fullscreenGifImage.style.width = '100%';
    fullscreenGifImage.style.height = '100%';
    fullscreenGifImage.style.objectFit = 'cover';
    
    console.log('GIF 開始播放');
    
    // 監聽 GIF 載入完成事件
    fullscreenGifImage.onload = function() {
        console.log('GIF 載入完成');
        
        // 預估 GIF 播放時間（根據你的 GIF 實際長度調整）
        // 如果你的 GIF 是 3 秒，就設定 3000ms
        const gifDuration = 7900; // 3秒，請根據你的 GIF 實際長度調整
        
        setTimeout(() => {
            closeFullscreenGif();
        }, gifDuration);
    };
    
    // 如果 GIF 載入失敗，設定備用計時器
    fullscreenGifImage.onerror = function() {
        console.log('GIF 載入失敗，使用備用計時器');
        setTimeout(() => {
            closeFullscreenGif();
        }, 3000);
    };
}

// 關閉滿版GIF - 修改版本：直接隱藏，無動畫效果
function closeFullscreenGif() {
    console.log('關閉 GIF 播放');
    
    const fullscreenContainer = document.getElementById('fullscreenGifContainer');
    const fullscreenGifImage = document.getElementById('fullscreenGifImage');
    
    // 直接隱藏容器（無動畫效果）
    fullscreenContainer.style.display = 'none';
    
    // 清空src以停止GIF播放並釋放記憶體
    fullscreenGifImage.src = '';
    
    // 清除事件監聽器
    fullscreenGifImage.onload = null;
    fullscreenGifImage.onerror = null;
    
    console.log('GIF 已關閉');
}

// 提交留言到 Google 試算表
async function submitComment(comment) {
    const knockButtonImg = document.getElementById('knockButtonImg');
    
    // 顯示載入狀態
    knockButtonImg.style.opacity = '0.5';
    knockButtonImg.style.pointerEvents = 'none';
    
    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(comment),
            mode: 'no-cors'
        });
        
        // 樂觀更新
        knockCount++;
        comments.push(comment);
        
        // 等待一下再重新載入留言
        setTimeout(loadComments, 1500);
        
    } catch (error) {
        console.error('儲存留言失敗:', error);
        alert('儲存留言失敗，請稍後再試');
    } finally {
        // 恢復按鈕狀態
        knockButtonImg.style.opacity = '1';
        knockButtonImg.style.pointerEvents = 'auto';
    }
}

// 顯示留言
function showComments() {
    console.log('顯示留言視窗');
    
    const popup = document.getElementById('commentsPopup');
    popup.style.display = 'flex';
    updateCommentsList();
}

// 關閉留言視窗
function closeComments() {
    console.log('關閉留言視窗');
    const popup = document.getElementById('commentsPopup');
    popup.style.display = 'none';
}

// 更新留言列表
function updateCommentsList() {
    const commentsList = document.getElementById('commentsList');
    
    if (!commentsList) return;
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="empty-message">還沒有房客留言...</div>';
        return;
    }

    // 創建留言的副本並排序（最新的在最上面）
    const sortedComments = [...comments].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    let html = '';
    sortedComments.forEach(comment => {
        html += `
            <div class="comment-item">
                <div class="comment-nickname">${comment.nickname}</div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `;
    });
    
    commentsList.innerHTML = html;
}

// 從 Google 試算表載入留言
async function loadComments() {
    try {
        console.log('正在載入留言...');
        
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'GET',
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error('網路回應錯誤');
        }
        
        const data = await response.json();
        console.log('載入成功，留言數量:', data.comments.length);
        
        // 更新留言和敲門次數
        comments = data.comments || [];
        knockCount = data.knockCount || 0;
        
    } catch (error) {
        console.error('載入留言失敗:', error);
        // 使用空陣列作為預設值
        comments = [];
        knockCount = 0;
    }
}

// 裝置檢測和響應式調整
function detectDevice() {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    
    // 檢測是否為手機或平板
    isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || screenWidth <= 768;
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        switchToMobileImages();
    } else {
        document.body.classList.add('desktop-device');
        switchToDesktopImages();
    }
}

// 切換到手機版圖片
function switchToMobileImages() {
    // 更新入站圖
    const entranceImage = document.getElementById('entranceImage');
    if (entranceImage) {
        entranceImage.src = 'https://i.meee.com.tw/NhOEvnM.webp';
    }
    
    // 更新背景圖
    const background = document.querySelector('.background');
    if (background) {
        background.style.backgroundImage = "url('https://i.meee.com.tw/sp9Lz1z.webp')";
    }
    
    // 更新門圖片
    const doorImage = document.getElementById('doorImage');
    if (doorImage) {
        const staticMobile = doorImage.getAttribute('data-static-mobile');
        if (staticMobile) {
            doorImage.src = staticMobile;
        }
    }
    
    // 更新對話框背景
    const dialogWindow = document.querySelector('.dialog-window');
    if (dialogWindow) {
        dialogWindow.style.backgroundImage = "url('https://i.meee.com.tw/83CYVJP.webp')";
    }
    
    // 更新頭像
    const avatarImage = document.getElementById('avatarImage');
    if (avatarImage) {
        avatarImage.src = 'https://i.meee.com.tw/26IkL3D.webp';
    }
    
    // 更新按鍵
    const knockButtonImg = document.getElementById('knockButtonImg');
    if (knockButtonImg) {
        knockButtonImg.src = 'https://i.meee.com.tw/pP5aPiF.webp';
    }
    
    const viewCommentsButtonImg = document.getElementById('viewCommentsButtonImg');
    if (viewCommentsButtonImg) {
        viewCommentsButtonImg.src = 'https://i.meee.com.tw/9qOH7iZ.webp';
    }
    
    // 更新關閉按鈕
    const closeButtonImg = document.getElementById('closeButtonImg');
    if (closeButtonImg) {
        closeButtonImg.src = 'https://i.meee.com.tw/cP4tCTA.webp';
    }
}

// 切換到桌面版圖片
function switchToDesktopImages() {
    // 保持預設圖片即可，因為 HTML 中已經是桌面版圖片
    console.log('使用桌面版圖片');
}

// 處理觸控事件優化
// 處理觸控事件優化 - 修正版
function initTouchEvents() {
    // 移除防止雙擊縮放的程式碼，允許正常縮放
    // 以下程式碼已註解掉
    /*
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    */
    
    // 改善按鍵觸控體驗（保留這部分）
    const imageButtons = document.querySelectorAll('.dialog-button-img, .close-button-img');
    imageButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('touchcancel', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// 優化滾動體驗
// 優化滾動體驗 - 修正版
function initScrollOptimization() {
    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
        // 為留言列表添加慣性滾動
        commentsList.style.webkitOverflowScrolling = 'touch';
        commentsList.style.overflowScrolling = 'touch';
    }
    
    // 只阻止非必要區域的滾動，但允許縮放
    document.body.addEventListener('touchmove', function(e) {
        // 檢查是否為縮放手勢（多點觸控）
        if (e.touches.length > 1) {
            return; // 允許縮放手勢
        }
        
        // 只允許留言列表和輸入框內部滾動
        if (!e.target.closest('.comments-list') && !e.target.closest('.story-textarea')) {
            e.preventDefault();
        }
    }, { passive: false });
}
// 處理虛擬鍵盤 - 修正版
function handleVirtualKeyboard() {
    const storyTextarea = document.getElementById('storyInput');
    if (!storyTextarea) return;
    
    storyTextarea.addEventListener('focus', function() {
        // 移除強制字體大小設定，防止自動放大
        // this.style.fontSize = '16px'; // 刪除這行
        
        // 虛擬鍵盤出現時的處理，但不調整整體縮放
        setTimeout(() => {
            const dialogWindow = document.querySelector('.dialog-window');
            if (dialogWindow && window.innerHeight < 500) {
                // 僅調整位置，不影響縮放
                dialogWindow.style.transform = 'translateX(-50%) translateY(-10px)';
            }
        }, 300);
    });
    
    storyTextarea.addEventListener('blur', function() {
        // 虚擬鍵盤隱藏時恢復
        setTimeout(() => {
            const dialogWindow = document.querySelector('.dialog-window');
            if (dialogWindow) {
                dialogWindow.style.transform = 'translateX(-50%)';
            }
        }, 300);
    });
}

// 預加載圖片
function preloadImages() {
    const imageUrls = [
        'https://i.meee.com.tw/NhOEvnM.webp', // 手機版入站圖
        'https://i.meee.com.tw/sp9Lz1z.webp', // 手機版背景
        'https://i.meee.com.tw/bkzauNR.webp', // 手機版門
        'https://i.meee.com.tw/RZ76tn1.gif',  // 桌面版門動畫
        'https://i.meee.com.tw/v5rbkPs.gif',  // 手機版門動畫 (使用相同的GIF)
        'https://i.meee.com.tw/26IkL3D.webp', // 手機版頭像
        'https://i.meee.com.tw/pP5aPiF.webp', // 手機版敲門按鈕
        'https://i.meee.com.tw/9qOH7iZ.webp', // 手機版查看留言按鈕
        'https://i.meee.com.tw/WRr2gEt.webp'  // 手機版電話插圖
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// 點擊彈出視窗外部關閉
document.addEventListener('click', function(event) {
    const popup = document.getElementById('commentsPopup');
    const fullscreenContainer = document.getElementById('fullscreenGifContainer');
    
    // 關閉留言視窗
    if (event.target === popup && popup.style.display === 'flex') {
        closeComments();
    }
    
    // 點擊滿版GIF容器關閉動畫
    if (event.target === fullscreenContainer || event.target.closest('.fullscreen-gif-container')) {
        closeFullscreenGif();
    }
});

// DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 載入完成，開始初始化');
    
    // 綁定點擊事件到電視螢幕
    const tvScreen = document.getElementById('tvScreen');
    if (tvScreen) {
        tvScreen.addEventListener('click', enterMainScreen);
        console.log('已綁定入站圖點擊事件');
    }
    
    // 載入留言數據
    loadComments();
    
    // 每10秒自動重新載入留言
    setInterval(loadComments, 10000);
    
    // 初始化響應式功能
    detectDevice();
    initTouchEvents();
    initScrollOptimization();
    handleVirtualKeyboard();
    
    // 預加載圖片
    preloadImages();
});

// 監聽螢幕方向變化
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        // 重新調整佈局
        detectDevice();
    }, 100);
});
