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
            // 控制台输出版本信息（开发用）
            console.log(`%c当前版本: v${appVersion.number}`, 'color: #4CAF50; font-weight: bold;');
            console.log(`发布日期: ${appVersion.releaseDate}`);
            console.log(`开发者: ${appVersion.author}`);
            // 免责声明功能
            document.addEventListener('DOMContentLoaded', function() {
            // 显示免责声明弹窗
            document.getElementById('disclaimerModal').style.display = 'flex';
            
            // 同意按钮点击事件
            document.getElementById('agreeBtn').addEventListener('click', function() {
                document.getElementById('disclaimerModal').style.display = 'none';
            });
            
            // 不同意按钮点击事件
            document.getElementById('disagreeBtn').addEventListener('click', function() {
                // 禁用整个页面的交互
                document.querySelectorAll('a, button').forEach(element => {
                    element.style.pointerEvents = 'none';
                    element.style.opacity = '0.5';
                });
                // 隐藏弹窗
                document.getElementById('disclaimerModal').style.display = 'none';
                // 显示退出消息
                const exitMessage = document.getElementById('exitMessage');
                exitMessage.style.display = 'block';
                
                // 5秒后关闭页面
                setTimeout(function() {
                    try {
                        // 尝试关闭窗口
                        if (window.history.length > 1) {
                            window.history.back();
                        } else {
                            window.close();
                        }
                        
                        // 如果关闭失败，完全替换页面内容
                        setTimeout(function() {
                            document.body.innerHTML = `
                               <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        height: 100vh;
                                        margin: 0;
                                        background-color: #f5f5f5;
                                        text-align: center;
                                    }
                                    .close-message {
                                        background: white;
                                        padding: 30px;
                                        border-radius: 10px;
                                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                        max-width: 80%;
                                    }
                                    h1 {
                                        color: #000000;
                                        margin-bottom: 20px;
                                    }
                                    button {
                                        background: #3498db;
                                        color: white;
                                        border: none;
                                        padding: 10px 20px;
                                        border-radius: 5px;
                                        cursor: pointer;
                                        margin-top: 20px;
                                    }
                                </style>
                                <div class="close-message">
                                    <h1>无法自动关闭窗口</h1>
                                    <h1>请手动关闭此浏览器标签页</h1>
                                </div>
                            `;
                        }, 1000);
                    } catch (e) {
                        document.body.innerHTML = `
                            <h1 style="text-align:center;margin-top:50px;">
                                请手动关闭本页面
                            </h1>
                        `;
                    }
                }, 5000);
            });

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
        });

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

    
   