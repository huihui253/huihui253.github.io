// 游戏状态
let gameState = {
    gold: 10000,
    premium: 100,
    normalTickets: 10,
    premiumTickets: 5,
    dreamTickets: 3,
    garage: [],
    lastSave: Date.now(),
    afkMode: false
};

// 挂机模式状态
let afkState = {
    running: false,
    intervalId: null,
    logs: []
};

// 配置
const CONFIG = {
    rarities: {
        Common: { name: '普通', color: '#888' },
        Rare: { name: '稀有', color: '#4169E1' },
        Epic: { name: '史诗', color: '#9370DB' },
        Legendary: { name: '传奇', color: '#FF8C00' },
        Ultra: { name: '终极', color: '#FF4500' }
    },
    groups: {
        extreme: { name: '极限组', color: '#FF4500', icon: '🔥' },
        sport: { name: '运动组', color: '#4169E1', icon: '⚡' },
        performance: { name: '性能组', color: '#9370DB', icon: '🚀' }
    },
    tags: {
        limited: { name: '限定', color: '#FF4500', icon: '🔥' },
        collection: { name: '珍藏', color: '#FFD700', icon: '👑' },
        classic: { name: '典藏', color: '#DAA520', icon: '🏛️' }
    },
    gacha: {
        normal: {
            Common: 0.85,
            Rare: 0.15
        },
        premium: {
            Common: 0.7,
            Rare: 0.2,
            Epic: 0.08,
            Legendary: 0.02
        },
        dream: {
            Rare: 0.5,
            Epic: 0.3,
            Legendary: 0.15,
            Ultra: 0.05
        }
    },
    shopItems: [
        {
            id: 'normal_ticket_1',
            name: '普通抽卡券',
            type: 'normal_ticket',
            count: 1,
            price: { gold: 1000 },
            icon: '🎫'
        },
        {
            id: 'normal_ticket_10',
            name: '普通抽卡券',
            type: 'normal_ticket',
            count: 10,
            price: { gold: 9000 },
            icon: '🎫'
        },
        {
            id: 'premium_ticket_1',
            name: '高级抽卡券',
            type: 'premium_ticket',
            count: 1,
            price: { premium: 1 },
            icon: '🎟️'
        },
        {
            id: 'premium_ticket_10',
            name: '高级抽卡券',
            type: 'premium_ticket',
            count: 10,
            price: { premium: 9 },
            icon: '🎟️'
        },
        {
            id: 'dream_ticket_1',
            name: '梦想车展券',
            type: 'dream_ticket',
            count: 1,
            price: { premium: 5 },
            icon: '⭐'
        },
        {
            id: 'dream_ticket_10',
            name: '梦想车展券',
            type: 'dream_ticket',
            count: 10,
            price: { premium: 45 },
            icon: '⭐'
        }
    ]
};

// 车辆数据库
const CAR_DATABASE = [
    // 布加迪
    { brand: '布加迪', model: 'Chiron', year: 2020, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection'], baseStats: { speed: 100, acceleration: 95, handling: 85, durability: 80 } },
    { brand: '布加迪', model: 'Veyron', year: 2015, rarity: 'Legendary', group: 'extreme', tags: ['collection'], baseStats: { speed: 95, acceleration: 90, handling: 80, durability: 75 } },
    { brand: '布加迪', model: '黑夜之声', year: 2023, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection', 'classic'], baseStats: { speed: 105, acceleration: 100, handling: 90, durability: 85 } },
    { brand: '布加迪', model: 'Divo', year: 2021, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection'], baseStats: { speed: 98, acceleration: 96, handling: 88, durability: 78 } },
    { brand: '布加迪', model: 'Veyron Super Sport', year: 2013, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection', 'classic'], baseStats: { speed: 97, acceleration: 93, handling: 82, durability: 76 } },
    
    // 法拉利
    { brand: '法拉利', model: '488 GTB', year: 2021, rarity: 'Legendary', group: 'sport', tags: ['collection'], baseStats: { speed: 90, acceleration: 95, handling: 90, durability: 70 } },
    { brand: '法拉利', model: 'SF90 Stradale', year: 2022, rarity: 'Epic', group: 'sport', baseStats: { speed: 92, acceleration: 98, handling: 88, durability: 72 } },
    { brand: '法拉利', model: 'LaFerrari', year: 2015, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection', 'classic'], baseStats: { speed: 97, acceleration: 99, handling: 92, durability: 75 } },
    { brand: '法拉利', model: 'F8 Tributo', year: 2020, rarity: 'Epic', group: 'sport', tags: ['collection'], baseStats: { speed: 89, acceleration: 94, handling: 89, durability: 71 } },
    { brand: '法拉利', model: 'FXXK', year: 2023, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection'], baseStats: { speed: 99, acceleration: 100, handling: 91, durability: 74 } },
    { brand: '法拉利', model: '458 Italia', year: 2015, rarity: 'Epic', group: 'sport', tags: ['collection'], baseStats: { speed: 88, acceleration: 92, handling: 87, durability: 73 } },
    { brand: '法拉利', model: 'Portofino', year: 2021, rarity: 'Rare', group: 'sport', baseStats: { speed: 85, acceleration: 89, handling: 85, durability: 76 } },
    
    // 兰博基尼
    { brand: '兰博基尼', model: 'Aventador SVJ', year: 2021, rarity: 'Legendary', group: 'extreme', tags: ['limited'], baseStats: { speed: 94, acceleration: 96, handling: 85, durability: 68 } },
    { brand: '兰博基尼', model: 'Huracán Evo', year: 2020, rarity: 'Epic', group: 'sport', baseStats: { speed: 88, acceleration: 92, handling: 86, durability: 70 } },
    { brand: '兰博基尼', model: 'Countach LPI 800-4', year: 2022, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'classic'], baseStats: { speed: 95, acceleration: 97, handling: 87, durability: 72 } },
    { brand: '兰博基尼', model: 'Urus', year: 2021, rarity: 'Epic', group: 'performance', baseStats: { speed: 85, acceleration: 88, handling: 82, durability: 80 } },
    { brand: '兰博基尼', model: 'Gallardo', year: 2013, rarity: 'Epic', group: 'sport', tags: ['collection', 'classic'], baseStats: { speed: 87, acceleration: 90, handling: 85, durability: 72 } },
    
    // 保时捷
    { brand: '保时捷', model: '911 Turbo S', year: 2021, rarity: 'Epic', group: 'sport', baseStats: { speed: 86, acceleration: 90, handling: 92, durability: 75 } },
    { brand: '保时捷', model: '718 Cayman GT4', year: 2020, rarity: 'Rare', group: 'sport', baseStats: { speed: 80, acceleration: 85, handling: 90, durability: 78 } },
    { brand: '保时捷', model: '918 Spyder', year: 2015, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection', 'classic'], baseStats: { speed: 96, acceleration: 98, handling: 93, durability: 74 } },
    { brand: '保时捷', model: 'Taycan Turbo S', year: 2021, rarity: 'Epic', group: 'sport', baseStats: { speed: 87, acceleration: 95, handling: 88, durability: 76 } },
    { brand: '保时捷', model: 'Panamera Turbo S', year: 2021, rarity: 'Epic', group: 'performance', baseStats: { speed: 84, acceleration: 88, handling: 83, durability: 79 } },
    { brand: '保时捷', model: 'Macan GTS', year: 2021, rarity: 'Rare', group: 'performance', baseStats: { speed: 81, acceleration: 85, handling: 82, durability: 81 } },
    
    // 奔驰
    { brand: '奔驰', model: 'AMG GT R', year: 2020, rarity: 'Rare', group: 'performance', baseStats: { speed: 82, acceleration: 87, handling: 84, durability: 80 } },
    { brand: '奔驰', model: 'S-Class', year: 2021, rarity: 'Common', group: 'performance', baseStats: { speed: 75, acceleration: 78, handling: 75, durability: 85 } },
    { brand: '奔驰', model: 'AMG One', year: 2023, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection'], baseStats: { speed: 99, acceleration: 100, handling: 91, durability: 73 } },
    { brand: '奔驰', model: 'AMG C63 S', year: 2021, rarity: 'Rare', group: 'sport', baseStats: { speed: 81, acceleration: 86, handling: 83, durability: 79 } },
    { brand: '奔驰', model: 'E-Class', year: 2021, rarity: 'Common', group: 'performance', baseStats: { speed: 74, acceleration: 77, handling: 76, durability: 84 } },
    { brand: '奔驰', model: 'G-Class', year: 2021, rarity: 'Rare', group: 'performance', baseStats: { speed: 78, acceleration: 75, handling: 70, durability: 88 } },
    
    // 宝马
    { brand: '宝马', model: 'M8 Competition', year: 2021, rarity: 'Rare', group: 'performance', baseStats: { speed: 83, acceleration: 88, handling: 85, durability: 79 } },
    { brand: '宝马', model: '3 Series', year: 2020, rarity: 'Common', group: 'performance', baseStats: { speed: 73, acceleration: 76, handling: 78, durability: 82 } },
    { brand: '宝马', model: 'M5 CS', year: 2021, rarity: 'Epic', group: 'sport', tags: ['collection'], baseStats: { speed: 85, acceleration: 90, handling: 86, durability: 77 } },
    { brand: '宝马', model: 'i8', year: 2020, rarity: 'Epic', group: 'sport', baseStats: { speed: 84, acceleration: 89, handling: 87, durability: 75 } },
    { brand: '宝马', model: '5 Series', year: 2021, rarity: 'Common', group: 'performance', baseStats: { speed: 74, acceleration: 77, handling: 77, durability: 83 } },
    { brand: '宝马', model: 'X5 M', year: 2021, rarity: 'Rare', group: 'performance', baseStats: { speed: 80, acceleration: 85, handling: 80, durability: 82 } },
    
    // 奥迪
    { brand: '奥迪', model: 'R8 V10 Plus', year: 2020, rarity: 'Epic', group: 'sport', baseStats: { speed: 87, acceleration: 91, handling: 87, durability: 76 } },
    { brand: '奥迪', model: 'A4', year: 2020, rarity: 'Common', group: 'performance', baseStats: { speed: 72, acceleration: 75, handling: 76, durability: 83 } },
    { brand: '奥迪', model: 'RS7 Sportback', year: 2021, rarity: 'Epic', group: 'performance', tags: ['collection'], baseStats: { speed: 84, acceleration: 89, handling: 84, durability: 78 } },
    { brand: '奥迪', model: 'TT RS', year: 2020, rarity: 'Rare', group: 'sport', baseStats: { speed: 80, acceleration: 87, handling: 88, durability: 77 } },
    { brand: '奥迪', model: 'Q7', year: 2021, rarity: 'Rare', group: 'performance', baseStats: { speed: 79, acceleration: 76, handling: 75, durability: 85 } },
    { brand: '奥迪', model: 'A6', year: 2021, rarity: 'Common', group: 'performance', baseStats: { speed: 73, acceleration: 76, handling: 75, durability: 84 } },
    
    // 劳斯莱斯
    { brand: '劳斯莱斯', model: 'Phantom', year: 2021, rarity: 'Epic', group: 'performance', tags: ['collection'], baseStats: { speed: 78, acceleration: 72, handling: 68, durability: 90 } },
    { brand: '劳斯莱斯', model: 'Ghost', year: 2020, rarity: 'Rare', group: 'performance', baseStats: { speed: 76, acceleration: 70, handling: 65, durability: 88 } },
    { brand: '劳斯莱斯', model: 'Wraith', year: 2021, rarity: 'Epic', group: 'performance', tags: ['collection', 'classic'], baseStats: { speed: 79, acceleration: 73, handling: 69, durability: 89 } },
    { brand: '劳斯莱斯', model: 'Cullinan', year: 2021, rarity: 'Epic', group: 'performance', tags: ['collection'], baseStats: { speed: 77, acceleration: 71, handling: 67, durability: 91 } },
    { brand: '劳斯莱斯', model: 'Phantom Drophead Coupe', year: 2017, rarity: 'Ultra', group: 'performance', tags: ['limited', 'collection', 'classic'], baseStats: { speed: 77, acceleration: 71, handling: 66, durability: 92 } },
    
    // 迈巴赫
    { brand: '迈巴赫', model: 'S 650', year: 2021, rarity: 'Epic', group: 'performance', tags: ['collection'], baseStats: { speed: 79, acceleration: 74, handling: 70, durability: 89 } },
    { brand: '迈巴赫', model: 'G 650 Landaulet', year: 2018, rarity: 'Ultra', group: 'performance', tags: ['limited', 'collection', 'classic'], baseStats: { speed: 78, acceleration: 72, handling: 68, durability: 92 } },
    { brand: '迈巴赫', model: 'GLS 600', year: 2021, rarity: 'Epic', group: 'performance', tags: ['collection'], baseStats: { speed: 76, acceleration: 71, handling: 66, durability: 90 } },
    { brand: '迈巴赫', model: 'S 580', year: 2021, rarity: 'Rare', group: 'performance', baseStats: { speed: 77, acceleration: 73, handling: 69, durability: 88 } },
    
    // 迈凯伦
    { brand: '迈凯伦', model: '720S', year: 2020, rarity: 'Legendary', group: 'extreme', tags: ['limited'], baseStats: { speed: 93, acceleration: 97, handling: 91, durability: 65 } },
    { brand: '迈凯伦', model: '570S', year: 2019, rarity: 'Epic', group: 'sport', baseStats: { speed: 85, acceleration: 93, handling: 89, durability: 68 } },
    { brand: '迈凯伦', model: 'P1', year: 2014, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection', 'classic'], baseStats: { speed: 98, acceleration: 99, handling: 94, durability: 67 } },
    { brand: '迈凯伦', model: 'Senna', year: 2019, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection'], baseStats: { speed: 96, acceleration: 98, handling: 95, durability: 64 } },
    { brand: '迈凯伦', model: 'Artura', year: 2022, rarity: 'Epic', group: 'sport', tags: ['collection'], baseStats: { speed: 88, acceleration: 94, handling: 90, durability: 69 } },
    { brand: '迈凯伦', model: '600LT', year: 2020, rarity: 'Epic', group: 'sport', tags: ['limited'], baseStats: { speed: 90, acceleration: 95, handling: 91, durability: 67 } },
    
    // 阿斯顿·马丁
    { brand: '阿斯顿·马丁', model: 'DB11', year: 2020, rarity: 'Epic', group: 'sport', baseStats: { speed: 84, acceleration: 89, handling: 86, durability: 72 } },
    { brand: '阿斯顿·马丁', model: 'Vantage', year: 2019, rarity: 'Rare', group: 'sport', baseStats: { speed: 81, acceleration: 86, handling: 85, durability: 74 } },
    { brand: '阿斯顿·马丁', model: 'DBS Superleggera', year: 2020, rarity: 'Legendary', group: 'sport', tags: ['collection'], baseStats: { speed: 88, acceleration: 92, handling: 88, durability: 73 } },
    { brand: '阿斯顿·马丁', model: 'Valkyrie', year: 2022, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection'], baseStats: { speed: 100, acceleration: 100, handling: 92, durability: 68 } },
    { brand: '阿斯顿·马丁', model: 'DBX', year: 2021, rarity: 'Rare', group: 'performance', baseStats: { speed: 80, acceleration: 84, handling: 80, durability: 82 } },
    
    // 其他品牌
    { brand: '帕加尼', model: 'Huayra', year: 2020, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection', 'classic'], baseStats: { speed: 97, acceleration: 98, handling: 93, durability: 70 } },
    { brand: '柯尼塞格', model: 'Regera', year: 2020, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection'], baseStats: { speed: 102, acceleration: 100, handling: 91, durability: 69 } },
    { brand: '路特斯', model: 'Evija', year: 2022, rarity: 'Ultra', group: 'extreme', tags: ['limited', 'collection'], baseStats: { speed: 99, acceleration: 100, handling: 94, durability: 66 } },
    { brand: '玛莎拉蒂', model: 'MC20', year: 2021, rarity: 'Epic', group: 'sport', tags: ['collection'], baseStats: { speed: 86, acceleration: 91, handling: 87, durability: 74 } },
    { brand: '玛莎拉蒂', model: 'Levante', year: 2021, rarity: 'Rare', group: 'performance', baseStats: { speed: 81, acceleration: 85, handling: 81, durability: 80 } },
    { brand: '捷豹', model: 'F-Type', year: 2021, rarity: 'Rare', group: 'sport', baseStats: { speed: 82, acceleration: 86, handling: 84, durability: 77 } },
    { brand: '宾利', model: 'Continental GT', year: 2021, rarity: 'Epic', group: 'performance', tags: ['collection'], baseStats: { speed: 83, acceleration: 86, handling: 82, durability: 85 } },
    { brand: '林肯', model: 'Navigator', year: 2021, rarity: 'Rare', group: 'performance', baseStats: { speed: 78, acceleration: 75, handling: 72, durability: 86 } }
];

// 初始化游戏
function initGame() {
    loadGame();
    updateUI();
    renderGarage();
    initShop();
}

// 保存游戏
function saveGame() {
    gameState.lastSave = Date.now();
    localStorage.setItem('carCollectionGame', JSON.stringify(gameState));
}

// 加载游戏
function loadGame() {
    const saved = localStorage.getItem('carCollectionGame');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// 更新UI
function updateUI() {
    document.getElementById('gold-display').textContent = gameState.gold.toLocaleString();
    document.getElementById('premium-display').textContent = gameState.premium.toLocaleString();
    document.getElementById('normal-ticket-display').textContent = gameState.normalTickets.toLocaleString();
    document.getElementById('premium-ticket-display').textContent = gameState.premiumTickets.toLocaleString();
    const dreamTicketDisplay = document.getElementById('dream-ticket-display');
    if (dreamTicketDisplay) {
        dreamTicketDisplay.textContent = (gameState.dreamTickets || 0).toLocaleString();
    }
}

// 显示Toast提示
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// 打开弹窗
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

// 关闭弹窗
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// 开发者模式切换
function toggleDeveloperMode() {
    openDeveloperModal();
}

// 打开抽卡弹窗
function openGachaModal() {
    document.getElementById('gacha-animation').classList.add('hidden');
    document.getElementById('gacha-results').classList.add('hidden');
    selectGachaPool('normal');
    openModal('gacha-modal');
}

// 打开商店弹窗
function openShopModal() {
    openModal('shop-modal');
}

// 打开对战弹窗
function openBattleModal() {
    populateBattleCarSelect();
    openModal('battle-modal');
}

// 打开出售弹窗
function openSellModal() {
    renderSellCars();
    openModal('sell-modal');
}

// 选择抽卡卡池
function selectGachaPool(pool) {
    // 更新按钮状态
    document.querySelectorAll('.gacha-pool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`pool-${pool}`).classList.add('active');
    
    // 更新概率说明
    const ratesDiv = document.getElementById('gacha-rates');
    const rates = CONFIG.gacha[pool];
    let ratesHtml = '<h4 class="text-sm font-bold text-gray-400 mb-2">概率说明</h4><div class="grid grid-cols-2 gap-2 text-sm">';
    for (const [rarity, rate] of Object.entries(rates)) {
        const rarityConfig = CONFIG.rarities[rarity];
        ratesHtml += `<div class="flex justify-between"><span style="color: ${rarityConfig.color}">${rarityConfig.name}</span><span>${(rate * 100).toFixed(1)}%</span></div>`;
    }
    ratesHtml += '</div>';
    ratesDiv.innerHTML = ratesHtml;
    
    // 保存当前卡池
    window.currentGachaPool = pool;
}

// 抽取稀有度
function drawRarity(pool) {
    const rates = CONFIG.gacha[pool];
    const random = Math.random();
    let cumulative = 0;
    for (const [rarity, rate] of Object.entries(rates)) {
        cumulative += rate;
        if (random < cumulative) {
            return rarity;
        }
    }
    return 'Common';
}

// 生成车辆属性
function generateCarStats(baseStats, rarity) {
    const rarityMultiplier = {
        Common: 1,
        Rare: 1.2,
        Epic: 1.5,
        Legendary: 1.8,
        Ultra: 2.2
    }[rarity];
    
    return {
        speed: Math.floor(baseStats.speed * rarityMultiplier * (0.9 + Math.random() * 0.2)),
        acceleration: Math.floor(baseStats.acceleration * rarityMultiplier * (0.9 + Math.random() * 0.2)),
        handling: Math.floor(baseStats.handling * rarityMultiplier * (0.9 + Math.random() * 0.2)),
        durability: Math.floor(baseStats.durability * rarityMultiplier * (0.9 + Math.random() * 0.2))
    };
}

// 计算总分
function calculateTotalScore(stats) {
    return stats.speed + stats.acceleration + stats.handling + stats.durability;
}

// 生成车辆价格
function generateCarPrice(rarity) {
    const basePrice = {
        Common: 1000,
        Rare: 3000,
        Epic: 8000,
        Legendary: 20000,
        Ultra: 50000
    }[rarity];
    return Math.floor(basePrice * (0.9 + Math.random() * 0.2));
}

// 生成车辆
function generateCar(rarity) {
    const eligibleCars = CAR_DATABASE.filter(car => car.rarity === rarity);
    if (eligibleCars.length === 0) {
        // 如果没有对应稀有度的车辆，返回一个默认车辆
        return {
            id: Date.now() + Math.random(),
            brand: '未知',
            model: '未知',
            year: new Date().getFullYear(),
            rarity: rarity,
            group: 'performance',
            tags: [],
            stats: { speed: 50, acceleration: 50, handling: 50, durability: 50 },
            price: generateCarPrice(rarity),
            acquiredAt: new Date().toISOString()
        };
    }
    
    const template = eligibleCars[Math.floor(Math.random() * eligibleCars.length)];
    const car = {
        id: Date.now() + Math.random(),
        brand: template.brand,
        model: template.model,
        year: template.year,
        rarity: template.rarity,
        group: template.group || 'performance',
        tags: template.tags || [],
        stats: generateCarStats(template.baseStats, template.rarity),
        price: generateCarPrice(template.rarity),
        acquiredAt: new Date().toISOString()
    };
    car.totalScore = calculateTotalScore(car.stats);
    return car;
}

// 执行抽卡
async function doGacha(count) {
    const pool = window.currentGachaPool || 'normal';
    const cost = pool === 'normal' ? 1000 : 1;
    const currency = pool === 'normal' ? 'gold' : 'premium';
    
    // 检查资源
    if (gameState[currency] < cost * count) {
        showToast(`${pool === 'normal' ? '金币' : '高级货币'}不足！`);
        return;
    }
    
    // 扣除资源
    gameState[currency] -= cost * count;
    updateUI();
    saveGame();
    
    // 显示动画
    document.getElementById('gacha-results').classList.add('hidden');
    const animDiv = document.getElementById('gacha-animation');
    animDiv.classList.remove('hidden');
    
    // 禁用按钮
    document.getElementById('btn-single').disabled = true;
    document.getElementById('btn-ten').disabled = true;
    
    // 等待动画
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    animDiv.classList.add('hidden');
    
    // 生成结果
    const results = [];
    for (let i = 0; i < count; i++) {
        const rarity = drawRarity(pool);
        results.push(generateCar(rarity));
    }
    
    // 添加到车库
    gameState.garage.push(...results);
    saveGame();
    renderGarage();
    
    // 显示结果
    displayGachaResults(results);
    
    // 启用按钮
    document.getElementById('btn-single').disabled = false;
    document.getElementById('btn-ten').disabled = false;
}

// 显示抽卡结果
function displayGachaResults(cars) {
    const grid = document.getElementById('gacha-results-grid');
    const container = document.getElementById('gacha-results');
    
    grid.innerHTML = cars.map((car, index) => {
        const rarityConfig = CONFIG.rarities[car.rarity];
        const groupConfig = CONFIG.groups[car.group];
        
        // 生成标签HTML
        let tagsHtml = '';
        if (car.tags && car.tags.length > 0) {
            tagsHtml = `<div class="flex gap-1 mt-1 justify-center flex-wrap">${car.tags.map(tag => {
                const tagConfig = CONFIG.tags[tag];
                return `<span class="text-xs px-1 py-0.5 rounded" style="background: ${tagConfig.color}; color: white; font-size: 10px;">${tagConfig.icon}</span>`;
            }).join('')}</div>`;
        }
        
        return `
            <div class="gacha-result-card bg-[#1a1a1a] rounded-lg p-3 border-2 rarity-${car.rarity} animate-fade-in" 
                 style="animation-delay: ${index * 0.1}s">
                <div class="text-center mb-2">
                    <span class="badge-${car.rarity} text-white text-xs px-2 py-1 rounded-full">
                        ${rarityConfig.name}
                    </span>
                </div>
                <h4 class="font-bold text-sm text-center mb-1">${car.brand}</h4>
                <p class="text-xs text-gray-400 text-center mb-2">${car.model}</p>
                ${tagsHtml}
                <div class="text-center mt-2">
                    <span class="total-score text-lg font-bold">${car.totalScore}</span>
                </div>
                <div class="text-center mt-1">
                    <span class="text-xs" style="color: ${groupConfig.color}">${groupConfig.icon} ${groupConfig.name}</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.classList.remove('hidden');
}

// 渲染车库
function renderGarage() {
    const grid = document.getElementById('garage-grid');
    const emptyGarage = document.getElementById('empty-garage');
    
    if (gameState.garage.length === 0) {
        grid.classList.add('hidden');
        emptyGarage.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    emptyGarage.classList.add('hidden');
    
    grid.innerHTML = gameState.garage.map(car => {
        const rarityConfig = CONFIG.rarities[car.rarity];
        const groupConfig = CONFIG.groups[car.group];
        
        // 生成标签HTML
        let tagsHtml = '';
        if (car.tags && car.tags.length > 0) {
            tagsHtml = `<div class="flex gap-1 mt-1 justify-center flex-wrap">${car.tags.map(tag => {
                const tagConfig = CONFIG.tags[tag];
                return `<span class="text-xs px-1 py-0.5 rounded" style="background: ${tagConfig.color}; color: white; font-size: 10px;">${tagConfig.icon}</span>`;
            }).join('')}</div>`;
        }
        
        return `
            <div class="car-card bg-[#2a2a2a] rounded-xl p-4 border-2 rarity-${car.rarity} hover:scale-105 transition-all cursor-pointer" 
                 onclick="openCarDetailModal(${car.id})">
                <div class="text-right mb-2">
                    <span class="badge-${car.rarity} text-white text-xs px-2 py-1 rounded-full">
                        ${rarityConfig.name}
                    </span>
                </div>
                <h3 class="font-bold text-center mb-1">${car.brand}</h3>
                <p class="text-sm text-gray-400 text-center mb-3">${car.model}</p>
                ${tagsHtml}
                <div class="mt-3">
                    <div class="flex justify-between text-xs mb-1">
                        <span>速度</span>
                        <span>${car.stats.speed}</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-1 mb-2">
                        <div class="bg-blue-500 h-1 rounded-full" style="width: ${Math.min(car.stats.speed, 100)}%"></div>
                    </div>
                    <div class="flex justify-between text-xs mb-1">
                        <span>加速</span>
                        <span>${car.stats.acceleration}</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-1 mb-2">
                        <div class="bg-green-500 h-1 rounded-full" style="width: ${Math.min(car.stats.acceleration, 100)}%"></div>
                    </div>
                    <div class="flex justify-between text-xs mb-1">
                        <span>操控</span>
                        <span>${car.stats.handling}</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-1 mb-2">
                        <div class="bg-purple-500 h-1 rounded-full" style="width: ${Math.min(car.stats.handling, 100)}%"></div>
                    </div>
                    <div class="flex justify-between text-xs mb-1">
                        <span>耐久</span>
                        <span>${car.stats.durability}</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-1 mb-3">
                        <div class="bg-red-500 h-1 rounded-full" style="width: ${Math.min(car.stats.durability, 100)}%"></div>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-xs text-gray-400">总分</span>
                        <div class="font-bold text-[#ffd700]">${car.totalScore}</div>
                    </div>
                    <div>
                        <span class="text-xs" style="color: ${groupConfig.color}">${groupConfig.icon} ${groupConfig.name}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 打开车辆详情弹窗
function openCarDetailModal(carId) {
    const car = gameState.garage.find(c => c.id === carId);
    if (!car) return;
    
    const rarityConfig = CONFIG.rarities[car.rarity];
    const groupConfig = CONFIG.groups[car.group];
    
    // 生成标签HTML
    let tagsHtml = '';
    if (car.tags && car.tags.length > 0) {
        tagsHtml = `<div class="flex gap-2 mt-3">${car.tags.map(tag => {
            const tagConfig = CONFIG.tags[tag];
            return `<span class="px-2 py-1 rounded" style="background: ${tagConfig.color}; color: white; font-size: 12px;">${tagConfig.icon} ${tagConfig.name}</span>`;
        }).join('')}</div>`;
    }
    
    document.getElementById('detail-rarity-badge').innerHTML = `
        <span class="badge-${car.rarity} text-white text-xs px-3 py-1 rounded-full">
            ${rarityConfig.name}
        </span>
    `;
    
    document.getElementById('detail-content').innerHTML = `
        <h3 class="text-xl font-bold text-center mb-2">${car.brand} ${car.model}</h3>
        <p class="text-sm text-gray-400 text-center mb-4">${car.year}款</p>
        ${tagsHtml}
        <div class="mt-4">
            <div class="flex justify-between text-sm mb-1">
                <span>速度</span>
                <span>${car.stats.speed}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min(car.stats.speed, 100)}%"></div>
            </div>
            <div class="flex justify-between text-sm mb-1">
                <span>加速</span>
                <span>${car.stats.acceleration}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div class="bg-green-500 h-2 rounded-full" style="width: ${Math.min(car.stats.acceleration, 100)}%"></div>
            </div>
            <div class="flex justify-between text-sm mb-1">
                <span>操控</span>
                <span>${car.stats.handling}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div class="bg-purple-500 h-2 rounded-full" style="width: ${Math.min(car.stats.handling, 100)}%"></div>
            </div>
            <div class="flex justify-between text-sm mb-1">
                <span>耐久</span>
                <span>${car.stats.durability}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div class="bg-red-500 h-2 rounded-full" style="width: ${Math.min(car.stats.durability, 100)}%"></div>
            </div>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-gray-700">
            <div>
                <span class="text-sm text-gray-400">总分</span>
                <div class="text-2xl font-bold text-[#ffd700]">${car.totalScore}</div>
            </div>
            <div class="text-center">
                <span class="block text-sm" style="color: ${groupConfig.color}">${groupConfig.icon} ${groupConfig.name}</span>
                <span class="block text-xs text-gray-400 mt-1">收购价: ${car.price} 金币</span>
            </div>
        </div>
    `;
    
    openModal('car-detail-modal');
}

// 初始化商店
function initShop() {
    const container = document.getElementById('shop-items');
    container.innerHTML = CONFIG.shopItems.map(item => {
        const priceText = item.price.gold 
            ? `${item.price.gold.toLocaleString()} 金币`
            : `${item.price.premium} 高级货币`;
        
        return `
            <div class="shop-item bg-[#1a1a1a] rounded-xl p-4 border border-gray-700">
                <div class="flex items-center gap-3 mb-3">
                    <div class="text-3xl">${item.icon}</div>
                    <div>
                        <h4 class="font-bold">${item.name}</h4>
                        <p class="text-sm text-gray-400">${item.type === 'normal_ticket' ? '普通抽卡' : item.type === 'premium_ticket' ? '高级抽卡' : '梦想车展'} x${item.count}</p>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#ffd700] font-bold">${priceText}</span>
                    <button onclick="buyItem('${item.id}')" class="px-4 py-2 bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-black font-bold rounded-lg hover:opacity-90 transition-all">
                        购买
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 购买物品
function buyItem(itemId) {
    const item = CONFIG.shopItems.find(i => i.id === itemId);
    if (!item) return;
    
    // 检查货币
    if (item.price.gold) {
        if (gameState.gold < item.price.gold) {
            showToast('金币不足！');
            return;
        }
        gameState.gold -= item.price.gold;
    } else if (item.price.premium) {
        if (gameState.premium < item.price.premium) {
            showToast('高级货币不足！');
            return;
        }
        gameState.premium -= item.price.premium;
    }
    
    // 添加票券
    if (item.type === 'normal_ticket') {
        gameState.normalTickets += item.count;
    } else if (item.type === 'premium_ticket') {
        gameState.premiumTickets += item.count;
    } else if (item.type === 'dream_ticket') {
        gameState.dreamTickets = (gameState.dreamTickets || 0) + item.count;
    }
    
    updateUI();
    saveGame();
    showToast(`购买成功！获得${item.name} x${item.count}`);
}

// 填充对战车辆选择
function populateBattleCarSelect() {
    const select = document.getElementById('battle-car-select');
    select.innerHTML = '<option value="">请选择车辆</option>';
    
    gameState.garage.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.brand} ${car.model} (${car.totalScore}分)`;
        select.appendChild(option);
    });
    
    // 添加选择事件
    select.onchange = function() {
        const carId = this.value;
        if (carId) {
            const car = gameState.garage.find(c => c.id == carId);
            if (car) {
                displayCarInfo('player-car-info', car, '你的车辆');
                generateOpponent(car.totalScore);
            }
        } else {
            document.getElementById('player-car-info').classList.add('hidden');
            document.getElementById('opponent-car-info').innerHTML = '<div class="text-center text-gray-500">选择车辆后将自动匹配对手</div>';
        }
    };
}

// 显示车辆信息
function displayCarInfo(elementId, car, title) {
    const element = document.getElementById(elementId);
    const rarityConfig = CONFIG.rarities[car.rarity];
    const groupConfig = CONFIG.groups[car.group];
    
    element.innerHTML = `
        <h4 class="font-bold mb-3">${title}</h4>
        <div class="text-center mb-3">
            <h5 class="font-bold">${car.brand} ${car.model}</h5>
            <p class="text-sm text-gray-400">${car.year}款</p>
            <span class="badge-${car.rarity} text-white text-xs px-2 py-1 rounded-full mt-2 inline-block">
                ${rarityConfig.name}
            </span>
        </div>
        <div class="space-y-2">
            <div class="flex justify-between text-sm">
                <span>速度</span>
                <span>${car.stats.speed}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span>加速</span>
                <span>${car.stats.acceleration}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span>操控</span>
                <span>${car.stats.handling}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span>耐久</span>
                <span>${car.stats.durability}</span>
            </div>
            <div class="flex justify-between text-sm font-bold mt-2">
                <span>总分</span>
                <span>${car.totalScore}</span>
            </div>
        </div>
        <div class="mt-3 text-center">
            <span class="text-sm" style="color: ${groupConfig.color}">${groupConfig.icon} ${groupConfig.name}</span>
        </div>
    `;
    element.classList.remove('hidden');
}

// 生成对手
function generateOpponent(playerScore) {
    // 生成一个与玩家实力相近的对手
    const targetScore = playerScore + (Math.random() * 20 - 10);
    const rarity = targetScore > 350 ? 'Legendary' : targetScore > 300 ? 'Epic' : targetScore > 250 ? 'Rare' : 'Common';
    const opponentCar = generateCar(rarity);
    
    // 调整对手属性以接近目标分数
    const scoreDiff = targetScore - opponentCar.totalScore;
    if (scoreDiff !== 0) {
        const stats = opponentCar.stats;
        const statKeys = Object.keys(stats);
        for (let i = 0; i < Math.abs(scoreDiff); i++) {
            const statKey = statKeys[Math.floor(Math.random() * statKeys.length)];
            stats[statKey] += scoreDiff > 0 ? 1 : -1;
            stats[statKey] = Math.max(1, Math.min(100, stats[statKey]));
        }
        opponentCar.totalScore = calculateTotalScore(stats);
    }
    
    displayCarInfo('opponent-car-info', opponentCar, '对手车辆');
    window.opponentCar = opponentCar;
}

// 开始对战
async function startBattle() {
    const select = document.getElementById('battle-car-select');
    const carId = select.value;
    if (!carId || !window.opponentCar) {
        showToast('请选择车辆并等待对手匹配！');
        return;
    }
    
    const playerCar = gameState.garage.find(c => c.id == carId);
    if (!playerCar) return;
    
    const battleLog = document.getElementById('battle-log');
    const battleResult = document.getElementById('battle-result');
    
    // 清空日志和结果
    battleLog.innerHTML = '<div class="text-center">比赛开始！</div>';
    battleResult.classList.add('hidden');
    
    // 禁用按钮
    document.getElementById('btn-battle').disabled = true;
    
    // 模拟比赛过程
    const events = [
        '比赛开始！车辆冲出起跑线',
        `${playerCar.brand} ${playerCar.model} 加速领先`,
        `${window.opponentCar.brand} ${window.opponentCar.model} 紧追不舍`,
        '进入弯道，双方展开激烈争夺',
        '直线加速，速度决定胜负',
        '最后冲刺！'
    ];
    
    for (const event of events) {
        battleLog.innerHTML += `<div class="mt-2">${event}</div>`;
        battleLog.scrollTop = battleLog.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 计算比赛结果
    const playerTotal = playerCar.totalScore + Math.random() * 20;
    const opponentTotal = window.opponentCar.totalScore + Math.random() * 20;
    const isWin = playerTotal > opponentTotal;
    const reward = isWin ? Math.floor(Math.random() * 1000) + 500 : Math.floor(Math.random() * 200) + 100;
    
    // 显示结果
    battleLog.innerHTML += `<div class="mt-4 font-bold">${isWin ? '🎉 你赢了！' : '💥 你输了！'}</div>`;
    battleLog.scrollTop = battleLog.scrollHeight;
    
    battleResult.innerHTML = `
        <div class="${isWin ? 'text-green-400' : 'text-red-400'} text-2xl font-bold mb-2">
            ${isWin ? '🎉 胜利！' : '💥 失败！'}
        </div>
        <div class="text-sm text-gray-400 mb-4">
            ${playerCar.brand} ${playerCar.model} ${Math.round(playerTotal)}分 vs ${window.opponentCar.brand} ${window.opponentCar.model} ${Math.round(opponentTotal)}分
        </div>
        <div class="text-lg font-bold text-[#ffd700]">获得 ${reward} 金币</div>
    `;
    battleResult.classList.remove('hidden');
    
    // 发放奖励
    gameState.gold += reward;
    updateUI();
    saveGame();
    
    // 启用按钮
    document.getElementById('btn-battle').disabled = false;
}

// 渲染出售车辆
function renderSellCars(filter = 'all') {
    const list = document.getElementById('sell-car-list');
    const selectedCount = document.getElementById('selected-count');
    const totalSellPrice = document.getElementById('total-sell-price');
    const confirmBtn = document.getElementById('btn-confirm-sell');
    
    // 过滤车辆
    const filteredCars = filter === 'all' 
        ? gameState.garage 
        : gameState.garage.filter(car => car.rarity === filter);
    
    // 渲染车辆列表
    list.innerHTML = filteredCars.map(car => {
        const rarityConfig = CONFIG.rarities[car.rarity];
        return `
            <div class="sell-car-item bg-[#1a1a1a] rounded-lg p-3 border border-gray-700 flex items-center gap-3">
                <input type="checkbox" class="sell-checkbox" value="${car.id}" onchange="updateSellSelection()">
                <div class="flex-1">
                    <h4 class="font-bold text-sm">${car.brand} ${car.model}</h4>
                    <p class="text-xs text-gray-400">${car.year}款</p>
                    <div class="flex justify-between items-center mt-1">
                        <span class="text-xs" style="color: ${rarityConfig.color}">${rarityConfig.name}</span>
                        <span class="text-xs text-[#ffd700]">${car.price} 金币</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // 更新选择状态
    updateSellSelection();
}

// 筛选出售车辆
function filterSellCars(filter) {
    renderSellCars(filter);
}

// 更新出售选择
function updateSellSelection() {
    const checkboxes = document.querySelectorAll('.sell-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseFloat(cb.value));
    const selectedCars = gameState.garage.filter(car => selectedIds.includes(car.id));
    const totalPrice = selectedCars.reduce((sum, car) => sum + car.price, 0);
    
    document.getElementById('selected-count').textContent = selectedCars.length;
    document.getElementById('total-sell-price').textContent = totalPrice.toLocaleString();
    document.getElementById('btn-confirm-sell').disabled = selectedCars.length === 0;
}

// 一键出售普通车
function quickSellCommon() {
    const commonCars = gameState.garage.filter(car => car.rarity === 'Common');
    if (commonCars.length === 0) {
        showToast('没有普通车辆可以出售！');
        return;
    }
    
    if (confirm(`确定要出售所有普通车辆吗？共${commonCars.length}辆，可获得${commonCars.reduce((sum, car) => sum + car.price, 0)}金币`)) {
        const totalPrice = commonCars.reduce((sum, car) => sum + car.price, 0);
        gameState.gold += totalPrice;
        gameState.garage = gameState.garage.filter(car => car.rarity !== 'Common');
        updateUI();
        saveGame();
        renderGarage();
        renderSellCars();
        showToast(`成功出售${commonCars.length}辆普通车，获得${totalPrice}金币！`);
    }
}

// 确认出售
function confirmSell() {
    const checkboxes = document.querySelectorAll('.sell-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseFloat(cb.value));
    const selectedCars = gameState.garage.filter(car => selectedIds.includes(car.id));
    
    if (selectedCars.length === 0) return;
    
    const confirmList = document.getElementById('confirm-sell-list');
    const confirmTotal = document.getElementById('confirm-total-price');
    
    confirmList.innerHTML = selectedCars.map(car => {
        const rarityConfig = CONFIG.rarities[car.rarity];
        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                <div>
                    <span class="font-bold text-sm">${car.brand} ${car.model}</span>
                    <span class="text-xs ml-2" style="color: ${rarityConfig.color}">${rarityConfig.name}</span>
                </div>
                <span class="text-[#ffd700] text-sm">${car.price} 金币</span>
            </div>
        `;
    }).join('');
    
    const totalPrice = selectedCars.reduce((sum, car) => sum + car.price, 0);
    confirmTotal.textContent = totalPrice.toLocaleString();
    
    // 保存选中的车辆ID
    window.selectedSellIds = selectedIds;
    
    openModal('confirm-sell-modal');
}

// 执行出售
function executeSell() {
    if (!window.selectedSellIds || window.selectedSellIds.length === 0) return;
    
    const selectedCars = gameState.garage.filter(car => window.selectedSellIds.includes(car.id));
    const totalPrice = selectedCars.reduce((sum, car) => sum + car.price, 0);
    
    // 执行出售
    gameState.gold += totalPrice;
    gameState.garage = gameState.garage.filter(car => !window.selectedSellIds.includes(car.id));
    
    updateUI();
    saveGame();
    renderGarage();
    renderSellCars();
    
    closeModal('confirm-sell-modal');
    showToast(`成功出售${selectedCars.length}辆车，获得${totalPrice}金币！`);
}

// 梦想车展状态
let dreamShowState = {
    selectedTags: [],
    lastTagResult: null
};

// 打开梦想车展弹窗
function openDreamGachaModal() {
    // 重置梦想车展状态
    dreamShowState = {
        selectedTags: [],
        lastTagResult: null
    };
    
    // 更新UI
    updateDreamShowUI();
    openModal('dream-gacha-modal');
}

// 更新梦想车展UI
function updateDreamShowUI() {
    // 更新梦想券显示
    const dreamTicketDisplay = document.getElementById('dream-ticket-display-modal');
    if (dreamTicketDisplay) {
        dreamTicketDisplay.textContent = (gameState.dreamTickets || 0).toLocaleString();
    }
    
    // 更新已选标签
    const selectedTagsDiv = document.getElementById('selected-tags');
    if (dreamShowState.selectedTags.length === 0) {
        selectedTagsDiv.innerHTML = '<span class="text-gray-500 text-sm">暂无选择</span>';
    } else {
        selectedTagsDiv.innerHTML = dreamShowState.selectedTags.map(tag => {
            const tagConfig = CONFIG.tags[tag];
            return `<span class="px-2 py-1 rounded" style="background: ${tagConfig.color}; color: white; font-size: 12px;">${tagConfig.icon} ${tagConfig.name}</span>`;
        }).join('');
    }
    
    // 更新提车按钮状态
    const claimBtn = document.getElementById('claim-car-btn');
    claimBtn.disabled = dreamShowState.selectedTags.length === 0;
    
    // 更新标签结果
    const tagResultDiv = document.getElementById('tag-result');
    if (dreamShowState.lastTagResult) {
        const tagConfig = CONFIG.tags[dreamShowState.lastTagResult];
        tagResultDiv.innerHTML = `
            <div class="text-center">
                <span class="text-4xl mb-2 block">${tagConfig.icon}</span>
                <span class="text-lg font-bold" style="color: ${tagConfig.color}">${tagConfig.name}</span>
                <p class="text-sm text-gray-400 mt-1">${tagConfig.name === 'limited' ? '稀有度极高的限量版车型' : tagConfig.name === 'collection' ? '值得收藏的经典车型' : '历史悠久的传世之作'}</p>
            </div>
        `;
    } else {
        tagResultDiv.innerHTML = '<div class="text-center py-4 text-gray-500">抽取标签后显示结果</div>';
    }
    
    // 更新筛选车辆
    updateFilteredCars();
}

// 抽取标签
async function drawTag() {
    const ticketCost = 100;
    
    // 检查资源
    if (!gameState.dreamTickets || gameState.dreamTickets < ticketCost) {
        showToast('梦想券不足！需要100梦想券抽取一次标签');
        return;
    }
    
    // 扣除梦想券
    gameState.dreamTickets -= ticketCost;
    updateUI();
    saveGame();
    
    // 显示动画效果
    const tagResultDiv = document.getElementById('tag-result');
    tagResultDiv.innerHTML = '<div class="text-center py-4"><div class="text-4xl animate-bounce">🎰</div><p class="mt-2 text-gray-400">抽取中...</p></div>';
    
    // 等待动画
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 随机抽取标签
    const tags = Object.keys(CONFIG.tags);
    const selectedTag = tags[Math.floor(Math.random() * tags.length)];
    dreamShowState.lastTagResult = selectedTag;
    
    // 更新UI
    updateDreamShowUI();
    showToast(`成功抽取标签：${CONFIG.tags[selectedTag].name}`);
}

// 选择标签
function selectTag(tag) {
    // 检查是否已选择
    const index = dreamShowState.selectedTags.indexOf(tag);
    if (index === -1) {
        // 添加标签
        dreamShowState.selectedTags.push(tag);
    } else {
        // 移除标签
        dreamShowState.selectedTags.splice(index, 1);
    }
    
    // 更新UI
    updateDreamShowUI();
}

// 放弃标签
function abandonTags() {
    if (dreamShowState.selectedTags.length === 0) {
        showToast('没有标签可以放弃！');
        return;
    }
    
    // 返还700梦想券
    gameState.dreamTickets = (gameState.dreamTickets || 0) + 700;
    
    // 清空已选标签
    dreamShowState.selectedTags = [];
    dreamShowState.lastTagResult = null;
    
    // 更新UI
    updateUI();
    updateDreamShowUI();
    saveGame();
    showToast('已放弃所有标签，返还700梦想券！');
}

// 提车
function claimCar() {
    if (dreamShowState.selectedTags.length === 0) {
        showToast('请先选择标签！');
        return;
    }
    
    // 筛选匹配的车辆
    const matchingCars = CAR_DATABASE.filter(car => {
        // 车辆必须包含所有已选标签
        return dreamShowState.selectedTags.every(tag => car.tags && car.tags.includes(tag));
    });
    
    if (matchingCars.length === 0) {
        showToast('没有匹配的车辆！请尝试其他标签组合');
        return;
    }
    
    // 随机选择一辆车
    const selectedCarTemplate = matchingCars[Math.floor(Math.random() * matchingCars.length)];
    
    // 生成车辆
    const car = {
        id: Date.now() + Math.random(),
        brand: selectedCarTemplate.brand,
        model: selectedCarTemplate.model,
        year: selectedCarTemplate.year,
        rarity: selectedCarTemplate.rarity,
        group: selectedCarTemplate.group || 'performance',
        tags: selectedCarTemplate.tags || [],
        stats: generateCarStats(selectedCarTemplate.baseStats, selectedCarTemplate.rarity),
        price: generateCarPrice(selectedCarTemplate.rarity) * 2, // 梦想车展车辆价值翻倍
        acquiredAt: new Date().toISOString()
    };
    car.totalScore = calculateTotalScore(car.stats);
    
    // 添加到车库
    gameState.garage.push(car);
    saveGame();
    renderGarage();
    
    // 清空标签
    dreamShowState.selectedTags = [];
    dreamShowState.lastTagResult = null;
    
    // 更新UI
    updateDreamShowUI();
    showToast(`成功获得车辆：${car.brand} ${car.model}`);
}

// 更新筛选车辆
function updateFilteredCars() {
    const filteredCarsDiv = document.getElementById('filtered-cars');
    
    if (dreamShowState.selectedTags.length === 0) {
        filteredCarsDiv.innerHTML = '<div class="text-center py-8 text-gray-500">选择标签后显示匹配车辆</div>';
        return;
    }
    
    // 筛选匹配的车辆
    const matchingCars = CAR_DATABASE.filter(car => {
        // 车辆必须包含所有已选标签
        return dreamShowState.selectedTags.every(tag => car.tags && car.tags.includes(tag));
    });
    
    if (matchingCars.length === 0) {
        filteredCarsDiv.innerHTML = '<div class="text-center py-8 text-gray-500">没有匹配的车辆！</div>';
        return;
    }
    
    // 显示匹配的车辆
    filteredCarsDiv.innerHTML = matchingCars.map(car => {
        const rarityConfig = CONFIG.rarities[car.rarity];
        const groupConfig = CONFIG.groups[car.group];
        
        // 生成标签HTML
        let tagsHtml = '';
        if (car.tags && car.tags.length > 0) {
            tagsHtml = `<div class="flex gap-1 mt-1 flex-wrap">${car.tags.map(tag => {
                const tagConfig = CONFIG.tags[tag];
                return `<span class="text-xs px-1 py-0.5 rounded" style="background: ${tagConfig.color}; color: white; font-size: 10px;">${tagConfig.icon}</span>`;
            }).join('')}</div>`;
        }
        
        return `
            <div class="bg-[#2a2a2a] rounded-lg p-3 border-2 rarity-${car.rarity}">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-bold">${car.brand}</h4>
                        <p class="text-sm text-gray-400">${car.model}</p>
                        ${tagsHtml}
                    </div>
                    <span class="badge-${car.rarity} text-white text-xs px-2 py-1 rounded-full">
                        ${rarityConfig.name}
                    </span>
                </div>
                <div class="mt-2 text-right">
                    <span class="text-xs" style="color: ${groupConfig.color}">${groupConfig.icon} ${groupConfig.name}</span>
                </div>
            </div>
        `;
    }).join('');
}

// 打开开发者模式弹窗
function openDeveloperModal() {
    // 填充当前数值
    document.getElementById('dev-gold').value = gameState.gold;
    document.getElementById('dev-premium').value = gameState.premium;
    document.getElementById('dev-normal-tickets').value = gameState.normalTickets;
    document.getElementById('dev-premium-tickets').value = gameState.premiumTickets;
    document.getElementById('dev-dream-tickets').value = gameState.dreamTickets || 0;
    openModal('developer-modal');
}

// 应用开发者修改
function applyDevChanges() {
    const gold = parseInt(document.getElementById('dev-gold').value) || 0;
    const premium = parseInt(document.getElementById('dev-premium').value) || 0;
    const normalTickets = parseInt(document.getElementById('dev-normal-tickets').value) || 0;
    const premiumTickets = parseInt(document.getElementById('dev-premium-tickets').value) || 0;
    const dreamTickets = parseInt(document.getElementById('dev-dream-tickets').value) || 0;
    
    gameState.gold = gold;
    gameState.premium = premium;
    gameState.normalTickets = normalTickets;
    gameState.premiumTickets = premiumTickets;
    gameState.dreamTickets = dreamTickets;
    
    updateUI();
    saveGame();
    showToast('修改已应用！');
}

// 添加随机车辆
function addRandomCar(rarity) {
    const car = generateCar(rarity);
    gameState.garage.push(car);
    saveGame();
    renderGarage();
    showToast(`成功添加${CONFIG.rarities[rarity].name}车辆：${car.brand} ${car.model}`);
}

// 导出数据
function exportData() {
    const dataStr = JSON.stringify(gameState, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `car-collection-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('数据导出成功！');
}

// 导入数据
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                gameState = data;
                updateUI();
                renderGarage();
                saveGame();
                showToast('数据导入成功！');
            } catch (error) {
                showToast('数据格式错误，导入失败！');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// 清除所有数据
function clearAllData() {
    if (confirm('确定要清除所有游戏数据吗？此操作不可恢复！')) {
        gameState = {
            gold: 10000,
            premium: 100,
            normalTickets: 10,
            premiumTickets: 5,
            dreamTickets: 3,
            garage: [],
            lastSave: Date.now(),
            afkMode: false
        };
        updateUI();
        renderGarage();
        saveGame();
        showToast('所有数据已清除！');
    }
}

// 刷新文件列表
function refreshFileList() {
    // 模拟文件列表刷新
    showToast('文件列表已刷新！');
}

// 开始挂机模式
function startAfkMode() {
    if (afkState.running) {
        showToast('挂机模式已经在运行中！');
        return;
    }
    
    afkState.running = true;
    gameState.afkMode = true;
    afkState.logs = [];
    
    // 记录开始日志
    addAfkLog('挂机模式已启动');
    
    // 设置挂机间隔（每3秒执行一次）
    afkState.intervalId = setInterval(() => {
        executeAfkAction();
    }, 3000);
    
    saveGame();
    showToast('挂机模式已启动！');
    updateAfkUI();
}

// 停止挂机模式
function stopAfkMode() {
    if (!afkState.running) {
        showToast('挂机模式未运行！');
        return;
    }
    
    clearInterval(afkState.intervalId);
    afkState.running = false;
    gameState.afkMode = false;
    
    // 记录停止日志
    addAfkLog('挂机模式已停止');
    
    saveGame();
    showToast('挂机模式已停止！');
    updateAfkUI();
}

// 执行挂机操作
function executeAfkAction() {
    // 随机执行不同的操作
    const actions = [
        'drawNormalGacha',
        'drawPremiumGacha',
        'drawDreamTag',
        'claimDreamCar',
        'battle'
    ];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    switch (action) {
        case 'drawNormalGacha':
            if (gameState.gold >= 1000) {
                gameState.gold -= 1000;
                const car = generateCar(drawRarity('normal'));
                gameState.garage.push(car);
                addAfkLog(`普通抽卡获得：${car.brand} ${car.model}`);
            }
            break;
        case 'drawPremiumGacha':
            if (gameState.premium >= 1) {
                gameState.premium -= 1;
                const car = generateCar(drawRarity('premium'));
                gameState.garage.push(car);
                addAfkLog(`高级抽卡获得：${car.brand} ${car.model}`);
            }
            break;
        case 'drawDreamTag':
            if (gameState.dreamTickets >= 100) {
                gameState.dreamTickets -= 100;
                const tags = Object.keys(CONFIG.tags);
                const selectedTag = tags[Math.floor(Math.random() * tags.length)];
                addAfkLog(`抽取标签：${CONFIG.tags[selectedTag].name}`);
                // 自动选择标签
                if (!dreamShowState.selectedTags.includes(selectedTag)) {
                    dreamShowState.selectedTags.push(selectedTag);
                }
            }
            break;
        case 'claimDreamCar':
            if (dreamShowState.selectedTags.length > 0) {
                const matchingCars = CAR_DATABASE.filter(car => {
                    return dreamShowState.selectedTags.every(tag => car.tags && car.tags.includes(tag));
                });
                if (matchingCars.length > 0) {
                    const selectedCarTemplate = matchingCars[Math.floor(Math.random() * matchingCars.length)];
                    const car = {
                        id: Date.now() + Math.random(),
                        brand: selectedCarTemplate.brand,
                        model: selectedCarTemplate.model,
                        year: selectedCarTemplate.year,
                        rarity: selectedCarTemplate.rarity,
                        group: selectedCarTemplate.group || 'performance',
                        tags: selectedCarTemplate.tags || [],
                        stats: generateCarStats(selectedCarTemplate.baseStats, selectedCarTemplate.rarity),
                        price: generateCarPrice(selectedCarTemplate.rarity) * 2,
                        acquiredAt: new Date().toISOString()
                    };
                    car.totalScore = calculateTotalScore(car.stats);
                    gameState.garage.push(car);
                    addAfkLog(`提车获得：${car.brand} ${car.model}`);
                    dreamShowState.selectedTags = [];
                }
            }
            break;
        case 'battle':
            if (gameState.garage.length > 0) {
                const playerCar = gameState.garage[Math.floor(Math.random() * gameState.garage.length)];
                // 模拟对战
                const reward = Math.floor(Math.random() * 1000) + 500;
                gameState.gold += reward;
                addAfkLog(`对战获胜，获得${reward}金币`);
            }
            break;
    }
    
    // 自动保存
    saveGame();
    updateUI();
    renderGarage();
    
    // 更新AI日志悬浮窗
    updateAiLogFloatingWindow();
}

// 添加挂机日志
function addAfkLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    afkState.logs.push(logEntry);
    
    // 限制日志数量
    if (afkState.logs.length > 50) {
        afkState.logs.shift();
    }
    
    // 更新日志显示
    updateAfkLogDisplay();
}

// 更新挂机日志显示
function updateAfkLogDisplay() {
    const logContainer = document.getElementById('afk-log');
    if (logContainer) {
        logContainer.innerHTML = afkState.logs.map(log => `<div class="text-sm">${log}</div>`).join('');
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}

// 更新挂机UI
function updateAfkUI() {
    const startBtn = document.getElementById('afk-start-btn');
    const stopBtn = document.getElementById('afk-stop-btn');
    const status = document.getElementById('afk-status');
    
    if (startBtn && stopBtn && status) {
        if (afkState.running) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            status.textContent = '运行中';
            status.style.color = '#4CAF50';
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            status.textContent = '已停止';
            status.style.color = '#f44336';
        }
    }
}

// AI日志悬浮窗功能
function openAiLog() {
    const aiLog = document.getElementById('ai-log-floating');
    if (aiLog) {
        aiLog.classList.remove('hidden');
    }
}

function closeAiLog() {
    const aiLog = document.getElementById('ai-log-floating');
    if (aiLog) {
        aiLog.classList.add('hidden');
    }
}

function minimizeAiLog() {
    const aiLog = document.getElementById('ai-log-floating');
    const content = document.getElementById('ai-log-content');
    if (aiLog && content) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            aiLog.style.height = 'auto';
        } else {
            content.classList.add('hidden');
            aiLog.style.height = '40px';
        }
    }
}

function updateAiLogFloatingWindow() {
    const aiLog = document.getElementById('ai-log-floating');
    const content = document.getElementById('ai-log-content');
    if (aiLog && content) {
        if (afkState.running && aiLog.classList.contains('hidden')) {
            aiLog.classList.remove('hidden');
        }
        
        if (afkState.logs.length > 0) {
            content.innerHTML = afkState.logs.slice(-10).map(log => `<div class="mb-1">${log}</div>`).join('');
            content.scrollTop = content.scrollHeight;
        } else {
            content.innerHTML = '<div class="text-gray-500 text-center">AI日志将显示在这里</div>';
        }
    }
}

// 初始化游戏
window.onload = initGame;