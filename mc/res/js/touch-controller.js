// 触摸控制器 - 将触摸事件转换为键盘事件
// 为不支持触控的游戏版本提供移动端支持
// 开发者：爱写代码的辉辉

console.log('%c👆 触摸控制器已加载 - 移动端游戏控制增强', 
    'color: #00e5ff; font-family: "Orbitron", sans-serif; font-size: 14px; font-weight: bold;');

class TouchController {
    constructor() {
        this.enabled = false;
        this.activeKeys = new Set();
        this.touchJoystick = null;
        this.touchButtons = new Map();
        this.touchOverlay = null;
        this.isMobile = this.detectMobile();
        this.gameFrame = null;
        this.controllerVisible = false;
        this.joystickDragging = false;
        this.joystickTimeout = null;
        
        // 按键映射配置
        this.keyMappings = {
            'forward': 'KeyW',    // W键
            'backward': 'KeyS',   // S键
            'left': 'KeyA',       // A键
            'right': 'KeyD',      // D键
            'jump': 'Space',      // 空格键
            'sneak': 'ShiftLeft', // Shift键
            'inventory': 'KeyE'   // E键
        };
        
        // 初始化
        this.init();
    }
    
    // 检测是否为移动设备
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    // 初始化控制器
    init() {
        console.log('%c🔄 初始化触摸控制器...', 'color: #8a9bb8;');
        
        // 创建触摸控制器UI
        this.createTouchOverlay();
        
        // 添加事件监听器
        this.addEventListeners();
        
        // 检查是否需要触控支持（通用触控）
        this.checkIfTouchNeeded();
        
        console.log('%c✅ 触摸控制器初始化完成', 'color: #00ff88;');
    }
    
    // 检查是否需要触控支持（通用触控）
    checkIfTouchNeeded() {
        // 对于所有移动设备，都提供通用触控支持
        if (this.isMobile) {
            // 检查设置是否启用触控
            const touchEnabled = localStorage.getItem('mc_touch_enabled') !== 'false';
            if (touchEnabled) {
                this.enable();
            }
        }
    }
    
    // 创建触摸覆盖层
    createTouchOverlay() {
        // 如果已经存在，先移除
        if (this.touchOverlay) {
            this.touchOverlay.remove();
        }
        
        // 创建主覆盖层
        this.touchOverlay = document.createElement('div');
        this.touchOverlay.id = 'mc-touch-overlay';
        this.touchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            display: none;
        `;
        
        // 创建左侧摇杆区域
        this.touchJoystick = document.createElement('div');
        this.touchJoystick.id = 'mc-touch-joystick';
        this.touchJoystick.style.cssText = `
            position: absolute;
            left: 20px;
            bottom: 20px;
            width: 150px;
            height: 150px;
            background: rgba(0, 102, 255, 0.2);
            border: 2px solid rgba(0, 102, 255, 0.5);
            border-radius: 50%;
            backdrop-filter: blur(10px);
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: none;
        `;
        
        // 摇杆中心点
        const joystickCenter = document.createElement('div');
        joystickCenter.id = 'mc-joystick-center';
        joystickCenter.style.cssText = `
            width: 60px;
            height: 60px;
            background: rgba(0, 229, 255, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
            pointer-events: none;
        `;
        
        this.touchJoystick.appendChild(joystickCenter);
        
        // 创建右侧按钮区域
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'mc-button-container';
        buttonContainer.style.cssText = `
            position: absolute;
            right: 20px;
            bottom: 20px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 1fr);
            gap: 15px;
            width: 200px;
            height: 200px;
            pointer-events: auto;
            touch-action: none;
        `;
        
        // 定义按钮布局和功能
        const buttonLayout = [
            { id: 'jump', label: '跳', row: 1, col: 2, color: '#00ff88' },
            { id: 'forward', label: 'W', row: 1, col: 2, color: '#0066ff' },
            { id: 'left', label: 'A', row: 2, col: 1, color: '#0066ff' },
            { id: 'backward', label: 'S', row: 2, col: 2, color: '#0066ff' },
            { id: 'right', label: 'D', row: 2, col: 3, color: '#0066ff' },
            { id: 'sneak', label: '潜', row: 3, col: 1, color: '#ffaa00' },
            { id: 'inventory', label: '包', row: 3, col: 3, color: '#ffaa00' }
        ];
        
        // 创建按钮
        buttonLayout.forEach(config => {
            const button = this.createButton(config);
            this.touchButtons.set(config.id, button);
            buttonContainer.appendChild(button);
        });
        
        // 添加切换按钮可见性的按钮
        const toggleButton = document.createElement('div');
        toggleButton.id = 'mc-toggle-controller';
        toggleButton.style.cssText = `
            position: absolute;
            right: 20px;
            top: 20px;
            width: 50px;
            height: 50px;
            background: rgba(42, 59, 90, 0.8);
            border: 2px solid rgba(0, 229, 255, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            pointer-events: auto;
            backdrop-filter: blur(10px);
            user-select: none;
            touch-action: manipulation;
        `;
        toggleButton.textContent = '👆';
        toggleButton.title = '显示/隐藏控制按钮';
        
        // 添加到覆盖层
        this.touchOverlay.appendChild(this.touchJoystick);
        this.touchOverlay.appendChild(buttonContainer);
        this.touchOverlay.appendChild(toggleButton);
        
        // 添加到页面
        document.body.appendChild(this.touchOverlay);
        
        // 绑定切换事件
        toggleButton.addEventListener('click', () => this.toggleVisibility());
        toggleButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleVisibility();
        }, { passive: false });
        
        // 绑定摇杆事件
        this.initJoystickEvents();
        
        // 绑定按钮事件
        this.initButtonEvents();
    }
    
    // 创建单个按钮
    createButton(config) {
        const button = document.createElement('div');
        button.id = `mc-btn-${config.id}`;
        button.className = 'mc-touch-button';
        button.dataset.action = config.id;
        
        button.style.cssText = `
            width: 60px;
            height: 60px;
            background: rgba(42, 59, 90, 0.8);
            border: 2px solid ${config.color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: 'Orbitron', sans-serif;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            backdrop-filter: blur(10px);
            transition: all 0.1s ease;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            grid-row: ${config.row};
            grid-column: ${config.col};
            touch-action: manipulation;
        `;
        
        button.textContent = config.label;
        button.title = this.getButtonDescription(config.id);
        
        return button;
    }
    
    // 获取按钮描述
    getButtonDescription(action) {
        const descriptions = {
            'forward': '向前移动 (W键)',
            'backward': '向后移动 (S键)',
            'left': '向左移动 (A键)',
            'right': '向右移动 (D键)',
            'jump': '跳跃 (空格键)',
            'sneak': '潜行 (Shift键)',
            'inventory': '打开背包 (E键)'
        };
        return descriptions[action] || '游戏控制按钮';
    }
    
    // 初始化摇杆事件（修复触摸事件问题）
    initJoystickEvents() {
        const joystick = this.touchJoystick;
        const center = document.getElementById('mc-joystick-center');
        let startX = 0, startY = 0;
        let centerX = 0, centerY = 0;
        let radius = 0;
        
        // 使用requestAnimationFrame优化性能
        let rafId = null;
        
        const updateJoystickPosition = (x, y) => {
            if (center) {
                center.style.transform = `translate(${x}px, ${y}px)`;
            }
        };
        
        const handleJoystickInput = (x, y) => {
            if (!this.joystickDragging) return;
            
            const threshold = radius * 0.3;
            
            // 释放之前的方向键
            this.releaseJoystickKeys();
            
            // 计算方向
            if (Math.abs(x) > threshold || Math.abs(y) > threshold) {
                // 前后移动
                if (y < -threshold) {
                    this.simulateKeyPress('forward');
                } else if (y > threshold) {
                    this.simulateKeyPress('backward');
                }
                
                // 左右移动
                if (x < -threshold) {
                    this.simulateKeyPress('left');
                } else if (x > threshold) {
                    this.simulateKeyPress('right');
                }
            }
        };
        
        // 触摸开始
        joystick.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault();
            this.joystickDragging = true;
            
            const rect = joystick.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
            radius = rect.width / 2 - 30;
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            
            updateJoystickPosition(0, 0);
            
            // 清除之前的RAF
            if (rafId) cancelAnimationFrame(rafId);
        }, { passive: false });
        
        // 触摸移动
        const handleTouchMove = (e) => {
            if (!this.joystickDragging) return;
            if (e.cancelable) e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            // 限制在摇杆范围内
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            let limitedX = deltaX;
            let limitedY = deltaY;
            
            if (distance > radius) {
                limitedX = (deltaX / distance) * radius;
                limitedY = (deltaY / distance) * radius;
            }
            
            // 使用RAF优化性能
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                updateJoystickPosition(limitedX, limitedY);
                handleJoystickInput(limitedX, limitedY);
            });
        };
        
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        
        // 触摸结束
        const handleTouchEnd = (e) => {
            if (!this.joystickDragging) return;
            this.joystickDragging = false;
            
            // 使用RAF确保流畅
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                updateJoystickPosition(0, 0);
                this.releaseJoystickKeys();
            });
        };
        
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);
        
        // 鼠标事件支持（用于测试）- 添加passive: true避免警告
        joystick.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.joystickDragging = true;
            
            const rect = joystick.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
            radius = rect.width / 2 - 30;
            
            startX = e.clientX;
            startY = e.clientY;
            
            updateJoystickPosition(0, 0);
        }, { passive: false });
        
        const handleMouseMove = (e) => {
            if (!this.joystickDragging) return;
            e.preventDefault();
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            let limitedX = deltaX;
            let limitedY = deltaY;
            
            if (distance > radius) {
                limitedX = (deltaX / distance) * radius;
                limitedY = (deltaY / distance) * radius;
            }
            
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                updateJoystickPosition(limitedX, limitedY);
                handleJoystickInput(limitedX, limitedY);
            });
        };
        
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        
        const handleMouseUp = () => {
            if (!this.joystickDragging) return;
            this.joystickDragging = false;
            
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                updateJoystickPosition(0, 0);
                this.releaseJoystickKeys();
            });
        };
        
        document.addEventListener('mouseup', handleMouseUp, { passive: false });
    }
    
    // 释放摇杆按键
    releaseJoystickKeys() {
        ['forward', 'backward', 'left', 'right'].forEach(action => {
            this.simulateKeyRelease(action);
        });
    }
    
    // 初始化按钮事件（优化性能）
    initButtonEvents() {
        this.touchButtons.forEach((button, action) => {
            // 使用防抖避免频繁触发
            let pressTimeout = null;
            let isPressed = false;
            
            const handlePress = () => {
                if (isPressed) return;
                isPressed = true;
                
                button.style.transform = 'scale(0.9)';
                button.style.background = 'rgba(0, 102, 255, 0.9)';
                button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
                
                this.simulateKeyPress(action);
                
                // 播放点击音效
                if (window.MC && window.MC.playSound) {
                    window.MC.playSound('click');
                }
            };
            
            const handleRelease = () => {
                if (!isPressed) return;
                isPressed = false;
                
                button.style.transform = 'scale(1)';
                button.style.background = 'rgba(42, 59, 90, 0.8)';
                button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                
                this.simulateKeyRelease(action);
                
                if (pressTimeout) {
                    clearTimeout(pressTimeout);
                    pressTimeout = null;
                }
            };
            
            // 触摸事件
            button.addEventListener('touchstart', (e) => {
                if (e.cancelable) e.preventDefault();
                handlePress();
            }, { passive: false });
            
            button.addEventListener('touchend', (e) => {
                if (e.cancelable) e.preventDefault();
                handleRelease();
            }, { passive: false });
            
            button.addEventListener('touchcancel', (e) => {
                if (e.cancelable) e.preventDefault();
                handleRelease();
            }, { passive: false });
            
            // 鼠标事件（用于测试）
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                handlePress();
            }, { passive: false });
            
            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                handleRelease();
            }, { passive: false });
            
            button.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                handleRelease();
            }, { passive: false });
        });
    }
    
    // 模拟按键按下（优化性能）
    simulateKeyPress(action) {
        const keyCode = this.keyMappings[action];
        if (!keyCode) return;
        
        // 使用setTimeout避免阻塞主线程
        setTimeout(() => {
            this.sendKeyEventToGame('keydown', keyCode);
        }, 0);
        
        // 记录活动按键
        this.activeKeys.add(action);
    }
    
    // 模拟按键释放
    simulateKeyRelease(action) {
        const keyCode = this.keyMappings[action];
        if (!keyCode) return;
        
        setTimeout(() => {
            this.sendKeyEventToGame('keyup', keyCode);
        }, 0);
        
        // 移除活动按键
        this.activeKeys.delete(action);
    }
    
    // 发送键盘事件到游戏（优化性能）
    sendKeyEventToGame(eventType, keyCode) {
        try {
            // 获取游戏iframe
            const gameFrame = document.getElementById('gameFrame');
            if (!gameFrame || !gameFrame.contentWindow) {
                return;
            }
            
            // 使用try-catch避免跨域错误
            try {
                const event = new KeyboardEvent(eventType, {
                    key: this.getKeyFromCode(keyCode),
                    code: keyCode,
                    keyCode: this.getKeyCode(keyCode),
                    which: this.getKeyCode(key),
                    bubbles: true,
                    cancelable: true,
                    composed: true
                });
                
                gameFrame.contentWindow.dispatchEvent(event);
            } catch (e) {
                // 静默处理跨域错误
            }
            
        } catch (e) {
            console.warn('发送键盘事件失败:', e.message);
        }
    }
    
    // 根据code获取key
    getKeyFromCode(code) {
        const keyMap = {
            'KeyW': 'w',
            'KeyS': 's',
            'KeyA': 'a',
            'KeyD': 'd',
            'Space': ' ',
            'ShiftLeft': 'Shift',
            'KeyE': 'e'
        };
        return keyMap[code] || '';
    }
    
    // 根据code获取keyCode
    getKeyCode(code) {
        const keyCodeMap = {
            'KeyW': 87,  // W
            'KeyS': 83,  // S
            'KeyA': 65,  // A
            'KeyD': 68,  // D
            'Space': 32, // 空格
            'ShiftLeft': 16, // Shift
            'KeyE': 69   // E
        };
        return keyCodeMap[code] || 0;
    }
    
    // 添加事件监听器（优化性能）
    addEventListeners() {
        // 监听游戏加载事件
        window.addEventListener('game-loaded', () => {
            setTimeout(() => {
                this.checkIfTouchNeeded();
            }, 1000);
        }, { passive: true });
        
        // 监听游戏版本切换
        window.addEventListener('version-changed', (e) => {
            setTimeout(() => {
                if (this.isMobile) {
                    const touchEnabled = localStorage.getItem('mc_touch_enabled') !== 'false';
                    if (touchEnabled) {
                        this.enable();
                    }
                }
            }, 500);
        }, { passive: true });
        
        // 监听窗口大小变化（使用防抖）
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.isMobile = this.detectMobile();
                if (!this.isMobile && this.enabled) {
                    this.disable();
                }
            }, 250);
        }, { passive: true });
        
        // 防止触摸事件冒泡到游戏（使用passive: true提高性能）
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('#mc-touch-overlay') && this.enabled) {
                if (e.cancelable) e.stopPropagation();
            }
        }, { passive: true, capture: true });
        
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('#mc-touch-overlay') && this.enabled) {
                if (e.cancelable) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, { passive: false, capture: true });
    }
    
    // 启用触摸控制器（优化性能）
    enable() {
        if (this.enabled) return;
        
        this.enabled = true;
        
        // 使用RAF确保流畅显示
        requestAnimationFrame(() => {
            this.show();
        });
        
        console.log('%c👆 触摸控制器已启用 - 移动端控制激活', 'color: #00ff88;');
        
        // 延迟显示通知，避免阻塞
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification('通用触控控制器已启用，长按按钮进行游戏控制');
            }
        }, 500);
        
        // 发送启用事件
        window.dispatchEvent(new CustomEvent('touch-controller-enabled'));
    }
    
    // 禁用触摸控制器
    disable() {
        if (!this.enabled) return;
        
        this.enabled = false;
        
        requestAnimationFrame(() => {
            this.hide();
        });
        
        // 释放所有活动按键
        this.activeKeys.forEach(action => {
            this.simulateKeyRelease(action);
        });
        this.activeKeys.clear();
        
        console.log('%c👆 触摸控制器已禁用', 'color: #8a9bb8;');
        
        // 发送禁用事件
        window.dispatchEvent(new CustomEvent('touch-controller-disabled'));
    }
    
    // 显示控制器
    show() {
        if (this.touchOverlay) {
            this.touchOverlay.style.display = 'block';
            this.controllerVisible = true;
        }
    }
    
    // 隐藏控制器
    hide() {
        if (this.touchOverlay) {
            this.touchOverlay.style.display = 'none';
            this.controllerVisible = false;
        }
    }
    
    // 切换可见性
    toggleVisibility() {
        if (this.controllerVisible) {
            this.hide();
            if (typeof showNotification === 'function') {
                showNotification('触控控制器已隐藏');
            }
        } else {
            this.show();
            if (typeof showNotification === 'function') {
                showNotification('触控控制器已显示');
            }
        }
    }
    
    // 手动触发版本检查（通用触控）
    checkVersion(version) {
        if (this.isMobile) {
            const touchEnabled = localStorage.getItem('mc_touch_enabled') !== 'false';
            if (touchEnabled) {
                this.enable();
            } else {
                this.disable();
            }
        }
    }
    
    // 销毁控制器（优化资源清理）
    destroy() {
        this.disable();
        
        if (this.touchOverlay) {
            this.touchOverlay.remove();
            this.touchOverlay = null;
        }
        
        this.touchButtons.clear();
        this.activeKeys.clear();
        
        console.log('%c👆 触摸控制器已销毁', 'color: #ff5555;');
    }
}

// 延迟初始化触摸控制器，避免影响页面加载性能
let touchControllerInitialized = false;

function initializeTouchController() {
    if (touchControllerInitialized) return;
    
    // 创建全局触摸控制器实例
    window.TouchController = new TouchController();
    touchControllerInitialized = true;
}

// 在页面加载完成后延迟初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeTouchController, 2000); // 延迟2秒初始化，避免影响主线程
    });
} else {
    setTimeout(initializeTouchController, 2000);
}

// 导出全局函数
window.enableTouchController = function() {
    if (window.TouchController) {
        window.TouchController.enable();
    }
};

window.disableTouchController = function() {
    if (window.TouchController) {
        window.TouchController.disable();
    }
};

window.toggleTouchController = function() {
    if (window.TouchController) {
        window.TouchController.toggleVisibility();
    }
};

console.log('%c🎮 触摸控制器全局API已就绪', 'color: #00e5ff; font-weight: bold;');
