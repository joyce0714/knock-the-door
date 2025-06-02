// ========================================
// 整合版JavaScript - 保留第一版功能+新增功能
// ========================================

// Google Apps Script 網址
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuTIRXY2Zdu6vqgxJORhAwydyAKjBETy56o3kj8KpRKgA1uYgO-QReE78lzOhPKHpF/exec';

let comments = [];
let knockCount = 0;
let hasKnocked = false;
let isMobile = false;

// === 新增：點點內容數據 ===
const dotContents = {
    1: {
        title: "特殊內容 1 - YouTube 影片",
        type: "youtube",
        background: {
            desktop: "https://i.ibb.co/jv3V90QG/image.webp",
            mobile: "https://i.ibb.co/BVybXxYR/image.webp"
        },
        youtube: "uIp7X2MEXso"
    },
    2: {
        title: "內容 2",
        type: "image",
        image: {
            desktop: "https://i.meee.com.tw/uOMrC3v.gif",
            mobile: "https://i.meee.com.tw/rqlYUGE.gif"
        }
    },
    3: {
        title: "內容 3", 
        type: "image",
        image: {
            desktop: "https://i.ibb.co/39mk9dDS/image.webp",
            mobile: "https://i.ibb.co/WNVFWcPG/image.webp"
        }
    },
    4: {
        title: "內容 4",
        type: "image", 
        image: {
            desktop: "https://i.ibb.co/S7thv2RP/image.webp",
            mobile: "https://i.ibb.co/XZt7vVP1/image.webp"
        }
    },
    5: {
        title: "特殊內容 5 - 音檔集合",
        type: "audio",
        background: {
            desktop: "https://i.ibb.co/1Y3kr4BH/image.webp",
            mobile: "https://i.ibb.co/9H8Cdt30/image.webp"
        },
        audios: [
            { title: "音檔 1", url: "https://github.com/joyce0714/recording/raw/refs/heads/main/%E5%89%AA_%EF%BC%88%E6%84%9B%E6%81%A8%EF%BC%89%E6%88%91%E6%81%A8%E4%BD%A0%E4%BD%86%E6%88%91%E6%9C%83%E8%A8%98%E5%BE%97%E4%BD%A0.mp3" },
            { title: "音檔 2", url: "https://github.com/joyce0714/recording/raw/refs/heads/main/%E5%89%AA_%EF%BC%88%E8%87%AA%E5%B7%B1%EF%BC%89%E6%88%91%E6%98%AF%E6%9C%AA%E4%BE%86%E7%9A%84%E4%BD%A0%E7%8F%BE%E5%9C%A823.mp3" },
            { title: "音檔 3", url: "https://github.com/joyce0714/recording/raw/refs/heads/main/%E5%89%AA_%EF%BC%88%E8%A6%AA%E4%BA%BA%EF%BC%89%E9%98%BF%E5%AC%A4%E6%88%91%E5%A5%BD%E6%83%B3%E4%BD%A0.mp3" }
        ]
    },
    6: {
        title: "內容 6",
        type: "image",
        image: {
            desktop: "https://i.ibb.co/60854kvD/image.webp",
            mobile: "https://i.ibb.co/GGDQ6jr/image.webp"
        }
    },
    7: {
        title: "內容 7",
        type: "image",
        image: {
            desktop: "https://i.ibb.co/3Yy8GHY2/image.webp",
            mobile: "https://i.ibb.co/C59MJdT7/image.webp"
        }
    },
    8: {
        title: "內容 8",
        type: "image",
        image: {
            desktop: "https://i.ibb.co/3ym0bc3p/knockthedoor.webp",
            mobile: "https://i.ibb.co/Q5pp5pm/knockthedoor.webp"
        }
    }
};

// === 新增：音檔位置定義 ===
const audioPositionsDesktop = [
    { top: 15, left: 40 },      // 音檔1 - 左上
    { top: 45, right: 13 },     // 音檔2 - 右中
    { bottom: 10, right: 13 }   // 音檔3 - 下中
];

const audioPositionsMobile = [
    { top: 12, left: 32 },      // 音檔1 - 左上
    { top: 40, left: 32 },      // 音檔2 - 中間
    { bottom: 6, left: 32 }     // 音檔3 - 下中
];

let currentAudioPositions = audioPositionsDesktop;

// === 新增：點點位置定義 ===
const dotPositions = [
    { top: 7.5, left: 7 },     // 點點1
    { top: 10.5, left: 7 },    // 點點2  
    { top: 11.75, left: 12 },  // 點點3
    { top: 13, left: 20 },     // 點點4
    { top: 14.25, left: 20 },  // 點點5
    { top: 15.25, left: 7 },   // 點點6
    { top: 16.5, left: 39 },   // 點點7
    { top: 20, left: 19 }      // 點點8
];

// === 保留第一版：進入主畫面 ===
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
            
            // 新增：延遲顯示介紹彈窗
            setTimeout(() => {
                showIntroPopup();
            }, 800);
        }, 50);
        
        // 載入留言
        loadComments();
    }, 500);
}

// === 新增：顯示介紹彈窗 ===
function showIntroPopup() {
    console.log('顯示介紹彈窗');
    const introPopup = document.getElementById('introPopup');
    const introImage = document.getElementById('introImage');
    
    if (!introPopup || !introImage) {
        console.log('介紹彈窗元素不存在，跳過顯示');
        return;
    }
    
    if (isMobile) {
        const mobileImg = introImage.getAttribute('data-mobile');
        if (mobileImg) {
            introImage.src = mobileImg;
        }
    } else {
        const desktopImg = introImage.getAttribute('data-desktop');
        if (desktopImg) {
            introImage.src = desktopImg;
        }
    }
    
    introPopup.style.display = 'flex';
    
    // 重新定位點點
    setTimeout(() => {
        repositionDots();
    }, 100);
}

// === 新增：關閉介紹彈窗 ===
function closeIntroPopup() {
    console.log('關閉介紹彈窗');
    const introPopup = document.getElementById('introPopup');
    if (introPopup) {
        introPopup.style.display = 'none';
    }
}

// === 新增：開啟點點內容 ===
function openDotContent(dotNumber) {
    console.log(`🎯 打開點點 ${dotNumber} 的內容`);
    
    const popup = document.getElementById('dotContentPopup');
    const title = document.getElementById('dotContentTitle');
    const body = document.getElementById('dotContentBody');
    const content = dotContents[dotNumber];
    
    if (!content) {
        console.error(`找不到點點 ${dotNumber} 的內容`);
        return;
    }
    
    // 清空現有內容
    title.textContent = content.title;
    body.innerHTML = '';
    body.classList.remove('audio-content');
    
    const isCurrentlyMobile = window.innerWidth <= 768 || isMobile;
    
    // ========================================
    // 創建容器和透明按鈕
    // ========================================
    
    const dotContentContainer = document.createElement('div');
    dotContentContainer.className = 'dot-content-container';
    
    // 創建透明關閉按鈕
    const invisibleCloseButton = document.createElement('button');
    invisibleCloseButton.className = 'dot-content-invisible-close';
    invisibleCloseButton.setAttribute('aria-label', '關閉視窗');
    
    // 設置按鈕樣式 (先用可見版本確保正常)
    invisibleCloseButton.style.cssText = `
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        width: 80px !important;
        height: 80px !important;
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
        z-index: 2001 !important;
        outline: none !important;
        transition: background-color 0.2s ease !important;
    `;
    
    // hover 效果
    invisibleCloseButton.addEventListener('mouseenter', () => {
        invisibleCloseButton.style.background = 'rgba(255, 255, 255, 0)';
        invisibleCloseButton.style.borderRadius = '0 8px 0 8px';
    });
    
    invisibleCloseButton.addEventListener('mouseleave', () => {
        invisibleCloseButton.style.background = 'transparent';
        invisibleCloseButton.style.borderRadius = '0';
    });
    
    // 點擊事件
    invisibleCloseButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🎯 透明關閉按鈕被點擊！');
        closeDotContent();
    });
    
    // 鍵盤支援
    invisibleCloseButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            invisibleCloseButton.click();
        }
    });
    
    // ========================================
    // 處理不同類型的內容
    // ========================================
    
    switch (content.type) {
      // 在 openDotContent 函數中添加錯誤處理
    case 'youtube':
        const youtubeBackground = isCurrentlyMobile ? content.background.mobile : content.background.desktop;
        dotContentContainer.innerHTML = `
            <div class="dot-content-background" style="background-image: url('${youtubeBackground}');">
                <div class="dot-youtube-container">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/${content.youtube}?rel=0&modestbranding=1&autoplay=0"
                        frameborder="0" 
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        style="border-radius: 8px;">
                    </iframe>
                    <!-- 添加備用連結 -->
                    <div class="youtube-fallback" style="display: none;">
                        <a href="https://www.youtube.com/watch?v=${content.youtube}" target="_blank">
                            在 YouTube 中觀看
                        </a>
                    </div>
                </div>
            </div>`;

        // 檢測 iframe 載入失敗
        setTimeout(() => {
            const iframe = dotContentContainer.querySelector('iframe');
            const fallback = dotContentContainer.querySelector('.youtube-fallback');

            iframe.onerror = () => {
                iframe.style.display = 'none';
                fallback.style.display = 'block';
            };
        }, 1000);
        break;
            
        case 'audio':
            console.log('創建音檔內容');

            const audioBackground = isCurrentlyMobile ? content.background.mobile : content.background.desktop;

            // 創建背景元素
            const backgroundDiv = document.createElement('div');
            backgroundDiv.className = 'dot-content-background';
            backgroundDiv.style.backgroundImage = `url('${audioBackground}')`;
            dotContentContainer.appendChild(backgroundDiv);

            // 創建音檔定位容器
            const audioContainer = document.createElement('div');
            audioContainer.className = 'audio-items-container';
            dotContentContainer.appendChild(audioContainer);

            // 添加音檔內容類別
            body.classList.add('audio-content');

            // 生成音檔元件 - 使用 CSS 類別控制符號切換
            content.audios.forEach((audio, index) => {
                const audioItem = document.createElement('div');
                audioItem.className = 'dot-audio-item';

                // 創建隱藏的原生音檔元素
                const audioElement = document.createElement('audio');
                audioElement.id = `audio-element-${Date.now()}-${index}`;
                audioElement.preload = 'metadata';
                audioElement.style.display = 'none';

                const source = document.createElement('source');
                source.src = audio.url;
                source.type = 'audio/mpeg'; // 修正為正確的 MIME type

                audioElement.appendChild(source);
                audioItem.appendChild(audioElement);

                // 創建自定義播放器介面
                const customPlayer = document.createElement('div');
                customPlayer.className = 'audio-player';

                // 播放/暫停按鈕 - 使用 CSS 類別控制
                const playButton = document.createElement('div');
                playButton.className = 'play-button'; // 初始狀態：不包含 'playing' 類別

                const playIcon = document.createElement('span');
                playIcon.className = 'play-icon';
                playIcon.textContent = '⏵';

                const pauseIcon = document.createElement('span');
                pauseIcon.className = 'pause-icon';
                pauseIcon.textContent = '⏸';

                playButton.appendChild(playIcon);
                playButton.appendChild(pauseIcon);

                // 進度條容器
                const progressContainer = document.createElement('div');
                progressContainer.className = 'progress-container';
                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                progressContainer.appendChild(progressBar);

                // 時間顯示
                const timeDisplay = document.createElement('div');
                timeDisplay.className = 'time';
                timeDisplay.textContent = '0:00';

                // 組合播放器
                customPlayer.appendChild(playButton);
                customPlayer.appendChild(progressContainer);
                customPlayer.appendChild(timeDisplay);
                audioItem.appendChild(customPlayer);

                // 播放器邏輯 - 使用 CSS 類別控制符號
                let isPlaying = false;
                let isDragging = false;

                function formatTime(seconds) {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                }

                function updateProgress() {
                    if (!isDragging && audioElement.duration) {
                        const progress = (audioElement.currentTime / audioElement.duration) * 100;
                        progressBar.style.width = progress + '%';
                        timeDisplay.textContent = formatTime(audioElement.currentTime);
                    }
                }

                // 修正：使用 CSS 類別控制符號切換
                function updatePlayPauseButton(playing) {
                    console.log(`更新播放按鈕狀態: ${playing ? '播放中' : '暫停'}`);
                    if (playing) {
                        playButton.classList.add('playing');
                        console.log('添加 playing 類別');
                    } else {
                        playButton.classList.remove('playing');
                        console.log('移除 playing 類別');
                    }
                }

                // 修正：重置所有其他播放器的狀態
                function resetOtherPlayButtons() {
                    document.querySelectorAll('.play-button').forEach(otherButton => {
                        if (otherButton !== playButton) {
                            otherButton.classList.remove('playing');
                        }
                    });
                }

                playButton.addEventListener('click', () => {
                    console.log('播放按鈕被點擊，當前狀態:', isPlaying);

                    if (isPlaying) {
                        console.log('暫停音檔');
                        audioElement.pause();
                    } else {
                        console.log('開始播放音檔');
                        // 暫停其他正在播放的音檔
                        document.querySelectorAll('audio').forEach(otherAudio => {
                            if (otherAudio !== audioElement && !otherAudio.paused) {
                                otherAudio.pause();
                            }
                        });

                        // 重置其他播放器的按鈕狀態
                        resetOtherPlayButtons();

                        audioElement.play().catch(error => {
                            console.error('播放失敗:', error);
                        });
                    }
                });

                progressContainer.addEventListener('click', (e) => {
                    if (audioElement.duration) {
                        const rect = progressContainer.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const width = rect.width;
                        const newTime = (clickX / width) * audioElement.duration;
                        audioElement.currentTime = newTime;
                    }
                });

                // 修正：音檔事件監聽器
                audioElement.addEventListener('play', () => {
                    console.log('音檔開始播放事件觸發');
                    isPlaying = true;
                    updatePlayPauseButton(true);
                });

                audioElement.addEventListener('pause', () => {
                    console.log('音檔暫停事件觸發');
                    isPlaying = false;
                    updatePlayPauseButton(false);
                });

                audioElement.addEventListener('ended', () => {
                    console.log('音檔播放結束事件觸發');
                    isPlaying = false;
                    updatePlayPauseButton(false);
                    progressBar.style.width = '0%';
                    timeDisplay.textContent = '0:00';
                });

                // 載入事件
                audioElement.addEventListener('loadedmetadata', () => {
                    console.log('音檔元數據載入完成');
                    if (audioElement.duration && !isNaN(audioElement.duration)) {
                        timeDisplay.textContent = formatTime(audioElement.duration);
                    }
                });

                // 錯誤處理
                audioElement.addEventListener('error', (e) => {
                    console.error('音檔載入錯誤:', e);
                    timeDisplay.textContent = '錯誤';
                });

                audioElement.addEventListener('timeupdate', updateProgress);

                audioContainer.appendChild(audioItem);
            });

            setTimeout(() => {
                repositionAudioItems();
            }, 150);

            break;
            
        case 'image':
        default:
            const imageUrl = isCurrentlyMobile ? content.image.mobile : content.image.desktop;
            dotContentContainer.innerHTML = `<img src="${imageUrl}" alt="${content.title}" class="dot-content-image">`;
            break;
    }
    
    // ========================================
    // 重要：最後添加透明按鈕到容器
    // ========================================
    dotContentContainer.appendChild(invisibleCloseButton);
    
    // 將容器添加到 body
    body.appendChild(dotContentContainer);
    
    // 顯示 popup
    popup.style.display = 'flex';
    
    console.log('✅ 透明關閉按鈕已成功添加');
}

// === 新增：關閉點點內容彈窗 ===
function closeDotContent() {
    console.log('關閉點點內容');
    const popup = document.getElementById('dotContentPopup');
    const body = document.getElementById('dotContentBody');
    
    body.classList.remove('audio-content');
    body.innerHTML = '';
    popup.style.display = 'none';
}

// === 新增：音檔重新定位 ===
function repositionAudioItems() {
    console.log('開始重新定位音檔...');
    
    const container = document.querySelector('.dot-content-container');
    const audioContainer = document.querySelector('.audio-items-container');
    const audioItems = document.querySelectorAll('.dot-audio-item');
    
    if (!container || !audioContainer || audioItems.length === 0) {
        console.log('找不到必要的音檔元素');
        return;
    }
    
    const containerRect = container.getBoundingClientRect();
    const containerDisplayWidth = containerRect.width;
    const containerDisplayHeight = containerRect.height;
    
    const isMobileView = window.innerWidth <= 768;
    currentAudioPositions = isMobileView ? audioPositionsMobile : audioPositionsDesktop;
    
    audioItems.forEach((audioItem, index) => {
        if (index < currentAudioPositions.length) {
            const position = currentAudioPositions[index];
            
            // 強制移除所有CSS定位樣式
            audioItem.style.removeProperty('top');
            audioItem.style.removeProperty('left');
            audioItem.style.removeProperty('right');
            audioItem.style.removeProperty('bottom');
            audioItem.style.removeProperty('transform');
            
            audioItem.style.setProperty('position', 'absolute', 'important');
            
            if (position.top !== undefined) {
                const topPx = (position.top / 100) * containerDisplayHeight;
                audioItem.style.setProperty('top', `${topPx}px`, 'important');
            }
            
            if (position.bottom !== undefined) {
                const bottomPx = (position.bottom / 100) * containerDisplayHeight;
                audioItem.style.setProperty('bottom', `${bottomPx}px`, 'important');
            }
            
            if (position.left !== undefined) {
                const leftPx = (position.left / 100) * containerDisplayWidth;
                audioItem.style.setProperty('left', `${leftPx}px`, 'important');
            }
            
            if (position.right !== undefined) {
                const rightPx = (position.right / 100) * containerDisplayWidth;
                audioItem.style.setProperty('right', `${rightPx}px`, 'important');
            }
            
            if (position.centerX !== undefined) {
                const centerXPx = (position.centerX / 100) * containerDisplayWidth;
                audioItem.style.setProperty('left', `${centerXPx}px`, 'important');
                audioItem.style.setProperty('transform', 'translateX(-50%)', 'important');
            }
            
            audioItem.offsetHeight; // 強制重新計算樣式
        }
    });
}

// === 新增：點點重新定位 ===
function repositionDots() {
    const image = document.querySelector('.intro-image');
    const dotsContainer = document.querySelector('.intro-dots-container');
    const dots = document.querySelectorAll('.intro-dot');
    
    if (!image || !dotsContainer || dots.length === 0) {
        return;
    }
    
    if (!image.complete) {
        image.onload = repositionDots;
        return;
    }
    
    const imageRect = image.getBoundingClientRect();
    const imageDisplayWidth = imageRect.width;
    const imageDisplayHeight = imageRect.height;
    
    // 手機版使用不同的位置
    let positions = dotPositions;
    if (window.innerWidth <= 768) {
        positions = [
            { top: 9.25, left: 7 },   // 點點1
            { top: 13.75, left: 11 },    // 點點2  
            { top: 15.25, left: 20 },    // 點點3
            { top: 16.75, left: 30 },  // 點點4
            { top: 18.5, left: 30 },    // 點點5
            { top: 20, left: 11 },  // 點點6
            { top: 21.75, left: 68 },  // 點點7
            { top: 27.75, left: 29 }     // 點點8
        ];
    }
    
    dots.forEach((dot, index) => {
        if (index < positions.length) {
            const position = positions[index];
            
            const topPx = (position.top / 100) * imageDisplayHeight;
            const leftPx = (position.left / 100) * imageDisplayWidth;
            
            dot.style.top = `${topPx}px`;
            dot.style.left = `${leftPx}px`;
        }
    });
}

// === 保留第一版：敲門功能 ===
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

// === 保留第一版：播放滿版GIF ===
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
        const gifDuration = 7900; // 7.9秒
        
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

// === 保留第一版：關閉滿版GIF ===
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

// === 保留第一版：提交留言到 Google 試算表 ===
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

// === 保留第一版：顯示留言 ===
function showComments() {
    console.log('顯示留言視窗');
    
    const popup = document.getElementById('commentsPopup');
    popup.style.display = 'flex';
    updateCommentsList();
}

// === 保留第一版：關閉留言視窗 ===
function closeComments() {
    console.log('關閉留言視窗');
    const popup = document.getElementById('commentsPopup');
    popup.style.display = 'none';
}

// === 保留第一版：更新留言列表 ===
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

// === 保留第一版：從 Google 試算表載入留言 ===
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

// === 保留第一版：裝置檢測和響應式調整 ===
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

// === 保留第一版：切換到手機版圖片 ===
function switchToMobileImages() {
    // 更新入站圖
    const entranceImage = document.getElementById('entranceImage');
    if (entranceImage) {
        entranceImage.src = 'https://i.ibb.co/99H3pD9y/image.webp';
    }
    
    // 更新背景圖
    const background = document.querySelector('.background');
    if (background) {
        background.style.backgroundImage = "url('https://i.meee.com.tw/sp9Lz1z.webp')";
    }
    
    // 新增：更新門鈴圖片
    const doorbellImage = document.getElementById('doorbellImage');
    if (doorbellImage) {
        const mobileDoorbell = doorbellImage.getAttribute('data-mobile');
        if (mobileDoorbell) {
            doorbellImage.src = mobileDoorbell;
        }
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

// === 保留第一版：切換到桌面版圖片 ===
function switchToDesktopImages() {
    // 保持預設圖片即可，因為 HTML 中已經是桌面版圖片
    console.log('使用桌面版圖片');
}

// === 保留第一版：處理觸控事件優化 ===
function initTouchEvents() {
    // 改善按鍵觸控體驗（保留這部分）
    const imageButtons = document.querySelectorAll('.dialog-button-img, .close-button-img, .intro-close-button-img, .intro-dot');
    imageButtons.forEach(button => {
        if (button) {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
            
            button.addEventListener('touchcancel', function() {
                this.style.transform = 'scale(1)';
            });
        }
    });
}

// === 保留第一版：優化滾動體驗 ===
function initScrollOptimization() {
    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
        // 為留言列表添加慣性滾動
        commentsList.style.webkitOverflowScrolling = 'touch';
        commentsList.style.overflowScrolling = 'touch';
    }
    
    // 新增：為介紹彈窗添加滾動支援
    const introPopupContent = document.querySelector('.intro-popup-content');
    if (introPopupContent) {
        introPopupContent.style.webkitOverflowScrolling = 'touch';
        introPopupContent.style.overflowScrolling = 'touch';
    }
    
    const dotContentBody = document.getElementById('dotContentBody');
    if (dotContentBody) {
        dotContentBody.style.webkitOverflowScrolling = 'touch';
        dotContentBody.style.overflowScrolling = 'touch';
    }
    
    // 只允許特定區域滾動，但允許縮放
    document.body.addEventListener('touchmove', function(e) {
        // 檢查是否為縮放手勢（多點觸控）
        if (e.touches.length > 1) {
            return; // 允許縮放手勢
        }
        
        // 允許的滾動區域
        const scrollableSelectors = [
            '.comments-list',
            '.story-textarea',
            '.intro-popup-content',
            '.dot-content-body'
        ];
        
        const isInScrollableArea = scrollableSelectors.some(selector => e.target.closest(selector));
        
        if (!isInScrollableArea) {
            e.preventDefault();
        }
    }, { passive: false });
}

// === 保留第一版：處理虛擬鍵盤 ===
function handleVirtualKeyboard() {
    const storyTextarea = document.getElementById('storyInput');
    if (!storyTextarea) return;
    
    storyTextarea.addEventListener('focus', function() {
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

// === 新增：初始化點點定位 ===
function initDotPositioning() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', repositionDots);
    } else {
        repositionDots();
    }
    
    window.addEventListener('resize', repositionDots);
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.classList.contains('intro-popup') &&
                    target.style.display !== 'none') {
                    setTimeout(repositionDots, 100);
                }
            }
        });
    });
    
    const popup = document.querySelector('.intro-popup');
    if (popup) {
        observer.observe(popup, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
    
    const introImage = document.querySelector('.intro-image');
    if (introImage) {
        introImage.addEventListener('load', repositionDots);
        
        if (introImage.complete) {
            setTimeout(repositionDots, 50);
        }
    }
}

// === 新增：初始化音檔定位系統 ===
function initAudioPositioning() {
    console.log('初始化音檔定位系統');
    
    // 視窗大小變化時重新定位
    window.addEventListener('resize', () => {
        console.log('視窗大小變化，重新定位音檔');
        setTimeout(repositionAudioItems, 100);
    });
    
    // 彈窗顯示時重新定位
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.id === 'dotContentPopup' &&
                    target.style.display === 'flex') {
                    setTimeout(() => {
                        const audioContainer = target.querySelector('.audio-items-container');
                        if (audioContainer) {
                            console.log('音檔彈窗顯示，重新定位');
                            repositionAudioItems();
                        }
                    }, 200);
                }
            }
        });
    });
    
    const popup = document.getElementById('dotContentPopup');
    if (popup) {
        observer.observe(popup, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
    
    console.log('音檔定位系統初始化完成');
}

// === 點擊彈出視窗外部關閉 ===
document.addEventListener('click', function(event) {
    const popup = document.getElementById('commentsPopup');
    const fullscreenContainer = document.getElementById('fullscreenGifContainer');
    const introPopup = document.getElementById('introPopup');
    const dotContentPopup = document.getElementById('dotContentPopup');
    
    // 關閉留言視窗
    if (popup && event.target === popup && popup.style.display === 'flex') {
        closeComments();
    }
    
    // 點擊滿版GIF容器關閉動畫
    if (fullscreenContainer && (event.target === fullscreenContainer || event.target.closest('.fullscreen-gif-container'))) {
        closeFullscreenGif();
    }
    
    // 新增：關閉介紹彈窗
    if (introPopup && event.target.classList.contains('intro-popup-overlay')) {
        closeIntroPopup();
    }
    
    // 新增：關閉點點內容彈窗
    if (dotContentPopup && event.target === dotContentPopup && dotContentPopup.style.display === 'flex') {
        closeDotContent();
    }
});

// === 新增：快捷鍵支援 ===
document.addEventListener('keydown', function(event) {
    // 按 ESC 鍵關閉彈窗
    if (event.key === 'Escape') {
        closeDotContent();
        closeComments();
        closeIntroPopup();
        closeFullscreenGif();
    }
});

// === DOM 載入完成後初始化 ===
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
    
    // 新增：初始化點點定位
    initDotPositioning();
    
    // 新增：初始化音檔定位系統
    initAudioPositioning();
    
    console.log('初始化完成');
});

// === 監聽螢幕方向變化 ===
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        // 重新調整佈局
        detectDevice();
        repositionDots();
    }, 100);
});
