// MC.js - 科技感游戏引擎模拟
// 提供全局MC对象和科技感特效
// 开发者：爱写代码的辉辉

console.log('%c⚡ MC.js 游戏引擎已加载 - 系统初始化完成', 
    'color: #00e5ff; font-family: "Orbitron", sans-serif; font-size: 14px; font-weight: bold;');

// 创建全局MC对象
window.MC = {
    version: '2.2.0',
    engine: 'WebGL 2.0',
    status: 'ready',
    audioEnabled: true,
    audioContext: null,
    sounds: null,
    audioNodes: [], // 跟踪所有音频节点以便清理
    
    // 系统初始化
    initialize: function() {
        console.log('%c🚀 游戏引擎初始化中...', 'color: #00ff88; font-weight: bold;');
        
        // 清理之前的状态
        this.cleanup();
        
        // 模拟初始化过程
        this.simulateBootSequence();
        
        // 添加科技感音效（模拟）
        this.addTechSounds();
        
        return {
            success: true,
            timestamp: new Date().toISOString(),
            message: '游戏引擎就绪',
            developer: '爱写代码的辉辉'
        };
    },
    
    // 清理资源
    cleanup: function() {
        // 清理音频节点
        this.cleanupAudioNodes();
        
        // 安全关闭音频上下文
        this.safeCloseAudioContext();
        
        // 重置状态
        this.sounds = null;
        this.audioContext = null;
        this.audioNodes = [];
    },
    
    // 清理音频节点
    cleanupAudioNodes: function() {
        this.audioNodes.forEach(node => {
            try {
                if (node.disconnect) node.disconnect();
                if (node.stop) node.stop();
            } catch (e) {
                // 忽略清理错误
            }
        });
        this.audioNodes = [];
    },
    
    // 模拟启动序列
    simulateBootSequence: function() {
        const steps = [
            '正在检查系统兼容性...',
            '加载WebGL渲染器...',
            '初始化游戏物理引擎...',
            '建立网络连接...',
            '加载游戏资源...',
            '启动游戏世界...'
        ];
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                console.log(`%c${step} ✓`, 'color: #8a9bb8;');
                
                // 模拟进度更新
                if (typeof window.updateMCProgress === 'function') {
                    window.updateMCProgress((index + 1) * (100 / steps.length));
                }
            }, index * 500);
        });
    },
    
    // 添加科技感音效
    addTechSounds: function() {
        // 检查是否启用音效
        const soundEnabled = localStorage.getItem('mc_sound_enabled') !== 'false';
        this.audioEnabled = soundEnabled;
        
        if (!soundEnabled) {
            console.log('%c🔇 音效已禁用', 'color: #8a9bb8;');
            return;
        }
        
        // 创建音效上下文（仅用于UI反馈）
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            if (window.AudioContext) {
                // 延迟创建音频上下文，避免自动播放问题
                setTimeout(() => {
                    try {
                        this.audioContext = new AudioContext();
                        
                        // 预加载音效
                        this.preloadSounds();
                        
                        console.log('%c🎵 音频系统初始化完成', 'color: #00e5ff; font-weight: bold;');
                    } catch (e) {
                        console.log('%c⚠️ 音频系统初始化失败，继续使用视觉效果', 'color: #ffaa00;');
                    }
                }, 2000);
            }
        } catch (e) {
            console.log('%c⚠️ 音频系统不可用，继续使用视觉效果', 'color: #ffaa00;');
        }
    },
    
    // 预加载音效
    preloadSounds: function() {
        if (!this.audioEnabled || !this.audioContext) return;
        
        this.sounds = {
            click: this.createBeepSound(800, 0.1),
            confirm: this.createBeepSound(1200, 0.2),
            error: this.createBeepSound(400, 0.3),
            success: this.createChordSound([1200, 1500, 1800], 0.3),
            hover: this.createBeepSound(600, 0.05)
        };
    },
    
    // 创建蜂鸣音效（优化性能）
    createBeepSound: function(frequency, duration) {
        return () => {
            if (!this.audioEnabled || !this.audioContext || this.audioContext.state === 'closed') {
                return;
            }
            
            try {
                // 如果上下文是挂起的，恢复它
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().catch(() => {});
                }
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // 跟踪音频节点以便清理
                this.audioNodes.push(oscillator, gainNode);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + duration);
                
                // 自动清理过期的音频节点
                setTimeout(() => {
                    try {
                        const index = this.audioNodes.indexOf(oscillator);
                        if (index > -1) {
                            this.audioNodes.splice(index, 1);
                        }
                        if (oscillator.disconnect) oscillator.disconnect();
                        if (gainNode.disconnect) gainNode.disconnect();
                    } catch (e) {
                        // 忽略清理错误
                    }
                }, duration * 1000 + 100);
            } catch (e) {
                // 静默处理音频错误
            }
        };
    },
    
    // 创建和弦音效
    createChordSound: function(frequencies, duration) {
        return () => {
            if (!this.audioEnabled || !this.audioContext || this.audioContext.state === 'closed') {
                return;
            }
            
            try {
                // 如果上下文是挂起的，恢复它
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().catch(() => {});
                }
                
                frequencies.forEach(freq => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    // 跟踪音频节点
                    this.audioNodes.push(oscillator, gainNode);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + duration);
                    
                    // 自动清理
                    setTimeout(() => {
                        try {
                            const index = this.audioNodes.indexOf(oscillator);
                            if (index > -1) {
                                this.audioNodes.splice(index, 1);
                            }
                            if (oscillator.disconnect) oscillator.disconnect();
                            if (gainNode.disconnect) gainNode.disconnect();
                        } catch (e) {
                            // 忽略清理错误
                        }
                    }, duration * 1000 + 100);
                });
            } catch (e) {
                // 静默处理音频错误
            }
        };
    },
    
    // 播放音效（优化音频错误处理）
    playSound: function(soundName) {
        if (!this.audioEnabled) return;
        
        // 延迟执行以避免阻塞主线程
        setTimeout(() => {
            try {
                if (this.sounds && this.sounds[soundName]) {
                    // 检查音频上下文状态
                    if (this.audioContext && this.audioContext.state !== 'closed') {
                        try {
                            this.sounds[soundName]();
                        } catch (e) {
                            // 静默处理播放错误
                        }
                    }
                }
            } catch (e) {
                // 静默处理系统错误
            }
        }, 10);
    },
    
    // 启用/禁用音效
    setAudioEnabled: function(enabled) {
        this.audioEnabled = enabled;
        
        if (!enabled && this.audioContext && this.audioContext.state !== 'closed') {
            this.safeCloseAudioContext();
        } else if (enabled && (!this.audioContext || this.audioContext.state === 'closed')) {
            // 延迟初始化音频
            setTimeout(() => {
                this.addTechSounds();
            }, 1000);
        }
        
        localStorage.setItem('mc_sound_enabled', enabled);
    },
    
    // 安全关闭音频上下文
    safeCloseAudioContext: function() {
        if (!this.audioContext) return;
        
        try {
            // 先清理所有音频节点
            this.cleanupAudioNodes();
            
            if (this.audioContext.state !== 'closed') {
                this.audioContext.close();
            }
        } catch (e) {
            // 静默处理关闭错误
        } finally {
            this.audioContext = null;
        }
    },
    
    // 获取性能数据
    getPerformance: function() {
        // 模拟性能数据，但添加一些随机变化
        const baseFPS = 60;
        const baseMemory = 2048;
        const baseLatency = 24;
        
        // 添加一些随机变化，但保持在合理范围内
        const fps = Math.max(30, Math.min(120, baseFPS + Math.random() * 40 - 20));
        const memory = Math.max(1024, Math.min(4096, baseMemory + Math.random() * 1024 - 512));
        const latency = Math.max(10, Math.min(100, baseLatency + Math.random() * 30 - 15));
        
        return {
            fps: Math.round(fps),
            memory: Math.round(memory),
            latency: Math.round(latency)
        };
    },
    
    // 系统诊断
    diagnose: function() {
        const diagnostics = {
            webgl: this.checkWebGL(),
            audio: this.checkAudio(),
            network: this.checkNetwork(),
            storage: this.checkStorage(),
            screen: this.checkScreen(),
            browser: this.checkBrowser(),
            developer: '爱写代码的辉辉'
        };
        
        console.table(diagnostics);
        return diagnostics;
    },
    
    // 检查WebGL支持
    checkWebGL: function() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    },
    
    // 检查音频支持
    checkAudio: function() {
        return !!(window.AudioContext || window.webkitAudioContext);
    },
    
    // 检查网络状态
    checkNetwork: function() {
        return navigator.onLine ? 'online' : 'offline';
    },
    
    // 检查存储
    checkStorage: function() {
        return !!window.localStorage;
    },
    
    // 检查屏幕信息
    checkScreen: function() {
        return {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelRatio: window.devicePixelRatio
        };
    },
    
    // 检查浏览器信息
    checkBrowser: function() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.indexOf('Chrome') > -1 && !ua.indexOf('Edge') > -1) browser = 'Chrome';
        else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (ua.indexOf('Safari') > -1 && !ua.indexOf('Chrome') > -1) browser = 'Safari';
        else if (ua.indexOf('Edge') > -1) browser = 'Edge';
        else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) browser = 'Opera';
        
        return browser;
    },
    
    // 显示系统信息
    showSystemInfo: function() {
        const performance = this.getPerformance();
        const screen = this.checkScreen();
        const browser = this.checkBrowser();
        
        const info = `
            游戏引擎版本: ${this.version}
            渲染引擎: ${this.engine}
            系统状态: ${this.status}
            开发者: 爱写代码的辉辉
            浏览器: ${browser}
            屏幕分辨率: ${screen.width}x${screen.height}
            设备像素比: ${screen.pixelRatio}
            性能指标: 
              - FPS: ${performance.fps}
              - 内存: ${performance.memory}MB
              - 延迟: ${performance.latency}ms
            音效状态: ${this.audioEnabled ? '启用' : '禁用'}
        `;
        
        console.log('%c📊 系统信息:', 'color: #00e5ff; font-weight: bold;');
        console.log(info);
        
        return info;
    },
    
    // 获取游戏状态
    getGameStatus: function() {
        return {
            loaded: window.gameLoaded || false,
            version: this.version,
            url: window.currentGameUrl || '',
            timestamp: new Date().toISOString(),
            developer: '爱写代码的辉辉'
        };
    },
    
    // 生成随机ID
    generateId: function() {
        return 'mc_' + Math.random().toString(36).substr(2, 9);
    },
    
    // 保存游戏状态（模拟）
    saveGameState: function(stateName = 'autosave') {
        const state = {
            id: this.generateId(),
            name: stateName,
            timestamp: new Date().toISOString(),
            gameStatus: this.getGameStatus(),
            performance: this.getPerformance(),
            developer: '爱写代码的辉辉'
        };
        
        try {
            const saves = JSON.parse(localStorage.getItem('mc_game_saves') || '[]');
            saves.push(state);
            localStorage.setItem('mc_game_saves', JSON.stringify(saves.slice(-10))); // 只保存最近10个
            
            console.log(`%c💾 游戏状态已保存: ${stateName}`, 'color: #00ff88;');
            return state;
        } catch (e) {
            console.error('保存游戏状态失败:', e);
            return null;
        }
    },
    
    // 加载游戏状态（模拟）
    loadGameState: function(stateId) {
        try {
            const saves = JSON.parse(localStorage.getItem('mc_game_saves') || '[]');
            const state = saves.find(s => s.id === stateId);
            
            if (state) {
                console.log(`%c📂 加载游戏状态: ${state.name}`, 'color: #00e5ff;');
                return state;
            }
            
            return null;
        } catch (e) {
            console.error('加载游戏状态失败:', e);
            return null;
        }
    }
};

// 初始化完成后的回调
setTimeout(() => {
    if (window.MC) {
        const result = window.MC.initialize();
        
        // 绑定全局函数
        window.updateMCProgress = function(progress) {
            // 可以与主加载器同步进度
            const progressEvent = new CustomEvent('mc-progress', { 
                detail: { progress: Math.min(progress, 100) }
            });
            window.dispatchEvent(progressEvent);
        };
        
        console.log('%c✅ 游戏引擎初始化完成！', 
            'color: #00ff88; font-family: "Orbitron", sans-serif; font-size: 16px; font-weight: bold;');
        console.log(`%c启动时间: ${new Date().toLocaleTimeString()}`, 'color: #8a9bb8;');
        console.log(`%c开发者: 爱写代码的辉辉`, 'color: #00e5ff;');
        
        // 显示系统信息
        window.MC.showSystemInfo();
        
        // 检查音效设置
        const soundEnabled = localStorage.getItem('mc_sound_enabled') !== 'false';
        window.MC.setAudioEnabled(soundEnabled);
    }
}, 1500);

// 添加全局事件监听器
window.addEventListener('mc-progress', (event) => {
    // 这里可以处理MC.js的进度更新
    if (window.console && event.detail) {
        console.log(`MC.js进度: ${event.detail.progress}%`);
    }
}, { passive: true });

// 导出全局函数用于UI交互
window.playTechSound = function(soundType) {
    if (window.MC && window.MC.playSound) {
        window.MC.playSound(soundType);
    }
};

window.getSystemDiagnostics = function() {
    if (window.MC && window.MC.diagnose) {
        return window.MC.diagnose();
    }
    return null;
};

window.saveGameState = function(name) {
    if (window.MC && window.MC.saveGameState) {
        return window.MC.saveGameState(name);
    }
    return null;
};

window.loadGameState = function(id) {
    if (window.MC && window.MC.loadGameState) {
        return window.MC.loadGameState(id);
    }
    return null;
};

// 添加页面卸载时的清理
window.addEventListener('beforeunload', () => {
    if (window.MC) {
        // 安全关闭音频上下文
        window.MC.safeCloseAudioContext();
        
        // 保存当前状态
        if (window.gameLoaded) {
            window.MC.saveGameState('autosave_last');
        }
    }
}, { passive: true });

// 添加页面可见性变化监听
document.addEventListener('visibilitychange', () => {
    if (window.MC && window.MC.audioContext) {
        if (document.hidden) {
            // 页面隐藏时暂停音频
            if (window.MC.audioContext.state === 'running') {
                window.MC.audioContext.suspend().catch(() => {});
            }
        } else {
            // 页面显示时恢复音频
            if (window.MC.audioContext.state === 'suspended') {
                window.MC.audioContext.resume().catch(() => {});
            }
        }
    }
}, { passive: true });

// 添加鼠标悬停音效（优化性能）
document.addEventListener('DOMContentLoaded', () => {
    // 延迟执行，确保UI已加载
    setTimeout(() => {
        const interactiveElements = document.querySelectorAll('.nav-btn, .tool-btn, .action-btn, .launch-btn');
        
        interactiveElements.forEach(element => {
            let hoverTimeout = null;
            
            element.addEventListener('mouseenter', () => {
                if (window.MC && window.MC.playSound && localStorage.getItem('mc_sound_enabled') !== 'false') {
                    // 使用防抖避免频繁触发
                    if (!hoverTimeout) {
                        hoverTimeout = setTimeout(() => {
                            window.MC.playSound('hover');
                            hoverTimeout = null;
                        }, 150);
                    }
                }
            }, { passive: true });
            
            element.addEventListener('mouseleave', () => {
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = null;
                }
            }, { passive: true });
            
            // 触摸设备支持
            element.addEventListener('touchstart', () => {
                if (window.MC && window.MC.playSound && localStorage.getItem('mc_sound_enabled') !== 'false') {
                    if (!hoverTimeout) {
                        hoverTimeout = setTimeout(() => {
                            window.MC.playSound('hover');
                            hoverTimeout = null;
                        }, 150);
                    }
                }
            }, { passive: true });
        });
    }, 2000);
});

// 错误处理增强（静默处理触摸和音频错误）
window.addEventListener('error', (event) => {
    // 忽略触摸事件错误和音频自动播放错误
    if (event.error && event.error.message) {
        const errorMsg = event.error.message.toLowerCase();
        
        // 忽略触摸事件错误
        if (errorMsg.includes('touch') || errorMsg.includes('cancelable=false')) {
            event.preventDefault();
            return;
        }
        
        // 忽略音频自动播放错误
        if (errorMsg.includes('play()') && errorMsg.includes('user gesture')) {
            event.preventDefault();
            return;
        }
        
        // 忽略AudioContext相关的错误
        if (errorMsg.includes('audiocontext') || errorMsg.includes('audio')) {
            event.preventDefault();
            return;
        }
        
        // 忽略iframe相关错误
        if (errorMsg.includes('iframe') || errorMsg.includes('about:blank')) {
            event.preventDefault();
            return;
        }
    }
    
    // 非阻塞错误记录
    setTimeout(() => {
        if (event.error) {
            console.error('全局错误捕获:', event.error);
        }
    }, 0);
    
    // 显示用户友好的错误消息
    if (event.error && event.error.message) {
        const errorMsg = event.error.message;
        
        // 游戏加载错误
        if (errorMsg.includes('game') || errorMsg.includes('加载') || errorMsg.includes('加载失败')) {
            if (typeof window.showError === 'function') {
                setTimeout(() => {
                    window.showError('游戏加载失败，请检查网络连接或尝试其他版本');
                }, 100);
            }
        }
    }
}, { passive: true });

// 未处理的Promise拒绝（静默处理）
window.addEventListener('unhandledrejection', (event) => {
    // 忽略音频相关错误
    if (event.reason && event.reason.message) {
        const errorMsg = event.reason.message.toLowerCase();
        
        if (errorMsg.includes('audiocontext') || 
            errorMsg.includes('close') || 
            errorMsg.includes('closed') ||
            errorMsg.includes('play()') ||
            errorMsg.includes('user gesture')) {
            event.preventDefault();
            return;
        }
        
        // 忽略iframe相关错误
        if (errorMsg.includes('iframe') || errorMsg.includes('about:blank')) {
            event.preventDefault();
            return;
        }
    }
    
    // 非阻塞错误记录
    setTimeout(() => {
        console.error('未处理的Promise拒绝:', event.reason);
    }, 0);
}, { passive: true });

// 触摸事件处理优化（使用passive提高性能）
document.addEventListener('touchstart', function(e) {
    // 防止默认行为，但仅在必要时
    if (e.target.tagName === 'IFRAME' && e.cancelable) {
        e.preventDefault();
    }
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    // 防止默认行为，但仅在必要时
    if (e.target.tagName === 'IFRAME' && e.cancelable) {
        e.preventDefault();
    }
}, { passive: true });

// 添加内存监控
setInterval(() => {
    if (window.MC && window.MC.audioNodes && window.MC.audioNodes.length > 50) {
        window.MC.cleanupAudioNodes();
    }
}, 60000); // 每分钟检查一次

console.log('%c🎮 MC.js 游戏引擎增强版已就绪 - 开发者：爱写代码的辉辉', 'color: #00e5ff; font-weight: bold; font-size: 14px;');
