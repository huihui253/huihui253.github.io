# 元玩游戏平台

元玩是一个集合了多个模拟游戏的平台，包含各种有趣的模拟体验。

## 游戏列表

### 1. 极光模拟器
- **描述**：体验极光OS系统的模拟器
- **路径**：`jg模拟器/极光os.html`

### 2. Root模拟器
- **描述**：模拟Root权限操作
- **路径**：`root/root-simulator.html`

### 3. 接单
- **描述**：模拟接单流程
- **路径**：`root/接单.html`

### 4. 修手机
- **描述**：模拟手机维修过程
- **路径**：`修手机/index.html`

### 5. 抽车
- **描述**：模拟抽车游戏
- **路径**：`抽车/index.html`

### 6. 炒股
- **描述**：模拟股票交易
- **路径**：`炒股/stock-trading-app.html`

### 7. 系统模拟器
- **描述**：模拟各种操作系统
- **路径**：`系统模拟器/启动器.html`

### 8. 酒店
- **描述**：模拟酒店经营
- **路径**：`酒店/酒店.html`

## 如何使用

1. **本地访问**：
   - 直接打开 `index.html` 文件即可在浏览器中访问平台
   - 或使用本地服务器运行：`python -m http.server 8000`，然后访问 `http://localhost:8000`

2. **在线访问**：
   - 可上传到GitHub进行静态托管（详见下方教程）

## 上传到GitHub进行静态托管

### 步骤1：创建GitHub仓库
1. 登录GitHub账号
2. 点击右上角的"+"按钮，选择"New repository"
3. 填写仓库名称（例如"yuanwan-games"）
4. 选择"Public"或"Private"
5. 勾选"Add a README file"
6. 点击"Create repository"

### 步骤2：上传文件
1. 进入创建的仓库
2. 点击"Add file"按钮，选择"Upload files"
3. 拖拽或选择以下文件和文件夹：
   - `index.html`
   - `jg模拟器/`
   - `root/`
   - `修手机/`
   - `抽车/`
   - `炒股/`
   - `系统模拟器/`
   - `酒店/`
4. 填写提交信息，点击"Commit changes"

### 步骤3：启用GitHub Pages
1. 在仓库的"Settings"页面，找到"Pages"选项
2. 在"Source"下拉菜单中选择"main"分支
3. 点击"Save"
4. 稍等几分钟，GitHub会生成一个访问链接

### 步骤4：访问平台
- GitHub Pages生成完成后，会显示一个访问链接（例如：https://yourusername.github.io/yuanwan-games）
- 通过这个链接就可以访问你的元玩游戏平台了

## 技术说明

- **平台架构**：单文件HTML结构，包含内联CSS和JavaScript
- **游戏打开方式**：使用模态框方式打开游戏，提供更好的用户体验
- **响应式设计**：适配不同屏幕尺寸，在手机和电脑上都能正常显示
- **作者信息**：显示作者信息和B站链接

## 作者信息

- **作者**：爱写代码的辉辉
- **B站主页**：[https://space.bilibili.com/3546650603686772?spm_id_from=333.337.0.0](https://space.bilibili.com/3546650603686772?spm_id_from=333.337.0.0)

## 版权信息

© 2026 元玩游戏平台 - 所有游戏均为模拟体验