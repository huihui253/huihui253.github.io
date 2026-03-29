// Windows XP 模拟器 - JavaScript 功能实现

// 全局变量
const windows = [];
let activeWindow = null;
let nextWindowId = 1;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isResizing = false;
let resizeEdge = '';
let desktopIcons = [];
let selectedIcon = null;
let clipboard = null;
let isContextMenuOpen = false;
let currentContextElement = null;

// DOM 元素
const desktop = document.getElementById('desktop');
const taskbar = document.getElementById('taskbar');
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
const taskbarItems = document.getElementById('taskbar-items');
const windowsContainer = document.getElementById('windows-container');
const contextMenu = document.getElementById('context-menu');
const clock = document.getElementById('clock');
const shutdownDialog = document.getElementById('shutdown-dialog');
const shutdownOk = document.getElementById('shutdown-ok');
const shutdownCancel = document.getElementById('shutdown-cancel');
const shutdownOptions = document.querySelectorAll('.shutdown-option');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

// 初始化函数
function initialize() {
    // 设置桌面图标位置
    setupDesktopIcons();
    
    // 设置时钟
    updateClock();
    setInterval(updateClock, 1000);
    
    // 添加事件监听器
    setupEventListeners();
    
    // 从本地存储加载文档内容
    loadDocumentsFromLocalStorage();
}

// 设置桌面图标位置
function setupDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach((icon, index) => {
        const iconData = {
            element: icon,
            type: icon.dataset.type,
            x: 20,
            y: 20 + index * 90,
            name: icon.querySelector('span').textContent
        };
        
        icon.style.left = `${iconData.x}px`;
        icon.style.top = `${iconData.y}px`;
        
        desktopIcons.push(iconData);
    });
}

// 更新时钟
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
}

// 设置事件监听器
function setupEventListeners() {
    // 开始按钮点击事件
    startButton.addEventListener('click', toggleStartMenu);
    
    // 桌面点击事件
    desktop.addEventListener('click', (e) => {
        if (e.target === desktop) {
            deselectAllIcons();
            closeContextMenu();
        }
    });
    
    // 桌面图标双击事件
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', (e) => {
            e.preventDefault();
            const iconType = icon.dataset.type;
            openWindowFromIcon(iconType);
        });
    });
    
    // 桌面图标右键点击事件
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const iconType = icon.dataset.type;
            showIconContextMenu(e, iconType, icon);
        });
    });
    
    // 桌面右键点击事件
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (e.target === desktop) {
            showDesktopContextMenu(e);
        }
    });
    
    // 开始菜单项点击事件
    document.querySelectorAll('.start-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleStartMenuAction(action);
            closeStartMenu();
        });
    });
    
    // 右键菜单项点击事件
    document.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleContextMenuAction(action);
            closeContextMenu();
        });
    });
    
    // 关闭计算机对话框事件
    shutdownOk.addEventListener('click', handleShutdownAction);
    shutdownCancel.addEventListener('click', () => {
        shutdownDialog.classList.add('hidden');
    });
    
    shutdownOptions.forEach(option => {
        option.addEventListener('click', () => {
            shutdownOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // 窗口调整大小事件
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 键盘事件
    document.addEventListener('keydown', handleKeyDown);
    
    // 窗口容器点击事件
    windowsContainer.addEventListener('click', (e) => {
        if (e.target === windowsContainer) {
            deselectAllIcons();
            closeContextMenu();
        }
    });
}

// 打开窗口从图标
function openWindowFromIcon(iconType) {
    switch (iconType) {
        case 'my-documents':
            openMyDocumentsWindow();
            break;
        case 'my-computer':
            openMyComputerWindow();
            break;
        case 'recycle-bin':
            openRecycleBinWindow();
            break;
        case 'network-neighborhood':
            openNetworkNeighborhoodWindow();
            break;
        case 'text-document':
            openTextDocumentWindow('文档.txt');
            break;
    }
}

// 打开我的文档窗口
function openMyDocumentsWindow() {
    const windowId = `window-${nextWindowId++}`;
    const windowTitle = '我的文档';
    
    const windowContent = `
        <div class="file-manager">
            <div class="file-manager-toolbar">
                <button class="toolbar-button">后退</button>
                <button class="toolbar-button">前进</button>
                <button class="toolbar-button">向上</button>
                <div class="file-manager-path">C:\\Documents and Settings\\用户\\My Documents</div>
                <button class="toolbar-button">搜索</button>
                <button class="toolbar-button">文件夹</button>
            </div>
            <div class="file-manager-content">
                <div class="file-manager-sidebar">
                    <div class="sidebar-section">
                        <h3>文件夹</h3>
                        <ul>
                            <li>我的文档</li>
                            <li>我最近的文档</li>
                            <li>桌面</li>
                            <li>收藏夹</li>
                        </ul>
                    </div>
                    <div class="sidebar-section">
                        <h3>系统任务</h3>
                        <ul>
                            <li>查看系统信息</li>
                            <li>添加/删除程序</li>
                            <li>获取帮助</li>
                        </ul>
                    </div>
                </div>
                <div class="file-manager-folders">
                    <div class="file-item" data-type="folder">
                        <img src="https://p26-doubao-search-sign.byteimg.com/labis/9520e59841677e31920b930edc891ff4~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565983&x-signature=pthasl2WaSFEj7UfW7d4Ck2G4Cw%3D" alt="我的音乐">
                        <span>我的音乐</span>
                    </div>
                    <div class="file-item" data-type="folder">
                        <img src="https://p26-doubao-search-sign.byteimg.com/labis/9520e59841677e31920b930edc891ff4~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565983&x-signature=pthasl2WaSFEj7UfW7d4Ck2G4Cw%3D" alt="我的图片">
                        <span>我的图片</span>
                    </div>
                    <div class="file-item" data-type="folder">
                        <img src="https://p26-doubao-search-sign.byteimg.com/labis/9520e59841677e31920b930edc891ff4~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565983&x-signature=pthasl2WaSFEj7UfW7d4Ck2G4Cw%3D" alt="我的视频">
                        <span>我的视频</span>
                    </div>
                    <div class="file-item" data-type="document">
                        <img src="https://p26-doubao-search-sign.byteimg.com/labis/f3e5bd87d9575e10f278dbf80272e5bc~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565983&x-signature=YDjKGKs%2BazDqNqK2pj3WeNA46Wk%3D" alt="文档1">
                        <span>文档1.txt</span>
                    </div>
                    <div class="file-item" data-type="document">
                        <img src="https://p26-doubao-search-sign.byteimg.com/labis/f3e5bd87d9575e10f278dbf80272e5bc~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565983&x-signature=YDjKGKs%2BazDqNqK2pj3WeNA46Wk%3D" alt="文档2">
                        <span>文档2.txt</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    createWindow(windowId, windowTitle, windowContent, 300, 200, 600, 400, 'my-documents');
}

// 打开我的电脑窗口
function openMyComputerWindow() {
    const windowId = `window-${nextWindowId++}`;
    const windowTitle = '我的电脑';
    
    const windowContent = `
        <div class="file-manager">
            <div class="file-manager-toolbar">
                <button class="toolbar-button">后退</button>
                <button class="toolbar-button">前进</button>
                <button class="toolbar-button">向上</button>
                <div class="file-manager-path">我的电脑</div>
                <button class="toolbar-button">搜索</button>
                <button class="toolbar-button">文件夹</button>
            </div>
            <div class="file-manager-content">
                <div class="file-manager-sidebar">
                    <div class="sidebar-section">
                        <h3>系统任务</h3>
                        <ul>
                            <li>查看系统信息</li>
                            <li>添加/删除程序</li>
                            <li>获取帮助</li>
                        </ul>
                    </div>
                    <div class="sidebar-section">
                        <h3>其他位置</h3>
                        <ul>
                            <li>我的文档</li>
                            <li>桌面</li>
                            <li>网上邻居</li>
                            <li>回收站</li>
                        </ul>
                    </div>
                </div>
                <div class="file-manager-folders">
                    <div class="file-item" data-type="drive">
                        <img src="https://p26-doubao-search-sign.byteimg.com/labis/image/04db6b6259843bff47e1547dc8416ab1~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565982&x-signature=aKEkI%2BtCLZSpbZrkJRmyhiCTaiY%3D" alt="本地磁盘C">
                        <span>本地磁盘 (C:)</span>
                    </div>
                    <div class="file-item" data-type="drive">
                        <img src="https://p26-doubao-search-sign.byteimg.com/labis/image/04db6b6259843bff47e1547dc8416ab1~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565982&x-signature=aKEkI%2BtCLZSpbZrkJRmyhiCTaiY%3D" alt="本地磁盘D">
                        <span>本地磁盘 (D:)</span>
                    </div>
                    <div class="file-item" data-type="drive">
                        <img src="https://p26-doubao-search-sign.byteimg.com/labis/image/04db6b6259843bff47e1547dc8416ab1~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565982&x-signature=aKEkI%2BtCLZSpbZrkJRmyhiCTaiY%3D" alt="DVD驱动器E">
                        <span>DVD 驱动器 (E:)</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    createWindow(windowId, windowTitle, windowContent, 350, 250, 600, 400, 'my-computer');
}

// 打开回收站窗口
function openRecycleBinWindow() {
    const windowId = `window-${nextWindowId++}`;
    const windowTitle = '回收站';
    
    const windowContent = `
        <div class="file-manager">
            <div class="file-manager-toolbar">
                <button class="toolbar-button">后退</button>
                <button class="toolbar-button">前进</button>
                <button class="toolbar-button">向上</button>
                <div class="file-manager-path">回收站</div>
                <button class="toolbar-button">搜索</button>
                <button class="toolbar-button">文件夹</button>
            </div>
            <div class="file-manager-content">
                <div class="file-manager-sidebar">
                    <div class="sidebar-section">
                        <h3>回收站任务</h3>
                        <ul>
                            <li>清空回收站</li>
                            <li>恢复所有项目</li>
                        </ul>
                    </div>
                </div>
                <div class="file-manager-folders">
                    <div class="empty-recycle-bin">
                        <img src="https://p26-doubao-search-sign.byteimg.com/tos-cn-i-be4g95zd3a/1000820185792774288~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565996&x-signature=PvNbiVBqnDaJI%2Bu4h8clq67f%2BjM%3D" alt="回收站">
                        <p>回收站是空的</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    createWindow(windowId, windowTitle, windowContent, 400, 300, 600, 400, 'recycle-bin');
}

// 打开网上邻居窗口
function openNetworkNeighborhoodWindow() {
    const windowId = `window-${nextWindowId++}`;
    const windowTitle = '网上邻居';
    
    const windowContent = `
        <div class="file-manager">
            <div class="file-manager-toolbar">
                <button class="toolbar-button">后退</button>
                <button class="toolbar-button">前进</button>
                <button class="toolbar-button">向上</button>
                <div class="file-manager-path">网上邻居</div>
                <button class="toolbar-button">搜索</button>
                <button class="toolbar-button">文件夹</button>
            </div>
            <div class="file-manager-content">
                <div class="file-manager-sidebar">
                    <div class="sidebar-section">
                        <h3>网络任务</h3>
                        <ul>
                            <li>查看工作组计算机</li>
                            <li>查看网络连接</li>
                            <li>添加网络位置</li>
                        </ul>
                    </div>
                </div>
                <div class="file-manager-folders">
                    <div class="file-item" data-type="network">
                        <img src="https://p3-doubao-search-sign.byteimg.com/labis/ea1cb112693bc7ba809c5cc75453455d~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565995&x-signature=C0fvwVa8CT2ODb846OFXN2xi3Ic%3D" alt="本地网络">
                        <span>本地网络</span>
                    </div>
                    <div class="file-item" data-type="network">
                        <img src="https://p3-doubao-search-sign.byteimg.com/labis/ea1cb112693bc7ba809c5cc75453455d~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778565995&x-signature=C0fvwVa8CT2ODb846OFXN2xi3Ic%3D" alt="工作组">
                        <span>工作组</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    createWindow(windowId, windowTitle, windowContent, 450, 350, 600, 400, 'network-neighborhood');
}

// 打开文本文档窗口
function openTextDocumentWindow(filename) {
    const windowId = `window-${nextWindowId++}`;
    const windowTitle = `${filename} - 记事本`;
    
    // 从本地存储获取文档内容
    const content = localStorage.getItem(`document_${filename}`) || '';
    
    const windowContent = `
        <div class="document-window">
            <div class="window-content">
                <textarea class="document-editor" placeholder="在此处输入文本...">${content}</textarea>
            </div>
        </div>
    `;
    
    const window = createWindow(windowId, windowTitle, windowContent, 250, 150, 600, 400, 'text-document', filename);
    
    // 添加文本编辑器事件监听器
    const editor = window.querySelector('.document-editor');
    editor.addEventListener('input', () => {
        // 保存到本地存储
        localStorage.setItem(`document_${filename}`, editor.value);
    });
}

// 创建窗口
function createWindow(id, title, content, x, y, width, height, type, filename = null) {
    // 检查是否已经打开了相同类型的窗口
    const existingWindow = windows.find(window => window.type === type && window.filename === filename);
    if (existingWindow) {
        activateWindow(existingWindow.id);
        return existingWindow.element;
    }
    
    const windowElement = document.createElement('div');
    windowElement.id = id;
    windowElement.className = 'window';
    windowElement.style.left = `${x}px`;
    windowElement.style.top = `${y}px`;
    windowElement.style.width = `${width}px`;
    windowElement.style.height = `${height}px`;
    
    windowElement.innerHTML = `
        <div class="window-titlebar">
            <div class="window-title">${title}</div>
            <div class="window-controls">
                <div class="window-control-button minimize" data-action="minimize">—</div>
                <div class="window-control-button maximize" data-action="maximize">□</div>
                <div class="window-control-button close" data-action="close">×</div>
            </div>
        </div>
        <div class="window-content">
            ${content}
        </div>
        <div class="window-resize-handle nw"></div>
        <div class="window-resize-handle n"></div>
        <div class="window-resize-handle ne"></div>
        <div class="window-resize-handle e"></div>
        <div class="window-resize-handle se"></div>
        <div class="window-resize-handle s"></div>
        <div class="window-resize-handle sw"></div>
        <div class="window-resize-handle w"></div>
    `;
    
    windowsContainer.appendChild(windowElement);
    
    // 添加窗口到窗口列表
    const window = {
        id,
        element: windowElement,
        title,
        type,
        filename,
        isMaximized: false,
        isMinimized: false,
        originalPosition: { x, y, width, height }
    };
    
    windows.push(window);
    
    // 添加窗口控制按钮事件监听器
    const controlButtons = windowElement.querySelectorAll('.window-control-button');
    controlButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = button.dataset.action;
            handleWindowControlAction(id, action);
        });
    });
    
    // 添加窗口标题栏事件监听器
    const titlebar = windowElement.querySelector('.window-titlebar');
    titlebar.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startDraggingWindow(id, e.clientX, e.clientY);
    });
    
    // 添加窗口调整大小事件监听器
    const resizeHandles = windowElement.querySelectorAll('.window-resize-handle');
    resizeHandles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startResizingWindow(id, e.clientX, e.clientY, handle.classList[1]);
        });
    });
    
    // 添加窗口右键点击事件监听器
    windowElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showWindowContextMenu(e, id);
    });
    
    // 添加文件项事件监听器
    const fileItems = windowElement.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('dblclick', () => {
            const itemType = item.dataset.type;
            handleFileItemClick(id, itemType, item.querySelector('span').textContent);
        });
    });
    
    // 激活窗口
    activateWindow(id);
    
    // 添加任务栏项目
    addTaskbarItem(id, title, type);
    
    return windowElement;
}

// 处理窗口控制操作
function handleWindowControlAction(windowId, action) {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;
    
    switch (action) {
        case 'minimize':
            minimizeWindow(windowId);
            break;
        case 'maximize':
            maximizeWindow(windowId);
            break;
        case 'close':
            closeWindow(windowId);
            break;
    }
}

// 最小化窗口
function minimizeWindow(windowId) {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;
    
    window.isMinimized = true;
    window.element.classList.add('minimized');
    
    // 更新任务栏项目
    updateTaskbarItem(windowId, { isActive: false, isMinimized: true });
    
    // 激活下一个窗口
    activateNextWindow(windowId);
}

// 最大化窗口
function maximizeWindow(windowId) {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;
    
    if (window.isMaximized) {
        // 恢复窗口到原始大小和位置
        window.element.style.left = `${window.originalPosition.x}px`;
        window.element.style.top = `${window.originalPosition.y}px`;
        window.element.style.width = `${window.originalPosition.width}px`;
        window.element.style.height = `${window.originalPosition.height}px`;
        window.element.classList.remove('maximized');
        window.isMaximized = false;
    } else {
        // 保存原始大小和位置
        window.originalPosition = {
            x: parseInt(window.element.style.left),
            y: parseInt(window.element.style.top),
            width: parseInt(window.element.style.width),
            height: parseInt(window.element.style.height)
        };
        
        // 最大化窗口
        const taskbarHeight = taskbar.offsetHeight;
        window.element.style.left = '0px';
        window.element.style.top = '0px';
        window.element.style.width = `${window.element.parentElement.offsetWidth}px`;
        window.element.style.height = `${window.element.parentElement.offsetHeight - taskbarHeight}px`;
        window.element.classList.add('maximized');
        window.isMaximized = true;
    }
    
    // 更新任务栏项目
    updateTaskbarItem(windowId, { isActive: true, isMinimized: false });
}

// 关闭窗口
function closeWindow(windowId) {
    const windowIndex = windows.findIndex(w => w.id === windowId);
    if (windowIndex === -1) return;
    
    const window = windows[windowIndex];
    
    // 从DOM中移除窗口
    window.element.remove();
    
    // 从窗口列表中移除窗口
    windows.splice(windowIndex, 1);
    
    // 移除任务栏项目
    removeTaskbarItem(windowId);
    
    // 激活下一个窗口
    activateNextWindow(windowId);
}

// 激活窗口
function activateWindow(windowId) {
    // 取消当前活动窗口的激活状态
    if (activeWindow) {
        const activeWindowElement = document.getElementById(activeWindow);
        if (activeWindowElement) {
            activeWindowElement.querySelector('.window-titlebar').classList.remove('active');
        }
        
        // 更新任务栏项目
        updateTaskbarItem(activeWindow, { isActive: false });
    }
    
    // 设置新的活动窗口
    activeWindow = windowId;
    
    const window = windows.find(w => w.id === windowId);
    if (!window) return;
    
    // 如果窗口被最小化，则恢复它
    if (window.isMinimized) {
        window.isMinimized = false;
        window.element.classList.remove('minimized');
    }
    
    // 激活窗口标题栏
    window.element.querySelector('.window-titlebar').classList.add('active');
    
    // 将窗口移到最前面
    window.element.style.zIndex = getNextZIndex();
    
    // 更新任务栏项目
    updateTaskbarItem(windowId, { isActive: true, isMinimized: false });
}

// 激活下一个窗口
function activateNextWindow(currentWindowId) {
    if (windows.length === 0) {
        activeWindow = null;
        return;
    }
    
    const currentIndex = windows.findIndex(w => w.id === currentWindowId);
    let nextIndex = currentIndex + 1;
    
    if (nextIndex >= windows.length) {
        nextIndex = 0;
    }
    
    if (windows.length > 0) {
        activateWindow(windows[nextIndex].id);
    } else {
        activeWindow = null;
    }
}

// 获取下一个Z索引
function getNextZIndex() {
    let maxZIndex = 100;
    
    windows.forEach(window => {
        const zIndex = parseInt(window.element.style.zIndex) || 100;
        if (zIndex > maxZIndex) {
            maxZIndex = zIndex;
        }
    });
    
    return maxZIndex + 1;
}

// 开始拖动窗口
function startDraggingWindow(windowId, clientX, clientY) {
    const window = windows.find(w => w.id === windowId);
    if (!window || window.isMaximized) return;
    
    isDragging = true;
    dragOffsetX = clientX - parseInt(window.element.style.left);
    dragOffsetY = clientY - parseInt(window.element.style.top);
    
    // 激活窗口
    activateWindow(windowId);
    
    // 添加鼠标移动和鼠标释放事件监听器
    document.addEventListener('mousemove', dragWindow);
    document.addEventListener('mouseup', stopDraggingWindow);
}

// 拖动窗口
function dragWindow(e) {
    if (!isDragging || !activeWindow) return;
    
    const window = windows.find(w => w.id === activeWindow);
    if (!window || window.isMaximized) return;
    
    const newX = e.clientX - dragOffsetX;
    const newY = e.clientY - dragOffsetY;
    
    // 限制窗口不超出屏幕边界
    const maxX = window.element.parentElement.offsetWidth - window.element.offsetWidth;
    const maxY = window.element.parentElement.offsetHeight - window.element.offsetHeight;
    
    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));
    
    window.element.style.left = `${clampedX}px`;
    window.element.style.top = `${clampedY}px`;
}

// 停止拖动窗口
function stopDraggingWindow() {
    isDragging = false;
    document.removeEventListener('mousemove', dragWindow);
    document.removeEventListener('mouseup', stopDraggingWindow);
}

// 开始调整窗口大小
function startResizingWindow(windowId, clientX, clientY, edge) {
    const window = windows.find(w => w.id === windowId);
    if (!window || window.isMaximized || window.isMinimized) return;
    
    isResizing = true;
    resizeEdge = edge;
    dragOffsetX = clientX - parseInt(window.element.style.width);
    dragOffsetY = clientY - parseInt(window.element.style.height);
    
    // 激活窗口
    activateWindow(windowId);
    
    // 添加鼠标移动和鼠标释放事件监听器
    document.addEventListener('mousemove', resizeWindow);
    document.addEventListener('mouseup', stopResizingWindow);
}

// 调整窗口大小
function resizeWindow(e) {
    if (!isResizing || !activeWindow) return;
    
    const window = windows.find(w => w.id === activeWindow);
    if (!window || window.isMaximized || window.isMinimized) return;
    
    let newWidth = parseInt(window.element.style.width);
    let newHeight = parseInt(window.element.style.height);
    let newLeft = parseInt(window.element.style.left);
    let newTop = parseInt(window.element.style.top);
    
    switch (resizeEdge) {
        case 'nw':
            newWidth = window.element.parentElement.offsetWidth - (e.clientX - window.element.parentElement.getBoundingClientRect().left);
            newHeight = window.element.parentElement.offsetHeight - (e.clientY - window.element.parentElement.getBoundingClientRect().top);
            newLeft = e.clientX - window.element.parentElement.getBoundingClientRect().left;
            newTop = e.clientY - window.element.parentElement.getBoundingClientRect().top;
            break;
        case 'n':
            newHeight = window.element.parentElement.offsetHeight - (e.clientY - window.element.parentElement.getBoundingClientRect().top);
            newTop = e.clientY - window.element.parentElement.getBoundingClientRect().top;
            break;
        case 'ne':
            newWidth = e.clientX - window.element.parentElement.getBoundingClientRect().left - newLeft;
            newHeight = window.element.parentElement.offsetHeight - (e.clientY - window.element.parentElement.getBoundingClientRect().top);
            newTop = e.clientY - window.element.parentElement.getBoundingClientRect().top;
            break;
        case 'e':
            newWidth = e.clientX - window.element.parentElement.getBoundingClientRect().left - newLeft;
            break;
        case 'se':
            newWidth = e.clientX - window.element.parentElement.getBoundingClientRect().left - newLeft;
            newHeight = e.clientY - window.element.parentElement.getBoundingClientRect().top - newTop;
            break;
        case 's':
            newHeight = e.clientY - window.element.parentElement.getBoundingClientRect().top - newTop;
            break;
        case 'sw':
            newWidth = window.element.parentElement.offsetWidth - (e.clientX - window.element.parentElement.getBoundingClientRect().left);
            newHeight = e.clientY - window.element.parentElement.getBoundingClientRect().top - newTop;
            newLeft = e.clientX - window.element.parentElement.getBoundingClientRect().left;
            break;
        case 'w':
            newWidth = window.element.parentElement.offsetWidth - (e.clientX - window.element.parentElement.getBoundingClientRect().left);
            newLeft = e.clientX - window.element.parentElement.getBoundingClientRect().left;
            break;
    }
    
    // 限制窗口最小大小
    const minWidth = 200;
    const minHeight = 150;
    
    if (newWidth < minWidth) {
        newWidth = minWidth;
        
        if (['nw', 'sw', 'w'].includes(resizeEdge)) {
            newLeft = parseInt(window.element.style.left) + parseInt(window.element.style.width) - minWidth;
        }
    }
    
    if (newHeight < minHeight) {
        newHeight = minHeight;
        
        if (['nw', 'n', 'ne'].includes(resizeEdge)) {
            newTop = parseInt(window.element.style.top) + parseInt(window.element.style.height) - minHeight;
        }
    }
    
    // 限制窗口不超出屏幕边界
    const maxX = window.element.parentElement.offsetWidth - newWidth;
    const maxY = window.element.parentElement.offsetHeight - newHeight;
    
    newLeft = Math.max(0, Math.min(newLeft, maxX));
    newTop = Math.max(0, Math.min(newTop, maxY));
    
    window.element.style.width = `${newWidth}px`;
    window.element.style.height = `${newHeight}px`;
    window.element.style.left = `${newLeft}px`;
    window.element.style.top = `${newTop}px`;
}

// 停止调整窗口大小
function stopResizingWindow() {
    isResizing = false;
    document.removeEventListener('mousemove', resizeWindow);
    document.removeEventListener('mouseup', stopResizingWindow);
}

// 添加任务栏项目
function addTaskbarItem(windowId, title, type) {
    const taskbarItem = document.createElement('div');
    taskbarItem.id = `taskbar-item-${windowId}`;
    taskbarItem.className = 'taskbar-item';
    taskbarItem.dataset.windowId = windowId;
    
    // 获取图标
    let iconSrc = '';
    switch (type) {
        case 'my-documents':
            iconSrc = 'https://p11-doubao-search-sign.byteimg.com/labis/9520e59841677e31920b930edc891ff4~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778570607&x-signature=cY8PZFxIu7q2HLmKaOs54ZXvRgo%3D';
            break;
        case 'my-computer':
            iconSrc = 'https://p26-doubao-search-sign.byteimg.com/labis/image/04db6b6259843bff47e1547dc8416ab1~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778570608&x-signature=Xb%2FazdmXrX6t7sGJfs1JkYSQ9o8%3D';
            break;
        case 'recycle-bin':
            iconSrc = 'https://p11-doubao-search-sign.byteimg.com/tos-cn-i-be4g95zd3a/1000820185792774288~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778570608&x-signature=F8xGfuNEtxzKjbXW%2FDwC4yZ0vMs%3D';
            break;
        case 'network-neighborhood':
            iconSrc = 'https://p3-doubao-search-sign.byteimg.com/labis/f48071fee73dea097e7cdf1ef2716583~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778570608&x-signature=XJEDdNuDrbCVqI8SCRFVt81fKew%3D';
            break;
        case 'text-document':
            iconSrc = 'https://p11-doubao-search-sign.byteimg.com/labis/f3e5bd87d9575e10f278dbf80272e5bc~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778570607&x-signature=UK3AV0oDb80N1H0k3sYgHKP3HOA%3D';
            break;
        default:
            iconSrc = 'https://p26-doubao-search-sign.byteimg.com/labis/image/04db6b6259843bff47e1547dc8416ab1~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778570608&x-signature=Xb%2FazdmXrX6t7sGJfs1JkYSQ9o8%3D';
    }
    
    taskbarItem.innerHTML = `
        <img src="${iconSrc}" alt="${title}">
        <span>${title}</span>
    `;
    
    // 添加点击事件监听器
    taskbarItem.addEventListener('click', () => {
        const windowId = taskbarItem.dataset.windowId;
        const window = windows.find(w => w.id === windowId);
        
        if (window && window.isMinimized) {
            // 如果窗口被最小化，则恢复它
            window.isMinimized = false;
            window.element.classList.remove('minimized');
            activateWindow(windowId);
        } else if (window && !window.isMinimized && activeWindow === windowId) {
            // 如果窗口是活动的且没有被最小化，则最小化它
            minimizeWindow(windowId);
        } else if (window && !window.isMinimized) {
            // 如果窗口没有被最小化但不是活动的，则激活它
            activateWindow(windowId);
        }
    });
    
    // 添加右键点击事件监听器
    taskbarItem.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const windowId = taskbarItem.dataset.windowId;
        showTaskbarItemContextMenu(e, windowId);
    });
    
    taskbarItems.appendChild(taskbarItem);
    
    // 更新任务栏项目状态
    updateTaskbarItem(windowId, { isActive: activeWindow === windowId, isMinimized: false });
}

// 更新任务栏项目
function updateTaskbarItem(windowId, { isActive, isMinimized }) {
    const taskbarItem = document.getElementById(`taskbar-item-${windowId}`);
    if (!taskbarItem) return;
    
    if (isActive) {
        taskbarItem.classList.add('active');
    } else {
        taskbarItem.classList.remove('active');
    }
}

// 移除任务栏项目
function removeTaskbarItem(windowId) {
    const taskbarItem = document.getElementById(`taskbar-item-${windowId}`);
    if (taskbarItem) {
        taskbarItem.remove();
    }
}

// 切换开始菜单
function toggleStartMenu() {
    if (startMenu.classList.contains('hidden')) {
        openStartMenu();
    } else {
        closeStartMenu();
    }
}

// 打开开始菜单
function openStartMenu() {
    startMenu.classList.remove('hidden');
    startMenu.classList.add('slide-up');
}

// 关闭开始菜单
function closeStartMenu() {
    startMenu.classList.add('hidden');
    startMenu.classList.remove('slide-up');
}

// 处理开始菜单操作
function handleStartMenuAction(action) {
    switch (action) {
        case 'programs':
            alert('程序菜单已打开');
            break;
        case 'documents':
            openMyDocumentsWindow();
            break;
        case 'settings':
            alert('设置菜单已打开');
            break;
        case 'search':
            alert('搜索功能已打开');
            break;
        case 'help':
            alert('帮助和支持已打开');
            break;
        case 'run':
            const command = prompt('请输入要运行的程序名称:');
            if (command) {
                alert(`正在运行: ${command}`);
            }
            break;
        case 'shutdown':
            openShutdownDialog();
            break;
    }
}

// 打开关闭计算机对话框
function openShutdownDialog() {
    shutdownDialog.classList.remove('hidden');
    shutdownOptions[0].classList.add('selected');
}

// 处理关闭计算机操作
function handleShutdownAction() {
    const selectedOption = document.querySelector('.shutdown-option.selected');
    if (!selectedOption) return;
    
    const action = selectedOption.dataset.action;
    
    switch (action) {
        case 'shutdown':
            alert('正在关闭计算机...');
            break;
        case 'restart':
            alert('正在重新启动计算机...');
            break;
        case 'standby':
            alert('计算机已进入待机模式');
            break;
    }
    
    shutdownDialog.classList.add('hidden');
}

// 显示桌面右键菜单
function showDesktopContextMenu(e) {
    closeContextMenu();
    
    contextMenu.innerHTML = `
        <div class="context-menu-item" data-action="view-large-icons">查看 → 大图标</div>
        <div class="context-menu-item" data-action="view-small-icons">查看 → 小图标</div>
        <div class="context-menu-item" data-action="view-list">查看 → 列表</div>
        <div class="context-menu-item" data-action="view-details">查看 → 详细信息</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="sort-by-name">排序方式 → 名称</div>
        <div class="context-menu-item" data-action="sort-by-size">排序方式 → 大小</div>
        <div class="context-menu-item" data-action="sort-by-type">排序方式 → 类型</div>
        <div class="context-menu-item" data-action="sort-by-date">排序方式 → 修改日期</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="new-folder">新建 → 文件夹</div>
        <div class="context-menu-item" data-action="new-document">新建 → 文本文档</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="paste">粘贴</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="refresh">刷新</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="properties">属性</div>
    `;
    
    // 添加右键菜单项点击事件监听器
    document.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleContextMenuAction(action);
            closeContextMenu();
        });
    });
    
    currentContextElement = desktop;
    isContextMenuOpen = true;
    
    positionContextMenu(e);
    contextMenu.classList.remove('hidden');
}

// 显示图标右键菜单
function showIconContextMenu(e, iconType, iconElement) {
    closeContextMenu();
    
    // 选中图标
    selectIcon(iconElement);
    
    contextMenu.innerHTML = `
        <div class="context-menu-item" data-action="open">打开</div>
        <div class="context-menu-item" data-action="open-with">打开方式</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="cut">剪切</div>
        <div class="context-menu-item" data-action="copy">复制</div>
        <div class="context-menu-item" data-action="create-shortcut">创建快捷方式</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="delete">删除</div>
        <div class="context-menu-item" data-action="rename">重命名</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="properties">属性</div>
    `;
    
    // 添加右键菜单项点击事件监听器
    document.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleContextMenuAction(action, iconType, iconElement);
            closeContextMenu();
        });
    });
    
    currentContextElement = iconElement;
    isContextMenuOpen = true;
    
    positionContextMenu(e);
    contextMenu.classList.remove('hidden');
}

// 显示窗口右键菜单
function showWindowContextMenu(e, windowId) {
    closeContextMenu();
    
    contextMenu.innerHTML = `
        <div class="context-menu-item" data-action="restore">还原</div>
        <div class="context-menu-item" data-action="move">移动</div>
        <div class="context-menu-item" data-action="size">大小</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="minimize">最小化</div>
        <div class="context-menu-item" data-action="maximize">最大化</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="close">关闭</div>
    `;
    
    // 添加右键菜单项点击事件监听器
    document.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleWindowContextMenuAction(windowId, action);
            closeContextMenu();
        });
    });
    
    currentContextElement = document.getElementById(windowId);
    isContextMenuOpen = true;
    
    positionContextMenu(e);
    contextMenu.classList.remove('hidden');
}

// 显示任务栏项目右键菜单
function showTaskbarItemContextMenu(e, windowId) {
    closeContextMenu();
    
    contextMenu.innerHTML = `
        <div class="context-menu-item" data-action="restore">还原</div>
        <div class="context-menu-item" data-action="minimize">最小化</div>
        <div class="context-menu-item" data-action="maximize">最大化</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="close">关闭</div>
    `;
    
    // 添加右键菜单项点击事件监听器
    document.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleWindowContextMenuAction(windowId, action);
            closeContextMenu();
        });
    });
    
    currentContextElement = document.getElementById(`taskbar-item-${windowId}`);
    isContextMenuOpen = true;
    
    positionContextMenu(e);
    contextMenu.classList.remove('hidden');
}

// 定位右键菜单
function positionContextMenu(e) {
    const x = e.clientX;
    const y = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;
    
    // 检查菜单是否会超出屏幕右侧
    if (x + menuWidth > windowWidth) {
        contextMenu.style.left = `${x - menuWidth}px`;
    } else {
        contextMenu.style.left = `${x}px`;
    }
    
    // 检查菜单是否会超出屏幕底部
    if (y + menuHeight > windowHeight) {
        contextMenu.style.top = `${y - menuHeight}px`;
    } else {
        contextMenu.style.top = `${y}px`;
    }
}

// 关闭右键菜单
function closeContextMenu() {
    if (isContextMenuOpen) {
        contextMenu.classList.add('hidden');
        isContextMenuOpen = false;
        currentContextElement = null;
    }
}

// 处理右键菜单操作
function handleContextMenuAction(action, iconType = null, iconElement = null) {
    switch (action) {
        case 'open':
            if (iconType) {
                openWindowFromIcon(iconType);
            }
            break;
        case 'explore':
            alert('资源管理器已打开');
            break;
        case 'cut':
            if (iconElement) {
                clipboard = {
                    type: 'cut',
                    data: iconElement
                };
                iconElement.classList.add('cut');
            }
            break;
        case 'copy':
            if (iconElement) {
                clipboard = {
                    type: 'copy',
                    data: iconElement
                };
            }
            break;
        case 'paste':
            if (clipboard && currentContextElement === desktop) {
                const newIcon = clipboard.data.cloneNode(true);
                newIcon.style.left = `${parseInt(clipboard.data.style.left) + 20}px`;
                newIcon.style.top = `${parseInt(clipboard.data.style.top) + 20}px`;
                
                // 添加双击事件
                newIcon.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    const iconType = newIcon.dataset.type;
                    openWindowFromIcon(iconType);
                });
                
                // 添加右键点击事件
                newIcon.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    const iconType = newIcon.dataset.type;
                    showIconContextMenu(e, iconType, newIcon);
                });
                
                desktop.appendChild(newIcon);
                
                // 添加到桌面图标列表
                desktopIcons.push({
                    element: newIcon,
                    type: newIcon.dataset.type,
                    x: parseInt(newIcon.style.left),
                    y: parseInt(newIcon.style.top),
                    name: newIcon.querySelector('span').textContent
                });
                
                // 如果是剪切操作，移除原图标
                if (clipboard.type === 'cut') {
                    clipboard.data.remove();
                    clipboard = null;
                }
            }
            break;
        case 'delete':
            if (iconElement) {
                iconElement.remove();
                
                // 从桌面图标列表中移除
                const iconIndex = desktopIcons.findIndex(icon => icon.element === iconElement);
                if (iconIndex !== -1) {
                    desktopIcons.splice(iconIndex, 1);
                }
            }
            break;
        case 'rename':
            if (iconElement) {
                const span = iconElement.querySelector('span');
                const currentName = span.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentName;
                input.className = 'rename-input';
                
                // 替换span为input
                iconElement.replaceChild(input, span);
                
                // 选中输入框内容
                input.select();
                
                // 添加事件监听器
                input.addEventListener('blur', () => {
                    const newName = input.value.trim() || currentName;
                    const newSpan = document.createElement('span');
                    newSpan.textContent = newName;
                    iconElement.replaceChild(newSpan, input);
                    
                    // 更新桌面图标列表
                    const iconIndex = desktopIcons.findIndex(icon => icon.element === iconElement);
                    if (iconIndex !== -1) {
                        desktopIcons[iconIndex].name = newName;
                    }
                });
                
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        input.blur();
                    } else if (e.key === 'Escape') {
                        iconElement.replaceChild(span, input);
                    }
                });
            }
            break;
        case 'properties':
            alert('属性窗口已打开');
            break;
        case 'refresh':
            // 刷新桌面
            desktop.classList.add('fade-in');
            setTimeout(() => {
                desktop.classList.remove('fade-in');
            }, 200);
            break;
        case 'new-folder':
            createNewDesktopIcon('folder', '新建文件夹');
            break;
        case 'new-document':
            createNewDesktopIcon('text-document', '新建文本文档.txt');
            break;
    }
}

// 处理窗口右键菜单操作
function handleWindowContextMenuAction(windowId, action) {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;
    
    switch (action) {
        case 'restore':
            if (window.isMaximized) {
                maximizeWindow(windowId);
            } else if (window.isMinimized) {
                window.isMinimized = false;
                window.element.classList.remove('minimized');
                activateWindow(windowId);
            }
            break;
        case 'minimize':
            minimizeWindow(windowId);
            break;
        case 'maximize':
            maximizeWindow(windowId);
            break;
        case 'close':
            closeWindow(windowId);
            break;
        case 'move':
            // 开始拖动窗口
            const rect = window.element.getBoundingClientRect();
            startDraggingWindow(windowId, rect.left + 10, rect.top + 10);
            break;
        case 'size':
            // 开始调整窗口大小
            const rect2 = window.element.getBoundingClientRect();
            startResizingWindow(windowId, rect2.right - 10, rect2.bottom - 10, 'se');
            break;
    }
}

// 创建新的桌面图标
function createNewDesktopIcon(type, name) {
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.dataset.type = type;
    
    let iconSrc = '';
    switch (type) {
        case 'folder':
            iconSrc = 'https://p11-doubao-search-sign.byteimg.com/labis/9520e59841677e31920b930edc891ff4~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778570607&x-signature=cY8PZFxIu7q2HLmKaOs54ZXvRgo%3D';
            break;
        case 'text-document':
            iconSrc = 'https://p11-doubao-search-sign.byteimg.com/labis/f3e5bd87d9575e10f278dbf80272e5bc~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778570607&x-signature=UK3AV0oDb80N1H0k3sYgHKP3HOA%3D';
            break;
        default:
            iconSrc = 'https://p26-doubao-search-sign.byteimg.com/labis/image/04db6b6259843bff47e1547dc8416ab1~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1778570608&x-signature=Xb%2FazdmXrX6t7sGJfs1JkYSQ9o8%3D';
    }
    
    icon.innerHTML = `
        <img src="${iconSrc}" alt="${name}">
        <span>${name}</span>
    `;
    
    // 设置图标位置
    const x = 20;
    const y = 20 + desktopIcons.length * 90;
    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;
    
    // 添加事件监听器
    icon.addEventListener('dblclick', (e) => {
        e.preventDefault();
        openWindowFromIcon(type);
    });
    
    icon.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showIconContextMenu(e, type, icon);
    });
    
    // 添加到桌面
    desktop.appendChild(icon);
    
    // 添加到桌面图标列表
    desktopIcons.push({
        element: icon,
        type,
        x,
        y,
        name
    });
    
    // 自动进入重命名模式
    const span = icon.querySelector('span');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = name;
    input.className = 'rename-input';
    
    // 替换span为input
    icon.replaceChild(input, span);
    
    // 选中输入框内容
    input.select();
    
    // 添加事件监听器
    input.addEventListener('blur', () => {
        const newName = input.value.trim() || name;
        const newSpan = document.createElement('span');
        newSpan.textContent = newName;
        icon.replaceChild(newSpan, input);
        
        // 更新桌面图标列表
        const iconIndex = desktopIcons.findIndex(icon => icon.element === icon);
        if (iconIndex !== -1) {
            desktopIcons[iconIndex].name = newName;
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            icon.replaceChild(span, input);
        }
    });
}

// 处理文件项点击
function handleFileItemClick(windowId, itemType, itemName) {
    switch (itemType) {
        case 'folder':
            alert(`打开文件夹: ${itemName}`);
            break;
        case 'document':
            openTextDocumentWindow(itemName);
            break;
        case 'drive':
            alert(`打开驱动器: ${itemName}`);
            break;
        case 'network':
            alert(`打开网络位置: ${itemName}`);
            break;
    }
}

// 选中图标
function selectIcon(iconElement) {
    deselectAllIcons();
    iconElement.classList.add('selected');
    selectedIcon = iconElement;
}

// 取消选中所有图标
function deselectAllIcons() {
    if (selectedIcon) {
        selectedIcon.classList.remove('selected');
        selectedIcon = null;
    }
}

// 处理键盘事件
function handleKeyDown(e) {
    // Alt + Tab 切换窗口
    if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        activateNextWindow(activeWindow);
    }
    
    // Ctrl + C 复制
    if (e.ctrlKey && e.key === 'c' && selectedIcon) {
        clipboard = {
            type: 'copy',
            data: selectedIcon
        };
    }
    
    // Ctrl + X 剪切
    if (e.ctrlKey && e.key === 'x' && selectedIcon) {
        clipboard = {
            type: 'cut',
            data: selectedIcon
        };
        selectedIcon.classList.add('cut');
    }
    
    // Ctrl + V 粘贴
    if (e.ctrlKey && e.key === 'v' && clipboard) {
        if (currentContextElement === desktop || !currentContextElement) {
            const newIcon = clipboard.data.cloneNode(true);
            newIcon.style.left = `${parseInt(clipboard.data.style.left) + 20}px`;
            newIcon.style.top = `${parseInt(clipboard.data.style.top) + 20}px`;
            
            // 添加双击事件
            newIcon.addEventListener('dblclick', (e) => {
                e.preventDefault();
                const iconType = newIcon.dataset.type;
                openWindowFromIcon(iconType);
            });
            
            // 添加右键点击事件
            newIcon.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const iconType = newIcon.dataset.type;
                showIconContextMenu(e, iconType, newIcon);
            });
            
            desktop.appendChild(newIcon);
            
            // 添加到桌面图标列表
            desktopIcons.push({
                element: newIcon,
                type: newIcon.dataset.type,
                x: parseInt(newIcon.style.left),
                y: parseInt(newIcon.style.top),
                name: newIcon.querySelector('span').textContent
            });
            
            // 如果是剪切操作，移除原图标
            if (clipboard.type === 'cut') {
                clipboard.data.remove();
                clipboard = null;
            }
        }
    }
    
    // Delete 删除
    if (e.key === 'Delete' && selectedIcon) {
        selectedIcon.remove();
        
        // 从桌面图标列表中移除
        const iconIndex = desktopIcons.findIndex(icon => icon.element === selectedIcon);
        if (iconIndex !== -1) {
            desktopIcons.splice(iconIndex, 1);
        }
        
        selectedIcon = null;
    }
    
    // F2 重命名
    if (e.key === 'F2' && selectedIcon) {
        const span = selectedIcon.querySelector('span');
        const currentName = span.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'rename-input';
        
        // 替换span为input
        selectedIcon.replaceChild(input, span);
        
        // 选中输入框内容
        input.select();
        
        // 添加事件监听器
        input.addEventListener('blur', () => {
            const newName = input.value.trim() || currentName;
            const newSpan = document.createElement('span');
            newSpan.textContent = newName;
            selectedIcon.replaceChild(newSpan, input);
            
            // 更新桌面图标列表
            const iconIndex = desktopIcons.findIndex(icon => icon.element === selectedIcon);
            if (iconIndex !== -1) {
                desktopIcons[iconIndex].name = newName;
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            } else if (e.key === 'Escape') {
                selectedIcon.replaceChild(span, input);
            }
        });
    }
    
    // Esc 关闭菜单
    if (e.key === 'Escape') {
        closeStartMenu();
        closeContextMenu();
        deselectAllIcons();
    }
}

// 从本地存储加载文档内容
function loadDocumentsFromLocalStorage() {
    // 检查是否有保存的文档
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('document_')) {
            const filename = key.replace('document_', '');
            console.log(`Found saved document: ${filename}`);
        }
    }
}
