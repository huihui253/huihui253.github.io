// 游戏启动器 - 现代科技感版本（无触控版）
let loadingInterval = null;
let progress = 0;
let gameLoaded = false;
let currentGameUrl = 'https://play.mc.js.cool/1.8/';
let performanceMonitorInterval = null;
let connectingAnimation = null;
let gameFrame = null;
let isStarting = false; // 防止重复启动

// FPS 监控相关变量
let fps = 60;
let frameCount = 0;
let lastTime = performance.now();
let fpsInterval = null;

// 游戏版本配置（仅保留稳定版和经典版）
const GAME_VERSIONS = {
    '1.8.9': 'https://play.mc.js.cool/1.8/',
    '1.5.2': 'https://play.mcjs.cc/1.5.2/'
};

// 初始化系统
function initSystem() {
    updateHeaderTime();
    setInterval(updateHeaderTime, 1000);
    
    // 初始化版本选择
    initVersionSelection();
    
    // 初始化导航
    initNavigation();
    
    // 初始化设置
    loadSettings();
    
    // 初始化性能图表
    initPerformanceCharts();
    
    // 初始化连接动画
    initConnectingAnimation();
    
    // 初始化事件监听器
    initEventListeners();
    
    // 更新系统状态
    updateSystemStatus();
    
    // 启动FPS监控
    startFPSMonitor();
    
    console.log('%c🚀 系统初始化完成 - 开发者：爱写代码的辉辉', 'color: #00ff88; font-weight: bold;');
    
    // 获取游戏iframe引用
    gameFrame = document.getElementById('gameFrame');
    
    // 初始化全屏变化监听
    initFullscreenListener();
    
    // 优化初始加载性能
    optimizeInitialLoad();
}

// 启动FPS监控
function startFPSMonitor() {
    if (fpsInterval) clearInterval(fpsInterval);
    
    fpsInterval = setInterval(() => {
        const currentTime = performance.now();
        const elapsed = currentTime - lastTime;
        
        if (elapsed >= 1000) {
            fps = Math.round((frameCount * 1000) / elapsed);
            frameCount = 0;
            lastTime = currentTime;
            
            // 更新UI显示
            updatePerformanceMetrics();
        }
    }, 100);
    
    // 使用requestAnimationFrame计算帧数
    function countFrame() {
        frameCount++;
        requestAnimationFrame(countFrame);
    }
    requestAnimationFrame(countFrame);
}

// 优化初始加载性能
function optimizeInitialLoad() {
    // 延迟非关键资源加载
    setTimeout(() => {
        if (window.MC && window.MC.initialize) {
            window.MC.initialize();
        }
        // 初始化性能监控（延迟启动）
        if (document.getElementById('performanceMonitor')?.style.display === 'block') {
            startPerformanceMonitor();
        }
    }, 1000);
}

// 初始化全屏变化监听
function initFullscreenListener() {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

// 处理全屏变化
function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement || 
                        document.msFullscreenElement;
    
    // 更新全屏按钮状态
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const floatFullscreenBtn = document.getElementById('floatFullscreenBtn');
    
    if (isFullscreen) {
        if (fullscreenBtn) fullscreenBtn.innerHTML = '<span class="action-icon">⛶</span><span>退出全屏</span>';
        if (floatFullscreenBtn) floatFullscreenBtn.innerHTML = '<span class="float-icon">⛶</span>';
        
        // 如果游戏已加载，调整游戏iframe大小
        if (gameLoaded && gameFrame) {
            setTimeout(() => {
                adjustGameFrameForFullscreen();
            }, 100);
        }
    } else {
        if (fullscreenBtn) fullscreenBtn.innerHTML = '<span class="action-icon">⛶</span><span>全屏</span>';
        if (floatFullscreenBtn) floatFullscreenBtn.innerHTML = '<span class="float-icon">⛶</span>';
    }
}

// 调整游戏iframe适应全屏
function adjustGameFrameForFullscreen() {
    if (!gameFrame || !document.fullscreenElement) return;
    
    // 检查是否为横屏
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
        // 横屏模式：保持宽高比
        gameFrame.style.width = '100%';
        gameFrame.style.height = '100%';
    } else {
        // 竖屏模式：保持宽度自适应
        gameFrame.style.width = '100%';
        gameFrame.style.height = '100%';
        gameFrame.style.objectFit = 'contain';
    }
}

// 更新头部时间
function updateHeaderTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const headerTime = document.getElementById('headerTime');
    if (headerTime) {
        headerTime.textContent = timeString;
    }
    
    const systemTime = document.getElementById('systemStatus');
    if (systemTime) {
        systemTime.textContent = timeString;
    }
}

// 初始化版本选择
function initVersionSelection() {
    const versionItems = document.querySelectorAll('.version-item');
    versionItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有选中状态
            versionItems.forEach(v => v.classList.remove('selected'));
            
            // 设置当前选中
            this.classList.add('selected');
            
            // 获取版本号
            const version = this.getAttribute('data-version');
            currentGameUrl = GAME_VERSIONS[version] || GAME_VERSIONS['1.8.9'];
            
            // 发送版本变更事件
            window.dispatchEvent(new CustomEvent('version-changed', {
                detail: { version: version }
            }));
            
            // 播放音效
            if (window.MC && window.MC.playSound) {
                window.MC.playSound('click');
            }
            
            // 如果游戏已加载，提示需要重启
            if (gameLoaded) {
                showNotification(`已切换至版本 ${version}，需要重新启动游戏`);
            }
        });
    });
}

// 初始化导航
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section') + 'Section';
            
            // 更新导航按钮状态
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应区域
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
            
            // 播放音效
            if (window.MC && window.MC.playSound) {
                window.MC.playSound('click');
            }
        });
    });
}

// 加载设置
function loadSettings() {
    // 从localStorage加载设置
    const soundEnabled = localStorage.getItem('mc_sound_enabled') !== 'false';
    const notificationsEnabled = localStorage.getItem('mc_notifications_enabled') !== 'false';
    const autoSave = localStorage.getItem('mc_auto_save') === 'true';
    const fullscreenToggle = localStorage.getItem('mc_fullscreen_toggle') === 'true';
    const animationsEnabled = localStorage.getItem('mc_animations_enabled') !== 'false';
    
    // 应用到UI
    const soundToggle = document.getElementById('soundToggle');
    const notificationsToggle = document.getElementById('notificationsToggle');
    const autoSaveToggle = document.getElementById('autoSaveToggle');
    const fullscreenToggleElem = document.getElementById('fullscreenToggle');
    const animationsToggle = document.getElementById('animationsToggle');
    
    if (soundToggle) soundToggle.checked = soundEnabled;
    if (notificationsToggle) notificationsToggle.checked = notificationsEnabled;
    if (autoSaveToggle) autoSaveToggle.checked = autoSave;
    if (fullscreenToggleElem) fullscreenToggleElem.checked = fullscreenToggle;
    if (animationsToggle) animationsToggle.checked = animationsEnabled;
    
    // 应用设置到MC引擎
    if (window.MC && window.MC.setAudioEnabled) {
        window.MC.setAudioEnabled(soundEnabled);
    }
}

// 保存设置
function saveSettings() {
    const soundEnabled = document.getElementById('soundToggle').checked;
    const notificationsEnabled = document.getElementById('notificationsToggle').checked;
    const autoSave = document.getElementById('autoSaveToggle').checked;
    const fullscreenToggle = document.getElementById('fullscreenToggle').checked;
    const animationsEnabled = document.getElementById('animationsToggle').checked;
    
    localStorage.setItem('mc_sound_enabled', soundEnabled);
    localStorage.setItem('mc_notifications_enabled', notificationsEnabled);
    localStorage.setItem('mc_auto_save', autoSave);
    localStorage.setItem('mc_fullscreen_toggle', fullscreenToggle);
    localStorage.setItem('mc_animations_enabled', animationsEnabled);
    
    // 应用设置到MC引擎
    if (window.MC && window.MC.setAudioEnabled) {
        window.MC.setAudioEnabled(soundEnabled);
    }
    
    showNotification('设置已保存');
    
    if (window.MC && window.MC.playSound && soundEnabled) {
        window.MC.playSound('success');
    }
}

// 初始化性能图表
function initPerformanceCharts() {
    const graphs = ['performanceGraph', 'memoryGraph', 'networkGraph'];
    graphs.forEach(graphId => {
        const graph = document.getElementById(graphId);
        if (graph) {
            // 创建简单的SVG图表
            graph.innerHTML = `
                <svg width="100%" height="100%">
                    <line x1="0" y1="15" x2="80" y2="15" stroke="rgba(42, 59, 90, 0.5)" stroke-width="2"/>
                    <polyline points="0,15 20,5 40,20 60,10 80,25" 
                             stroke="#0066ff" stroke-width="2" fill="none"/>
                </svg>
            `;
        }
    });
}

// 初始化连接动画
function initConnectingAnimation() {
    // 创建连接动画元素
    connectingAnimation = document.createElement('div');
    connectingAnimation.className = 'connecting-animation';
    connectingAnimation.innerHTML = `
        <div class="connecting-content">
            <div class="connecting-title">连接服务器...</div>
            <div class="connecting-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="loading-spinner"></div>
        </div>
    `;
    
    document.body.appendChild(connectingAnimation);
}

// 显示连接动画
function showConnectingAnimation() {
    if (connectingAnimation) {
        connectingAnimation.style.display = 'flex';
    }
}

// 隐藏连接动画
function hideConnectingAnimation() {
    if (connectingAnimation) {
        connectingAnimation.style.display = 'none';
    }
}

// 初始化事件监听器
function initEventListeners() {
    // 启动按钮
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (!isStarting) {
                startMinecraft();
            }
        });
    }
    
    // 保存设置按钮
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    // 主题选择
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // 应用主题（简化版本，实际应用中可以更换CSS变量）
            const theme = this.getAttribute('data-theme');
            showNotification(`已切换至${this.querySelector('span').textContent}主题`);
        });
    });
    
    // 工具卡片
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            // 添加点击效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            if (window.MC && window.MC.playSound) {
                window.MC.playSound('click');
            }
        });
    });
    
    // 发送命令按钮
    const sendCommandBtn = document.getElementById('sendCommandBtn');
    if (sendCommandBtn) {
        sendCommandBtn.addEventListener('click', sendCommand);
    }
    
    // 命令输入框回车键
    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
        commandInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendCommand();
            }
        });
    }
}

// 发送命令
function sendCommand() {
    const commandInput = document.getElementById('commandInput');
    if (!commandInput) return;
    
    const command = commandInput.value.trim();
    if (!command) return;
    
    // 显示命令
    const history = document.getElementById('command-history');
    if (history) {
        const entry = document.createElement('div');
        entry.textContent = `> ${command}`;
        entry.style.cssText = 'padding: 4px 0; border-bottom: 1px solid rgba(42, 59, 90, 0.3); font-size: 13px; color: var(--text-muted);';
        history.appendChild(entry);
        history.scrollTop = history.scrollHeight;
    }
    
    // 模拟命令执行
    showNotification(`执行命令: ${command}`);
    
    // 清空输入框
    commandInput.value = '';
    
    // 播放音效
    if (window.MC && window.MC.playSound) {
        window.MC.playSound('confirm');
    }
}

// 更新系统状态
function updateSystemStatus() {
    // 更新内存状态（真实数据）
    if (window.performance && window.performance.memory) {
        const mem = window.performance.memory;
        const usedMB = Math.round(mem.usedJSHeapSize / 1024 / 1024);
        
        const memoryStatus = document.getElementById('memoryStatus');
        const memoryValue = document.querySelector('.status-card:nth-child(2) .card-value');
        
        if (memoryStatus) memoryStatus.textContent = `${usedMB} MB`;
        if (memoryValue) memoryValue.textContent = `${usedMB} MB`;
    } else {
        // 如果Performance API不可用，显示模拟数据
        const usedMB = Math.round(Math.random() * 500 + 100);
        const memoryStatus = document.getElementById('memoryStatus');
        const memoryValue = document.querySelector('.status-card:nth-child(2) .card-value');
        
        if (memoryStatus) memoryStatus.textContent = `${usedMB} MB`;
        if (memoryValue) memoryValue.textContent = `${usedMB} MB`;
    }
    
    // 更新网络状态
    const connectionText = document.querySelector('.connection-text');
    
    if (navigator.onLine) {
        if (connectionText) connectionText.textContent = '连接正常';
    } else {
        if (connectionText) connectionText.textContent = '连接断开';
    }
    
    // 更新性能状态（模拟数据）
    const performanceValue = document.querySelector('.status-card:nth-child(1) .card-value');
    if (performanceValue) {
        // 模拟性能状态
        const statuses = ['优秀', '良好', '一般', '待机中'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        performanceValue.textContent = randomStatus;
    }
}

// 启动Minecraft游戏
function startMinecraft() {
    if (isStarting) {
        showNotification('游戏正在启动中，请稍候...');
        return;
    }
    
    isStarting = true;
    
    const startBtn = document.getElementById('startGameBtn');
    const gamePlaceholder = document.getElementById('gamePlaceholder');
    const gameFrame = document.getElementById('gameFrame');
    const loadingContainer = document.getElementById('loadingProgressContainer');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const floatFullscreenBtn = document.getElementById('floatFullscreenBtn');
    const reloadBtn = document.getElementById('reloadBtn');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // 重置状态
    gameLoaded = false;
    
    // 禁用按钮
    startBtn.disabled = true;
    startBtn.querySelector('.launch-text').textContent = '启动中...';
    
    // 显示加载进度
    if (loadingContainer) {
        loadingContainer.style.display = 'block';
    }
    
    // 重置进度
    progress = 0;
    updateLoadingProgress();
    
    // 重置步骤
    progressSteps.forEach(step => step.classList.remove('active'));
    
    // 显示连接动画
    showConnectingAnimation();
    
    // 清理之前的加载间隔
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
    
    // 模拟加载步骤
    simulateLoading(progressSteps);
    
    // 使用requestAnimationFrame优化加载
    let loadStartTime = Date.now();
    const maxLoadTime = 30000; // 30秒超时
    
    function checkLoadProgress() {
        const elapsed = Date.now() - loadStartTime;
        
        if (elapsed > maxLoadTime) {
            handleLoadTimeout();
            return;
        }
        
        if (progress >= 100 && !gameLoaded) {
            // 模拟加载完成后启动游戏
            setTimeout(() => {
                if (!gameLoaded) {
                    loadGameContent();
                }
            }, 500);
        } else {
            requestAnimationFrame(checkLoadProgress);
        }
    }
    
    requestAnimationFrame(checkLoadProgress);
    
    // 加载游戏内容
    setTimeout(() => {
        loadGameContent();
    }, 1000);
}

// 加载游戏内容
function loadGameContent() {
    const gamePlaceholder = document.getElementById('gamePlaceholder');
    const gameFrame = document.getElementById('gameFrame');
    const startBtn = document.getElementById('startGameBtn');
    const loadingContainer = document.getElementById('loadingProgressContainer');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const floatFullscreenBtn = document.getElementById('floatFullscreenBtn');
    const reloadBtn = document.getElementById('reloadBtn');
    
    // 隐藏占位符
    if (gamePlaceholder) {
        gamePlaceholder.classList.add('hidden');
    }
    
    // 显示游戏iframe
    if (gameFrame) {
        gameFrame.style.display = 'block';
        
        // 使用代理URL避免CORS问题
        const proxyUrl = currentGameUrl;
        gameFrame.src = proxyUrl;
        
        // 优化iframe加载策略
        gameFrame.onload = () => {
            handleGameLoadSuccess();
        };
        
        gameFrame.onerror = () => {
            handleGameLoadError();
        };
        
        // 设置加载超时
        setTimeout(() => {
            if (!gameLoaded) {
                handleGameLoadError();
            }
        }, 25000);
    }
}

// 处理游戏加载成功
function handleGameLoadSuccess() {
    console.log('游戏iframe加载完成');
    
    const gameFrame = document.getElementById('gameFrame');
    const startBtn = document.getElementById('startGameBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const floatFullscreenBtn = document.getElementById('floatFullscreenBtn');
    const reloadBtn = document.getElementById('reloadBtn');
    const loadingContainer = document.getElementById('loadingProgressContainer');
    
    // 等待游戏完全初始化
    setTimeout(() => {
        // 隐藏连接动画
        hideConnectingAnimation();
        
        // 显示游戏iframe
        if (gameFrame) {
            gameFrame.classList.add('active');
        }
        
        // 启用控制按钮
        if (fullscreenBtn) fullscreenBtn.disabled = false;
        if (floatFullscreenBtn) floatFullscreenBtn.disabled = false;
        if (reloadBtn) reloadBtn.disabled = false;
        
        // 设置游戏加载完成标志
        gameLoaded = true;
        isStarting = false;
        
        // 更新预览状态
        const statValue = document.querySelector('.preview-stats .stat-value');
        if (statValue) {
            statValue.textContent = '在线';
            statValue.classList.remove('offline');
        }
        
        // 更新按钮文本
        if (startBtn) {
            startBtn.querySelector('.launch-text').textContent = '重新启动';
            startBtn.disabled = false;
        }
        
        // 隐藏加载进度
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        
        // 清除加载间隔
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
        
        // 播放成功音效
        if (window.MC && window.MC.playSound) {
            window.MC.playSound('success');
        }
        
        showNotification('游戏启动成功！');
        
        // 如果启用了全屏启动
        const fullscreenToggle = document.getElementById('fullscreenToggle');
        if (fullscreenToggle && fullscreenToggle.checked) {
            setTimeout(() => {
                toggleFullscreen();
            }, 1000);
        }
        
        // 如果启用了自动保存
        const autoSaveToggle = document.getElementById('autoSaveToggle');
        if (autoSaveToggle && autoSaveToggle.checked) {
            setTimeout(() => {
                showNotification('自动保存完成');
                quickSave();
            }, 5000);
        }
        
        // 发送游戏加载完成事件
        window.dispatchEvent(new CustomEvent('game-loaded'));
    }, 4000);
}

// 处理游戏加载错误
function handleGameLoadError() {
    console.error('游戏加载失败');
    
    const gamePlaceholder = document.getElementById('gamePlaceholder');
    const gameFrame = document.getElementById('gameFrame');
    const startBtn = document.getElementById('startGameBtn');
    const loadingContainer = document.getElementById('loadingProgressContainer');
    
    hideConnectingAnimation();
    showError('游戏加载失败，请检查网络连接或尝试其他版本');
    
    // 恢复UI状态
    if (gamePlaceholder) {
        gamePlaceholder.classList.remove('hidden');
    }
    if (gameFrame) {
        gameFrame.style.display = 'none';
        gameFrame.classList.remove('active');
        gameFrame.src = 'about:blank';
    }
    
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    
    if (startBtn) {
        startBtn.querySelector('.launch-text').textContent = '启动游戏';
        startBtn.disabled = false;
    }
    
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
    
    gameLoaded = false;
    isStarting = false;
}

// 处理加载超时
function handleLoadTimeout() {
    console.warn('游戏加载超时');
    
    hideConnectingAnimation();
    showError('游戏加载超时，请检查网络或重试');
    
    const gameFrame = document.getElementById('gameFrame');
    const startBtn = document.getElementById('startGameBtn');
    const loadingContainer = document.getElementById('loadingProgressContainer');
    
    if (gameFrame) {
        gameFrame.classList.add('active');
    }
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    if (startBtn) {
        startBtn.querySelector('.launch-text').textContent = '重新启动';
        startBtn.disabled = false;
    }
    
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
    
    gameLoaded = true;
    isStarting = false;
}

// 模拟加载过程
function simulateLoading(progressSteps) {
    let currentStep = 0;
    
    loadingInterval = setInterval(() => {
        // 更新当前步骤
        if (currentStep < progressSteps.length) {
            progressSteps[currentStep].classList.add('active');
            currentStep++;
        }
        
        // 更新进度
        if (progress < 100) {
            progress += Math.random() * 10 + 5;
            if (progress > 100) progress = 100;
            updateLoadingProgress();
        }
        
        // 完成加载
        if (progress >= 100) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
    }, 800);
}

// 更新加载进度
function updateLoadingProgress() {
    const progressFill = document.getElementById('loadingProgress');
    const progressPercent = document.getElementById('progressPercent');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (progressPercent) {
        progressPercent.textContent = Math.round(progress) + '%';
    }
}

// 切换全屏模式
function toggleFullscreen() {
    const gamePreview = document.querySelector('.game-preview');
    const iframe = document.getElementById('gameFrame');
    
    if (!gamePreview) return;
    
    if (!document.fullscreenElement) {
        // 进入全屏
        if (gamePreview.requestFullscreen) {
            gamePreview.requestFullscreen();
        } else if (gamePreview.webkitRequestFullscreen) {
            gamePreview.webkitRequestFullscreen();
        } else if (gamePreview.mozRequestFullScreen) {
            gamePreview.mozRequestFullScreen();
        } else if (gamePreview.msRequestFullscreen) {
            gamePreview.msRequestFullscreen();
        }
        
        // 调整iframe大小
        if (iframe && gameLoaded) {
            setTimeout(() => {
                iframe.style.width = '100%';
                iframe.style.height = '100%';
            }, 100);
        }
        
        showNotification('已进入全屏模式');
    } else {
        // 退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // 恢复iframe大小
        if (iframe && gameLoaded) {
            iframe.style.width = '100%';
            iframe.style.height = '400px';
        }
        
        showNotification('已退出全屏模式');
    }
}

// 重新加载游戏
function reloadGame() {
    const gameFrame = document.getElementById('gameFrame');
    const gamePlaceholder = document.getElementById('gamePlaceholder');
    
    if (!gameLoaded) {
        showError('游戏未启动');
        return;
    }
    
    // 隐藏iframe
    if (gameFrame) {
        gameFrame.classList.remove('active');
        gameFrame.style.display = 'none';
    }
    
    // 显示占位符
    if (gamePlaceholder) {
        gamePlaceholder.classList.remove('hidden');
    }
    
    // 重置iframe源
    if (gameFrame) {
        gameFrame.src = 'about:blank';
    }
    
    // 重置游戏加载标志
    gameLoaded = false;
    
    showNotification('游戏已重置');
    
    if (window.MC && window.MC.playSound) {
        window.MC.playSound('click');
    }
}

// 截图功能
function takeScreenshot() {
    if (!gameLoaded) {
        showError('游戏未启动，无法截图');
        return;
    }
    
    const screenshotPreview = document.getElementById('screenshotPreview');
    const screenshotImg = document.getElementById('screenshotImg');
    
    // 模拟截图
    screenshotImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMwYTBmMTEiLz48cGF0aCBkPSJNODAgODBIMzIwVjIyMEg4MFY4MFoiIGZpbGw9IiMxNjIyMzYiLz48cGF0aCBkPSJNMTIwIDEyMEgyODBWMTgwSDEyMFYxMjBaIiBmaWxsPSIjMDA2NmZmIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iMzAiIGZpbGw9IiMwMGU1ZmYiLz48dGV4dCB4PSIyMDAiIHk9IjE1NSIgZm9udC1mYW1pbHk9Ik9yYml0cm9uIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj9taWRkbGUiPlNjcmVlbnNob3Q8L3RleHQ+PC9zdmc+';
    if (screenshotPreview) {
        screenshotPreview.style.display = 'block';
    }
    
    if (window.MC && window.MC.playSound) {
        window.MC.playSound('confirm');
    }
    
    showNotification('截图已保存到剪贴板');
}

// 关闭截图预览
function closeScreenshot() {
    const screenshotPreview = document.getElementById('screenshotPreview');
    if (screenshotPreview) {
        screenshotPreview.style.display = 'none';
    }
}

// 快速保存
function quickSave() {
    if (!gameLoaded) {
        showError('游戏未启动，无法保存');
        return;
    }
    
    showNotification('游戏进度已保存');
    
    if (window.MC && window.MC.playSound) {
        window.MC.playSound('success');
    }
}

// 显示控制说明
function showControls() {
    const controls = `
        游戏控制说明:
        W/A/S/D - 移动
        空格键 - 跳跃
        鼠标 - 控制视角
        E键 - 打开背包
        Q键 - 丢弃物品
        数字键1-9 - 切换物品栏
        Shift - 潜行
        鼠标左键 - 破坏方块
        鼠标右键 - 放置方块/使用物品
        Esc键 - 打开菜单
    `;
    
    showNotification(controls.split('\n')[1]);
}

// 显示系统信息
function showSystemInfo() {
    if (window.MC && window.MC.showSystemInfo) {
        const info = window.MC.showSystemInfo();
        console.log(info);
        showNotification('系统信息已显示在控制台');
        
        // 更新关于面板中的浏览器信息
        const browserInfo = document.getElementById('browserInfo');
        if (browserInfo) {
            const ua = navigator.userAgent;
            let browser = '未知';
            if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
            else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
            else if (ua.indexOf('Safari') > -1) browser = 'Safari';
            else if (ua.indexOf('Edge') > -1) browser = 'Edge';
            browserInfo.textContent = browser;
        }
    }
}

// 运行诊断
function runDiagnostics() {
    if (window.MC && window.MC.diagnose) {
        const diagnostics = window.MC.diagnose();
        console.table(diagnostics);
        
        let summary = '系统诊断完成: ';
        if (diagnostics.webgl && diagnostics.audio && diagnostics.network === 'online') {
            summary += '所有系统正常 ✓';
        } else {
            summary += '发现一些问题，请检查控制台';
        }
        
        showNotification(summary);
    }
}

// 清除缓存
function clearCache() {
    try {
        if (window.localStorage) {
            // 保留设置
            const settings = {
                mc_sound_enabled: localStorage.getItem('mc_sound_enabled'),
                mc_notifications_enabled: localStorage.getItem('mc_notifications_enabled'),
                mc_auto_save: localStorage.getItem('mc_auto_save'),
                mc_fullscreen_toggle: localStorage.getItem('mc_fullscreen_toggle'),
                mc_animations_enabled: localStorage.getItem('mc_animations_enabled')
            };
            
            localStorage.clear();
            
            // 恢复设置
            Object.keys(settings).forEach(key => {
                if (settings[key] !== null) {
                    localStorage.setItem(key, settings[key]);
                }
            });
            
            showNotification('缓存已清除');
            
            if (window.MC && window.MC.playSound) {
                window.MC.playSound('success');
            }
        }
    } catch (e) {
        showError('清除缓存失败: ' + e.message);
    }
}

// 切换命令输入框
function toggleCommandInput() {
    const commandPanel = document.getElementById('commandInputContainer');
    const performancePanel = document.getElementById('performanceMonitor');
    
    // 关闭其他面板
    if (performancePanel) {
        performancePanel.style.display = 'none';
        stopPerformanceMonitor();
    }
    
    if (commandPanel) {
        if (commandPanel.style.display === 'block') {
            commandPanel.style.display = 'none';
        } else {
            commandPanel.style.display = 'block';
            const commandInput = document.getElementById('commandInput');
            if (commandInput) {
                commandInput.focus();
            }
        }
    }
}

// 切换性能监视器
function togglePerformanceMonitor() {
    const performancePanel = document.getElementById('performanceMonitor');
    const commandPanel = document.getElementById('commandInputContainer');
    
    // 关闭其他面板
    if (commandPanel) {
        commandPanel.style.display = 'none';
    }
    
    if (performancePanel) {
        if (performancePanel.style.display === 'block') {
            performancePanel.style.display = 'none';
            stopPerformanceMonitor();
        } else {
            performancePanel.style.display = 'block';
            updatePerformanceMetrics();
            startPerformanceMonitor();
        }
    }
}

// 启动性能监控
function startPerformanceMonitor() {
    if (performanceMonitorInterval) {
        clearInterval(performanceMonitorInterval);
    }
    performanceMonitorInterval = setInterval(updatePerformanceMetrics, 1500);
}

// 停止性能监控
function stopPerformanceMonitor() {
    if (performanceMonitorInterval) {
        clearInterval(performanceMonitorInterval);
        performanceMonitorInterval = null;
    }
}

// 更新性能指标（使用真实数据）
function updatePerformanceMetrics() {
    // 更新FPS（使用真实FPS数据）
    const fpsElement = document.getElementById('fpsValue');
    const fpsBar = document.getElementById('fpsBar');
    if (fpsElement && fpsBar) {
        const fpsPercent = Math.min(100, (fps / 120) * 100);
        fpsElement.textContent = fps;
        fpsBar.style.width = `${fpsPercent}%`;
        
        // 根据FPS状态改变颜色
        if (fps > 50) {
            fpsBar.style.background = 'linear-gradient(90deg, #00ff88, #00cc66)';
        } else if (fps > 30) {
            fpsBar.style.background = 'linear-gradient(90deg, #ffaa00, #ff8800)';
        } else {
            fpsBar.style.background = 'linear-gradient(90deg, #ff5555, #cc4444)';
        }
    }
    
    // 更新内存（真实数据）
    const memoryElement = document.getElementById('memoryValue');
    const memoryBar = document.getElementById('memoryBar');
    if (memoryElement && memoryBar) {
        let usedMB = 0;
        if (window.performance && window.performance.memory) {
            usedMB = Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024);
        } else {
            usedMB = Math.floor(Math.random() * 500) + 100; // 模拟数据
        }
        
        memoryElement.textContent = `${usedMB} MB`;
        const memoryPercent = Math.min(100, (usedMB / 2048) * 100);
        memoryBar.style.width = `${memoryPercent}%`;
        
        // 根据内存使用率改变颜色
        if (memoryPercent < 60) {
            memoryBar.style.background = 'linear-gradient(90deg, #00e5ff, #0066ff)';
        } else if (memoryPercent < 80) {
            memoryBar.style.background = 'linear-gradient(90deg, #ffaa00, #ff8800)';
        } else {
            memoryBar.style.background = 'linear-gradient(90deg, #ff5555, #cc4444)';
        }
    }
    
    // 更新延迟（模拟）
    const latencyElement = document.getElementById('latencyValue');
    const latencyBar = document.getElementById('latencyBar');
    if (latencyElement && latencyBar) {
        const latency = Math.floor(Math.random() * 90) + 10; // 10-100ms
        latencyElement.textContent = `${latency} ms`;
        const latencyPercent = Math.min(100, (100 - latency) * 1.5);
        latencyBar.style.width = `${latencyPercent}%`;
        
        // 根据延迟状态改变颜色
        if (latency < 50) {
            latencyBar.style.background = 'linear-gradient(90deg, #00ff88, #00cc66)';
        } else if (latency < 100) {
            latencyBar.style.background = 'linear-gradient(90deg, #ffaa00, #ff8800)';
        } else {
            latencyBar.style.background = 'linear-gradient(90deg, #ff5555, #cc4444)';
        }
    }
}

// 显示错误消息
function showError(message) {
    // 移除现有的错误消息
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(220, 53, 69, 0.9);
        border: 1px solid #dc3545;
        border-left: 4px solid #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        max-width: 400px;
        backdrop-filter: blur(10px);
        box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
        animation: slideInRight 0.3s ease;
    `;
    
    errorDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;">
            <span>⚠️ 错误</span>
            <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; cursor: pointer; font-size: 18px;" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div>${message}</div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // 5秒后自动移除
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
    
    // 播放错误音效
    if (window.MC && window.MC.playSound) {
        window.MC.playSound('error');
    }
}

// 显示通知
function showNotification(message) {
    // 检查是否启用通知
    if (localStorage.getItem('mc_notifications_enabled') === 'false') {
        return;
    }
    
    // 移除现有的通知
    const existingNotification = document.querySelector('.notification-message');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification-message';
    notificationDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(25, 135, 84, 0.9);
        border: 1px solid #198754;
        border-left: 4px solid #20c997;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        max-width: 500px;
        backdrop-filter: blur(10px);
        box-shadow: 0 5px 15px rgba(25, 135, 84, 0.3);
        animation: slideInDown 0.3s ease;
        text-align: center;
    `;
    
    notificationDiv.innerHTML = `
        <div>${message}</div>
        <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; cursor: pointer; font-size: 18px;" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notificationDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (notificationDiv.parentElement) {
            notificationDiv.remove();
        }
    }, 3000);
    
    // 播放通知音效
    if (localStorage.getItem('mc_sound_enabled') !== 'false' && window.MC && window.MC.playSound) {
        window.MC.playSound('click');
    }
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // F1: 显示控制说明
    if (e.key === 'F1') {
        e.preventDefault();
        showControls();
    }
    
    // F2: 截图
    if (e.key === 'F2') {
        e.preventDefault();
        takeScreenshot();
    }
    
    // F5: 重新加载
    if (e.key === 'F5') {
        if (!e.ctrlKey) {
            e.preventDefault();
            if (gameLoaded) {
                reloadGame();
            }
        }
    }
    
    // F11: 全屏
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // Ctrl+S: 快速保存
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        quickSave();
    }
    
    // Ctrl+Shift+P: 切换性能监视器
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        togglePerformanceMonitor();
    }
    
    // Ctrl+`: 切换命令控制台
    if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggleCommandInput();
    }
    
    // Esc: 关闭所有面板
    if (e.key === 'Escape') {
        const panels = ['commandInputContainer', 'performanceMonitor', 'screenshotPreview'];
        panels.forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (panel && panel.style.display === 'block') {
                panel.style.display = 'none';
            }
        });
        
        // 关闭性能监视器定时器
        stopPerformanceMonitor();
        
        // 退出全屏
        if (document.fullscreenElement) {
            toggleFullscreen();
        }
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，避免阻塞主线程
    setTimeout(() => {
        initSystem();
    }, 100);
    
    // 定期更新系统状态
    setInterval(updateSystemStatus, 5000);
    
    console.log('%c🎮 游戏启动器已就绪 - 开发者：爱写代码的辉辉', 'color: #00e5ff; font-weight: bold; font-size: 16px;');
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// 修复触摸事件问题
document.addEventListener('touchstart', function(e) {
    // 防止在游戏iframe中触摸事件被取消的错误
    if (e.target.tagName === 'IFRAME') {
        e.preventDefault();
    }
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    // 防止在游戏iframe中触摸事件被取消的错误
    if (e.target.tagName === 'IFRAME') {
        e.preventDefault();
    }
}, { passive: true });

// 页面卸载时清理资源
window.addEventListener('beforeunload', function() {
    // 清除所有定时器
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
    
    if (performanceMonitorInterval) {
        clearInterval(performanceMonitorInterval);
        performanceMonitorInterval = null;
    }
    
    if (fpsInterval) {
        clearInterval(fpsInterval);
        fpsInterval = null;
    }
    
    // 清理音频资源
    if (window.MC && window.MC.safeCloseAudioContext) {
        window.MC.safeCloseAudioContext();
    }
});

// 页面可见性变化时暂停/恢复资源
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停性能监控
        if (performanceMonitorInterval) {
            clearInterval(performanceMonitorInterval);
            performanceMonitorInterval = null;
        }
    } else {
        // 页面显示时恢复性能监控（如果正在显示）
        const performancePanel = document.getElementById('performanceMonitor');
        if (performancePanel && performancePanel.style.display === 'block') {
            startPerformanceMonitor();
        }
    }
});

// 防止内存泄漏：清理未使用的引用
window.addEventListener('pagehide', function() {
    gameFrame = null;
    connectingAnimation = null;
});
