// 版本信息配置
const appVersion = {
    number: '0.1.3',
    releaseDate: '2025-05-30',
    author: 'Administrator'
};



// 设置版本信息
document.querySelectorAll('.version-number').forEach(el => {
    el.textContent = `版本号：v${appVersion.number}`;
});
document.querySelectorAll('.version-date').forEach(el => {
    el.textContent = ` | 最后更新：${appVersion.releaseDate}`;
});
document.querySelectorAll('.version-author').forEach(el => {
    el.textContent = ` | 开发团者：${appVersion.author}`;
});

// 免责声明配置
const disclaimerConfig = {
    title: "免责声明",
    content: "本网站所提供的信息仅供参考。我们尽力确保内容的准确性，但不保证所有信息完全无误。用户因依赖本网站信息而采取的任何行动，风险自负。本网站不对由此产生的任何直接或间接损失承担责任。"
};

// 动态创建免责声明
function createDisclaimer() {
    const disclaimer = document.createElement("div");
    disclaimer.className = "disclaimer";

    const disclaimerText = document.createElement("p");
    disclaimerText.innerHTML = `<strong>${disclaimerConfig.title}：</strong>${disclaimerConfig.content}`;

    const versionInfo = document.createElement("div");
    versionInfo.className = "version-info";
    versionInfo.innerHTML = `
        <span class="version-number">版本号：v${appVersion.number}</span>
        <span class="version-date"> | 最后更新：${appVersion.releaseDate}</span>
        <span class="version-author"> | 开发团者：${appVersion.author}</span>
    `;

    disclaimer.appendChild(disclaimerText);
    disclaimer.appendChild(versionInfo);

    // 插入到页面底部（假设 .container 是父容器）
    const container = document.querySelector(".container");
    if (container) {
        container.appendChild(disclaimer);
    }
}

// 初始化时调用
createDisclaimer();
// 控制台输出版本信息（开发用）
console.log(`%c当前版本: v${appVersion.number}`, 'color: #4CAF50; font-weight: bold;');
console.log(`发布日期: ${appVersion.releaseDate}`);
console.log(`开发者: ${appVersion.author}`);



    // 页面路由处理
    if (!window.location.hash) {
        window.location.hash = "#index";
    }

    // 时间同步功能
    let offset = 0;

    function fetchTime() {
        fetch('https://worldtimeapi.org/api/ip')
           .then(response => response.json())
           .then(data => {
                const serverTime = new Date(data.datetime).getTime();
                const localTime = new Date().getTime();
                offset = serverTime - localTime;
                updateTime();
            })
           .catch(error => {
                console.error('获取时间失败:', error);
                updateTime();
            });
    }

    function updateTime() {
        const now = new Date(new Date().getTime() + offset);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const timeDisplays = [
            document.getElementById('index-time-display'),
            document.getElementById('jiaoyufuwulei-time-display'),
            document.getElementById('shipinlei-time-display'),
            document.getElementById('mianfeishipinjiexilei-time-display'),
            document.getElementById('yidongshebeiyunfuwulei-time-display'),
            document.getElementById('shiyonggongjulei-time-display'),
            document.getElementById('xiangguanlianjielei-time-display')
        ];

        timeDisplays.forEach(display => {
            if (display) {
                display.textContent = timeString;
            }
        });
    }

    fetchTime();
    setInterval(updateTime, 1000);

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



