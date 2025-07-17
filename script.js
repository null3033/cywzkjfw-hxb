// 文档加载完成后执行初始化操作
document.addEventListener('DOMContentLoaded', function () {
    initAll();
});

// 初始化所有功能
function initAll() {
    initNavigation();
    initCalendar();
    initPhotoModal();
    initStudentList();
    initMessageBoard();
    initLoadMorePhotos();
    initSocialModals();
    simulateLoadNotices();
}

// 初始化导航菜单
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // 移除所有active类
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));

            // 添加active类到当前点击的链接和对应的section
            this.classList.add('active');
            const sectionId = this.getAttribute('href');
            document.querySelector(sectionId).classList.add('active-section');

            // 平滑滚动到对应区域
            scrollToSection(sectionId);
        });
    });
}

// 平滑滚动到指定区域
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 60,
            behavior: 'smooth'
        });
    }
}

// 初始化日历
function initCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    if (!calendarGrid) return;

    let currentDate = new Date();

    function renderCalendar() {
        // 清除现有日历
        calendarGrid.innerHTML = '';

        // 设置月份标题
        currentMonthEl.textContent = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;

        // 获取当月第一天和最后一天
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // 添加星期标题
        addDayHeaders();

        // 获取第一天是星期几 (0-6)
        const firstDayOfWeek = firstDay.getDay();

        // 添加上个月的几天
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            addCalendarDay(prevMonthLastDay - i, true);
        }

        // 添加当月的天数
        const today = new Date();
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const isToday = currentDate.getFullYear() === today.getFullYear() &&
                currentDate.getMonth() === today.getMonth() &&
                i === today.getDate();

            addCalendarDay(i, false, isToday);

            // 添加事件标记
            const eventDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            addEventsToDay(eventDate);
        }

        // 计算剩余格子并添加下个月的几天
        const totalCells = firstDayOfWeek + lastDay.getDate();
        const remainingCells = 42 - totalCells; // 6行x7天=42格

        for (let i = 1; i <= remainingCells; i++) {
            addCalendarDay(i, true);
        }
    }

    // 添加星期标题
    function addDayHeaders() {
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
    }

    // 添加日历日期格子
    function addCalendarDay(dayNumber, isOtherMonth, isToday = false) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }

        if (isToday) {
            dayElement.classList.add('today');
        }

        dayElement.innerHTML = `<div class="calendar-day-number">${dayNumber}</div>`;
        calendarGrid.appendChild(dayElement);
    }

    // 为日期添加事件标记
    function addEventsToDay(dateString) {
        const events = document.querySelectorAll(`.calendar-events li[data-date="${dateString}"]`);
        const dayElements = document.querySelectorAll('.calendar-day');
        const currentDayElement = dayElements[dayElements.length - 1];

        if (events.length > 0 && currentDayElement) {
            events.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'calendar-event';
                eventElement.textContent = event.textContent.split('：')[1];
                currentDayElement.appendChild(eventElement);
            });
        }
    }

    // 初始化日历
    renderCalendar();

    // 上个月按钮
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    // 下个月按钮
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

// 初始化相册模态框
function initPhotoModal() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const photoModal = document.querySelector('.photo-modal');

    if (!galleryItems.length || !photoModal) return;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalImg = photoModal.querySelector('.modal-image');
            const modalCaption = photoModal.querySelector('.modal-caption');

            modalImg.src = item.src;
            modalCaption.textContent = item.parentElement.querySelector('p').textContent;
            showModal(photoModal);
        });
    });

    // 绑定关闭事件
    bindModalCloseEvents(photoModal);
}

// 初始化列表
function initStudentList() {
    const students = [
        { id: 1, name: '免责声明：本网站所提供的信息仅供参考。我们尽力确保内容的准确性，但不保证所有信息完全无误。用户因依赖本网站信息而采取的任何行动，风险自负。本网站不对由此产生的任何直接或间接损失承担责任。' },
        
    ];

    const studentListContainer = document.getElementById('student-list');
    if (!studentListContainer) return;

    students.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className ='student-card';
        studentCard.innerHTML = `
            <h3 class="student-name">${student.name}</h3>
        `;
        studentListContainer.appendChild(studentCard);
    });
}

// 初始化留言板
function initMessageBoard() {
    const messageForm = document.getElementById('message-form');
    const messageList = document.querySelector('.message-list');

    if (!messageForm ||!messageList) return;

    messageForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const content = document.getElementById('content').value.trim();

        if (!name ||!content) {
            alert('请填写姓名和留言内容！');
            return;
        }

        const now = new Date();
        const timeString = formatDateTime(now);

        // 创建新的留言元素
        const newMessage = document.createElement('div');
        newMessage.className ='message-item';
        newMessage.innerHTML = `
            <p class="message-author">${name} <span class="message-time">${timeString}</span></p>
            <p class="message-content">${content}</p>
        `;

        // 添加到留言列表顶部
        messageList.insertBefore(newMessage, messageList.children[1]);

        // 清空表单
        this.reset();

        // 显示成功消息
        showAlert('留言提交成功！','success');
    });
}

// 格式化日期时间
function formatDateTime(date) {
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(/\//g, '-');
}

// 显示模态框
function showModal(modal) {
    if (!modal) return;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 绑定模态框关闭事件
function bindModalCloseEvents(modal) {
    // 关闭按钮
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}



// 添加日历事件
function addCalendarEvent(date, eventText) {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;

    const eventItem = document.createElement('li');
    eventItem.setAttribute('data-date', date);
    eventItem.textContent = eventText;
    eventsList.appendChild(eventItem);
}

// 显示提示信息
function showAlert(message, type = 'info') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert-box ${type}`;
    alertBox.textContent = message;

    document.body.appendChild(alertBox);

    // 3秒后自动消失
    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => {
            alertBox.remove();
        }, 300);
    }, 3000);
}

// 背景音乐播放器
const musicPlayer = document.createElement('div');
musicPlayer.className ='music-player';
musicPlayer.innerHTML = `
    <div class="player-header">
        <h4>背景音乐</h4>
        <button id="toggle-player" class="toggle-btn">
            <i class="fas fa-chevron-up"></i>
        </button>
    </div>
    <div class="player-content">
        <div class="current-song">
            <div class="song-info">
                <h5 id="current-song-title">准备加载音乐...</h5>
                <div class="progress-bar">
                    <div class="progress" id="progress-bar"></div>
                </div>
            </div>
            <div class="controls">
                <button id="play-pause-btn" class="control-btn">
                    <i class="fas fa-pause"></i>
                </button>
                <button id="next-btn" class="control-btn">
                    <i class="fas fa-forward"></i>
                </button>
            </div>
        </div>
        <div class="playlist">
            <ul id="playlist">
                <li class="song-item active">起风了</li>
                <li class="song-item">同桌的你</li>
                <li class="song-item">记念</li>
                <li class="song-item">骄傲的少年</li>
                <li class="song-item">一路生花</li>
            </ul>
        </div>
    </div>
`;

// 添加到页面
document.body.appendChild(musicPlayer);

// 音乐列表
const songs = [
    { title: "起风了", src: "music/qfl.mp3" },
    { title: "同桌的你", src: "music/tzdn.mp3" },
    { title: "记念", src: "https://ss-mpvolc.meipian.me/wangyi/e3bfac989f91166ccede07a0b085fd87" },
    { title: "骄傲的少年", src: "music/jadsn.mp3" },
    { title: "一路生花", src: "music/ylsh.mp3" }
];

// 创建音频元素
const audio = document.createElement('audio');
audio.id = 'background-music';
audio.src = songs[0].src;
audio.loop = false;
audio.volume = 0.5;
document.body.appendChild(audio);

// 音乐控制变量
let currentSongIndex = 0;
let isPlaying = true;
let isPlayerExpanded = true;

// 元素引用
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentSongTitle = document.getElementById('current-song-title');
const playlistItems = document.querySelectorAll('.song-item');
const togglePlayerBtn = document.getElementById('toggle-player');
const playerContent = document.querySelector('.player-content');

// 2秒后加载并播放音乐
setTimeout(() => {
    loadSong(currentSongIndex);
    // 启用控制按钮
    playPauseBtn.disabled = false;
    nextBtn.disabled = false;
}, 2000);

// 播放/暂停按钮
playPauseBtn.addEventListener('click', function() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// 下一首按钮
nextBtn.addEventListener('click', function() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        audio.play().catch(e => console.log("自动播放被阻止:", e));
    }
});

// 加载歌曲
function loadSong(index) {
    // 更新活动歌曲样式
    playlistItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 更新状态显示
    currentSongTitle.textContent = `加载中：${songs[index].title}...`;

    // 加载并播放歌曲
    audio.src = songs[index].src;
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    currentSongTitle.textContent = `正在播放：${songs[index].title}`;
}

// 点击播放列表项
playlistItems.forEach((item, index) => {
    item.addEventListener('click', function() {
        currentSongIndex = index;
        loadSong(currentSongIndex);
    });
});

// 更新进度条
audio.addEventListener('timeupdate', function() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

// 歌曲结束自动播放下一首
audio.addEventListener('ended', function() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
});

// 切换播放器展开/收起状态
togglePlayerBtn.addEventListener('click', function() {
    isPlayerExpanded = !isPlayerExpanded;
    if (isPlayerExpanded) {
        playerContent.style.display = 'block';
        togglePlayerBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        playerContent.style.display = 'none';
        togglePlayerBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
});

// 初始加载第一首歌曲
loadSong(currentSongIndex);

// QQ群弹窗控制
function initQQModal() {
    try {
        const qqModal = document.querySelector('.qq-modal');
        const qqBtn = document.querySelector('.qq-link');
        
        if (!qqModal || !qqBtn) {
            console.warn('QQ弹窗相关元素未找到');
            return;
        }

        const closeBtn = qqModal.querySelector('.close-modal');
        const qrImage = qqModal.querySelector('.modal-image');
        
        // 图片加载失败处理
        if (qrImage) {
            qrImage.onerror = function() {
                console.error('QQ群二维码加载失败');
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#1e88e5"/><text x="50%" y="50%" font-size="16" dominant-baseline="middle" text-anchor="middle" fill="white">QQ群二维码图片丢失</text></svg>';
            };
        }

        // 打开弹窗
        qqBtn.addEventListener('click', function(e) {
            e.preventDefault();
            qqModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // 关闭其他可能打开的弹窗
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal !== qqModal) modal.style.display = 'none';
            });
        });

        // 关闭弹窗
        function closeModal() {
            qqModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        qqModal.addEventListener('click', function(e) {
            if (e.target === qqModal) closeModal();
        });

        console.log('QQ群弹窗初始化成功');
    } catch (error) {
        console.error('QQ群弹窗初始化失败:', error);
    }
}

// 微信增强版弹窗控制
function initWeixinModal() {
    try {
        const weixinModal = document.querySelector('.weixin-modal');
        const weixinBtn = document.querySelector('.weixin-link');
        
        if (!weixinModal || !weixinBtn) {
            console.warn('未找到微信弹窗相关元素');
            return;
        }

        const closeBtn = weixinModal.querySelector('.close-modal');
        const modalImage = weixinModal.querySelector('.modal-image');
        
        // 验证图片是否存在
        if (modalImage) {
            modalImage.onerror = function() {
                console.error('微信二维码图片加载失败');
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaa">二维码图片丢失</text></svg>';
            };
        }

        // 打开弹窗
        weixinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            weixinModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // 关闭弹窗
        function closeModal() {
            weixinModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        weixinModal.addEventListener('click', function(e) {
            if (e.target === weixinModal) {
                closeModal();
            }
        });

        console.log('微信弹窗初始化成功');
    } catch (error) {
        console.error('微信弹窗初始化失败:', error);
    }
}

// email增强版弹窗控制
function initemailModal() {
    try {
        const emailModal = document.querySelector('.email-modal');
        const emailBtn = document.querySelector('.email-link');
        
        if (!emailModal || !emailBtn) {
            console.warn('未找到email弹窗相关元素');
            return;
        }

        const closeBtn = emailModal.querySelector('.close-modal');
        const modalImage = emailModal.querySelector('.modal-image');
        
        // 打开弹窗
        emailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            emailModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // 关闭弹窗
        function closeModal() {
            emailModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        emailModal.addEventListener('click', function(e) {
            if (e.target === emailModal) {
                closeModal();
            }
        });

        console.log('email弹窗初始化成功');
    } catch (error) {
        console.error('email弹窗初始化失败:', error);
    }
}

// 初始化社交弹窗
function initSocialModals() {
    initQQModal();
    initWeixinModal();
    initemailModal();
}
/// 幻灯片轮播
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slides.length || !dots.length || !prevBtn || !nextBtn) return;
    
    // 设置轮播容器为相对定位
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.style.position = 'relative';
    }
    
    // 重新设置按钮样式和位置
    [prevBtn, nextBtn].forEach(btn => {
        btn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 36px;
            cursor: pointer;
            padding: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            transition: all 0.3s;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
        `;
        
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-50%) scale(1.2)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-50%) scale(1)';
        });
    });
    
    // 定位左右按钮
    prevBtn.style.left = '20px';
    nextBtn.style.right = '20px';
    
    let currentSlide = 0;
    let slideInterval;
    
    // 初始化第一张幻灯片
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    
    // 切换到下一张幻灯片
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // 切换到上一张幻灯片
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // 切换到指定幻灯片
    function goToSlide(n) {
        // 移除当前幻灯片的活动状态
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('exiting');
        
        // 更新导航点
        dots[currentSlide].classList.remove('active');
        
        // 计算新的幻灯片索引
        currentSlide = (n + slides.length) % slides.length;
        
        // 添加新幻灯片的活动状态
        slides[currentSlide].classList.add('active');
        slides[currentSlide].classList.remove('exiting', 'translate-x-full');
        
        // 更新导航点
        dots[currentSlide].classList.add('active');
        
        // 移除退出状态的幻灯片的exiting类（动画结束后）
        setTimeout(() => {
            slides.forEach(slide => {
                if (!slide.classList.contains('active')) {
                    slide.classList.remove('exiting');
                    slide.classList.add('translate-x-full');
                }
            });
        }, 1500); // 与过渡时间相同
    }
    
    // 点击导航点切换幻灯片
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentSlide) {
                goToSlide(index);
            }
        });
    });
    
    // 点击按钮切换幻灯片
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    // 自动轮播
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 8000);//显示时间
    }
    
    // 重置自动轮播
    function resetInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    // 开始自动轮播
    startSlideInterval();
    
    // 鼠标悬停时暂停轮播
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            startSlideInterval();
        });
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', initemailModal);


//禁止快捷键查看和控制源码
// 阻止F12及其他开发者工具快捷键
document.onkeydown = function(e) {
    if (e.key === 'F12' || e.keyCode === 123) {
        alert("禁止使用F12开发者工具！");
        return false;
    }
    // 阻止 Ctrl+Shift+I (Chrome DevTools)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
        alert("禁止打开开发者工具！");
        return false;
    }
    // 阻止 Ctrl+Shift+J (Chrome Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) {
        alert("禁止打开控制台！");
        return false;
    }
    // 阻止 Ctrl+U (查看源代码)
    if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
        alert("禁止查看网页源代码！");
        return false;
    }
};

// 阻止右键菜单并提示
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert("右键菜单已被禁用！");
});
    function showBlockedMessage(msg) {
        const msgBox = document.createElement("div");
        msgBox.className = "blocked-message";
        msgBox.textContent = msg;
        document.body.appendChild(msgBox);
        setTimeout(() => msgBox.remove(), 2000);
    }