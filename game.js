// ===========================
// GAME STATE
// ===========================
const gameState = {
    // Vitals
    bodyTemp: 36.5,
    stamina: 100,
    sanity: 100,
    fullness: 100,
    
    // Stats
    money: 30000,
    distance: 0,
    targetDistance: 50,
    time: 6, // hours (0-24)
    day: 1,
    
    // Load
    currentLoad: 0,
    maxLoad: 0,
    
    // Status effects
    statusEffects: [],
    
    // Inventory
    inventory: [],
    backpack: null,
    
    // Weather
    weather: { type: 'clear', temp: -5, description: 'Clear' },
    
    // Game state
    gameStarted: false,
    gameOver: false,
    shopPhase: false,
    
    // Time tracking
    lastSleep: 0,
    hoursWithoutSleep: 0,
    hoursAtZeroFullness: 0,
    hoursAtZeroStamina: 0,
    extremeTempHours: 0,
    
    // Special event tracking
    injuredHiker: null,
    injuredHikerEncountered: false,
    trash: 0,
    fireActive: false
};

// ===========================
// SHOP DATA
// ===========================
const shopData = {
    backpacks: [
        { id: 'light', name: 'Light Backpack', maxLoad: 15, weight: 1.1, price: 1200 },
        { id: 'advanced', name: 'Advanced Backpack', maxLoad: 25, weight: 1.8, price: 2800 },
        { id: 'heavy', name: 'Heavy Backpack', maxLoad: 40, weight: 2.6, price: 4500 },
        { id: 'expedition', name: 'Expedition Backpack', maxLoad: 50, weight: 3.5, price: 6000 }
    ],
    gear: [
        { id: 'poles', name: 'Trekking Poles', weight: 0.48, price: 900, effect: 'Stamina drain -7.5%' },
        { id: 'kneepads', name: 'Knee Pads', weight: 0.25, price: 480, effect: 'Stamina drain -5%' },
        { id: 'tent', name: 'Tent', weight: 2.8, price: 5800, effect: 'Required for sleeping' },
        { id: 'jacket', name: 'Waterproof Jacket', weight: 0.3, price: 200, effect: 'Prevents wet status' },
        { id: 'goggles', name: 'Goggles', weight: 0.12, price: 600, effect: 'Prevents snow blindness' },
        { id: 'gloves', name: 'Gloves', weight: 0.25, price: 800, effect: 'Prevents frostbite' },
        { id: 'mask', name: 'Windproof Mask', weight: 0.1, price: 420, effect: 'Prevents frostbite' },
        { id: 'bag-10', name: '-10° Sleeping Bag', weight: 0.95, price: 1800, minTemp: -10 },
        { id: 'bag-20', name: '-20° Sleeping Bag', weight: 1.3, price: 3200, minTemp: -20 },
        { id: 'bag-30', name: '-30° Sleeping Bag', weight: 1.7, price: 4800, minTemp: -30 },
        { id: 'bag-40', name: '-40° Sleeping Bag', weight: 2.2, price: 6800, minTemp: -40 },
        { id: 'headlamp', name: 'Headlamp', weight: 0.15, price: 650, effect: 'Light source' },
        { id: 'crampons', name: 'Crampons', weight: 0.8, price: 600, effect: 'Ice climbing' },
        { id: 'rope', name: 'Climbing Rope', weight: 1.5, price: 800, effect: 'Rock climbing' },
        { id: 'blanket', name: 'Thermal Blanket', weight: 0.18, price: 80, effect: 'Single-use warmth', consumable: true }
    ],
    supplies: [
        { id: 'biscuit', name: 'Compressed Biscuits', weight: 0.5, price: 120, fullness: 40, consumable: true },
        { id: 'mre', name: 'MRE', weight: 0.8, price: 200, fullness: 60, sanity: 30, consumable: true, requiresCooking: true },
        { id: 'gas', name: 'Gas Canister', weight: 0.35, price: 60, consumable: true },
        { id: 'stove', name: 'Stove', weight: 0.35, price: 800, effect: 'Cooking tool' },
        { id: 'firstaid', name: 'First Aid Kit', weight: 0.6, price: 450, consumable: true, effect: 'Heals status' }
    ]
};

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    // Bind event listeners
    document.getElementById('start-game-btn').addEventListener('click', startShopping);
    document.getElementById('finish-shopping-btn').addEventListener('click', finishShopping);
    document.getElementById('move-btn').addEventListener('click', moveForward);
    document.getElementById('rest-btn').addEventListener('click', rest);
    document.getElementById('sleep-btn').addEventListener('click', sleep);
    document.getElementById('inventory-btn').addEventListener('click', openInventory);
    document.getElementById('close-inventory').addEventListener('click', closeInventory);
    document.getElementById('build-fire-btn').addEventListener('click', buildFire);
    document.getElementById('quick-eat-btn').addEventListener('click', quickEat);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('victory-restart-btn').addEventListener('click', restartGame);
    
    updateUI();
}

function startShopping() {
    showScreen('shop-screen');
    gameState.shopPhase = true;
    populateShop();
}

function populateShop() {
    // Backpacks
    const backpacksList = document.getElementById('backpacks-list');
    backpacksList.innerHTML = '';
    shopData.backpacks.forEach(item => {
        backpacksList.innerHTML += createShopItemHTML(item, 'backpack');
    });
    
    // Gear
    const gearList = document.getElementById('gear-list');
    gearList.innerHTML = '';
    shopData.gear.forEach(item => {
        gearList.innerHTML += createShopItemHTML(item, 'gear');
    });
    
    // Supplies
    const suppliesList = document.getElementById('supplies-list');
    suppliesList.innerHTML = '';
    shopData.supplies.forEach(item => {
        suppliesList.innerHTML += createShopItemHTML(item, 'supply');
    });
    
    // Bind buy buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.dataset.id;
            const itemType = e.target.dataset.type;
            buyItem(itemId, itemType);
        });
    });
    
    // Bind sell buttons
    document.querySelectorAll('.sell-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.dataset.id;
            const itemType = e.target.dataset.type;
            sellItem(itemId, itemType);
        });
    });
    
    updateShopMoney();
    updateShopWeight();
}

function createShopItemHTML(item, type) {
    const isBackpack = type === 'backpack';
    const isConsumable = item.consumable || item.id === 'biscuit' || item.id === 'mre';
    
    let owned = false;
    let ownedCount = 0;
    
    if (isBackpack) {
        owned = gameState.backpack && gameState.backpack.id === item.id;
    } else {
        const ownedItems = gameState.inventory.filter(i => i.id === item.id);
        ownedCount = ownedItems.length;
        owned = ownedCount > 0;
    }
    
    let details = `${item.weight}kg | $${item.price}`;
    if (item.maxLoad) details = `Max ${item.maxLoad}kg | ${item.weight}kg | $${item.price}`;
    
    let effect = item.effect || '';
    if (item.fullness) effect = `+${item.fullness} Fullness` + (item.sanity ? `, +${item.sanity} Sanity` : '');
    if (item.minTemp) effect = `Min temp: ${item.minTemp}°C`;
    
    const buyButtonDisabled = !isConsumable && owned;
    const showQuantity = owned && (isConsumable || !isBackpack);
    
    return `
        <div class="shop-item ${owned && !isConsumable ? 'owned' : ''}">
            <div class="shop-item-header">
                <span class="shop-item-name">${item.name}</span>
                <span class="shop-item-price">$${item.price}</span>
            </div>
            <div class="shop-item-details">${details}</div>
            ${effect ? `<div class="shop-item-description">${effect}</div>` : ''}
            ${showQuantity ? `<div class="shop-item-description">Owned: ${ownedCount}</div>` : ''}
            <div style="display: flex; gap: 5px;">
                <button class="btn btn-primary buy-btn" data-id="${item.id}" data-type="${type}" ${buyButtonDisabled ? 'disabled' : ''} style="flex: 1;">
                    Buy
                </button>
                ${owned ? `<button class="btn btn-secondary sell-btn" data-id="${item.id}" data-type="${type}" style="flex: 1;">Sell</button>` : ''}
            </div>
        </div>
    `;
}

function buyItem(itemId, itemType) {
    let item = null;
    
    if (itemType === 'backpack') {
        item = shopData.backpacks.find(i => i.id === itemId);
        if (!item || gameState.money < item.price) return;
        
        // Check if new backpack can hold current items
        const currentItemsWeight = gameState.currentLoad - (gameState.backpack ? gameState.backpack.weight : 0);
        if (currentItemsWeight + item.weight > item.maxLoad) {
            addLog(`Cannot purchase! Current items (${currentItemsWeight.toFixed(1)}kg) exceed this backpack's capacity (${item.maxLoad}kg)`, 'danger');
            return;
        }
        
        gameState.money -= item.price;
        
        // If replacing backpack, refund old one
        if (gameState.backpack) {
            gameState.money += gameState.backpack.price;
            gameState.currentLoad -= gameState.backpack.weight;
            addLog(`Replaced ${gameState.backpack.name} with ${item.name}`, 'success');
        } else {
            addLog(`Purchased ${item.name}`, 'success');
        }
        
        gameState.backpack = item;
        gameState.maxLoad = item.maxLoad;
        gameState.currentLoad += item.weight;
    } else {
        const allItems = [...shopData.gear, ...shopData.supplies];
        item = allItems.find(i => i.id === itemId);
        if (!item || gameState.money < item.price) return;
        
        if (!gameState.backpack) {
            addLog('Purchase a backpack first!', 'warning');
            updateShopWeight();
            return;
        }
        
        if (gameState.currentLoad + item.weight > gameState.maxLoad) {
            addLog(`Not enough space! Need ${(gameState.currentLoad + item.weight - gameState.maxLoad).toFixed(1)}kg more capacity.`, 'warning');
            return;
        }
        
        gameState.money -= item.price;
        gameState.inventory.push({ ...item, quantity: 1 });
        gameState.currentLoad += item.weight;
        addLog(`Purchased ${item.name}`, 'success');
    }
    
    populateShop();
    updateUI();
    updateShopWeight();
}

function sellItem(itemId, itemType) {
    if (itemType === 'backpack') {
        // Selling backpack
        if (!gameState.backpack || gameState.backpack.id !== itemId) return;
        
        // Check if removing backpack would exceed capacity
        const backpackWeight = gameState.backpack.weight;
        const itemsWeight = gameState.currentLoad - backpackWeight;
        
        if (itemsWeight > 0) {
            addLog('Cannot sell backpack while carrying items! Remove items first.', 'warning');
            return;
        }
        
        gameState.money += gameState.backpack.price;
        gameState.currentLoad -= backpackWeight;
        gameState.maxLoad = 0;
        addLog(`Sold ${gameState.backpack.name} for $${gameState.backpack.price}`, 'success');
        gameState.backpack = null;
    } else {
        // Selling regular item
        const itemIndex = gameState.inventory.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;
        
        const item = gameState.inventory[itemIndex];
        gameState.money += item.price;
        gameState.currentLoad -= item.weight;
        addLog(`Sold ${item.name} for $${item.price}`, 'success');
        gameState.inventory.splice(itemIndex, 1);
    }
    
    populateShop();
    updateUI();
    updateShopWeight();
}

function updateShopWeight() {
    const currentWeight = document.getElementById('shop-weight-current');
    const maxWeight = document.getElementById('shop-weight-max');
    const warning = document.getElementById('shop-weight-warning');
    
    if (!currentWeight || !maxWeight || !warning) return;
    
    currentWeight.textContent = gameState.currentLoad.toFixed(1);
    maxWeight.textContent = gameState.maxLoad;
    
    // Show warning if no backpack
    if (!gameState.backpack) {
        warning.style.display = 'inline';
        currentWeight.style.color = 'var(--warning-color)';
        maxWeight.style.color = 'var(--warning-color)';
    } else {
        warning.style.display = 'none';
        // Color code based on capacity
        const percentage = (gameState.currentLoad / gameState.maxLoad) * 100;
        if (percentage > 90) {
            currentWeight.style.color = 'var(--danger-color)';
        } else if (percentage > 70) {
            currentWeight.style.color = 'var(--warning-color)';
        } else {
            currentWeight.style.color = 'var(--success-color)';
        }
        maxWeight.style.color = 'var(--text-light)';
    }
}

function finishShopping() {
    if (!gameState.backpack) {
        addLog('You must purchase a backpack before starting!', 'danger');
        return;
    }
    
    gameState.shopPhase = false;
    gameState.gameStarted = true;
    showScreen('game-screen');
    addLog('Your journey begins...', 'success');
    updateUI();
}

// ===========================
// GAME ACTIONS
// ===========================
function moveForward() {
    if (gameState.gameOver) return;
    
    // Check if can move
    if (gameState.stamina === 0) {
        addLog('Too exhausted to move!', 'danger');
        return;
    }
    
    if (gameState.hoursAtZeroFullness >= 24) {
        addLog('Too weak from hunger to move!', 'danger');
        return;
    }
    
    // Calculate movement
    const baseSpeed = 15; // km per day at 25kg
    const loadPenalty = Math.max(0, (gameState.currentLoad - 25) * 0.02);
    const speedMultiplier = 1 - loadPenalty;
    
    // Status penalties
    let statusPenalty = 1;
    if (gameState.stamina < 20) statusPenalty *= 0.7;
    if (gameState.sanity < 20) statusPenalty *= 0.7;
    if (gameState.fullness < 20) statusPenalty *= 0.7;
    if (hasStatus('wet')) statusPenalty *= 0.8;
    if (hasStatus('poisoned')) statusPenalty *= 0.8;
    if (hasStatus('frostbite')) statusPenalty *= 0.8;
    
    // Weather penalties
    let weatherPenalty = 1;
    if (gameState.weather.type === 'rainy') weatherPenalty *= 0.9; // -10%
    if (gameState.weather.type === 'snowy') {
        // -20% unless has crampons
        weatherPenalty *= hasItem('crampons') ? 1 : 0.8;
    }
    if (gameState.weather.type === 'windy') weatherPenalty *= 0.95; // -5%
    
    const distancePerHour = (baseSpeed / 24) * speedMultiplier * statusPenalty * weatherPenalty;
    gameState.distance += distancePerHour;
    
    // Fire goes out when moving
    if (gameState.fireActive) {
        gameState.fireActive = false;
        addLog('The fire has gone out as you moved forward', 'warning');
    }
    
    // Drain vitals
    drainVitals(1);
    
    // Advance time
    advanceTime(1);
    
    // Random event chance
    if (Math.random() < 0.15) {
        triggerRandomEvent();
    }
    
    // Check victory
    if (gameState.distance >= gameState.targetDistance) {
        victory();
        return;
    }
    
    addLog(`Moved forward ${distancePerHour.toFixed(1)} km`, 'success');
    updateUI();
    checkDeathConditions();
}

function rest() {
    if (gameState.gameOver) return;
    
    gameState.stamina = Math.min(100, gameState.stamina + 15);
    advanceTime(1);
    drainVitals(1, true);
    
    addLog('Rested for 1 hour', 'success');
    updateUI();
    checkDeathConditions();
}

function sleep() {
    if (gameState.gameOver) return;
    
    // Check for tent
    if (!hasItem('tent')) {
        addLog('You need a tent to sleep!', 'danger');
        return;
    }
    
    // Check for sleeping bag
    const sleepingBag = gameState.inventory.find(i => i.id && i.id.startsWith('bag-'));
    if (!sleepingBag) {
        addLog('You need a sleeping bag to sleep!', 'danger');
        return;
    }
    
    // Check temperature
    const ambientTemp = gameState.weather.temp;
    if (ambientTemp < sleepingBag.minTemp) {
        addLog('Sleeping bag not warm enough! Risk of frostbite!', 'warning');
        addStatus('frostbite');
    }
    
    // Sleep benefits
    gameState.stamina = Math.min(100, gameState.stamina + 80);
    gameState.sanity = Math.min(100, gameState.sanity + 40);
    gameState.lastSleep = gameState.day * 24 + gameState.time;
    gameState.hoursWithoutSleep = 0;
    
    // Body temp recovery if not frostbite
    if (gameState.bodyTemp < 35 && !hasStatus('frostbite')) {
        gameState.bodyTemp = Math.min(37, gameState.bodyTemp + 2);
        addLog('Warming up in sleeping bag...', 'success');
    }
    
    advanceTime(8);
    drainVitals(8, true);
    
    addLog('Slept for 8 hours', 'success');
    updateUI();
    checkDeathConditions();
}

// ===========================
// VITALS & TIME
// ===========================
function drainVitals(hours, resting = false) {
    // Stamina drain
    if (!resting) {
        let staminaDrain = 5 * hours;
        
        // Load penalty
        if (gameState.currentLoad > 25) {
            staminaDrain *= (1 + (gameState.currentLoad - 25) * 0.03);
        }
        
        // Gear benefits
        if (hasItem('poles')) staminaDrain *= 0.925;
        if (hasItem('kneepads')) staminaDrain *= 0.95;
        
        // Weather penalties
        if (gameState.weather.type === 'windy') staminaDrain *= 1.15; // +15%
        if (gameState.weather.type === 'snowy') staminaDrain *= 1.10; // +10%
        
        // Status penalties
        if (gameState.fullness < 20) staminaDrain *= 1.5;
        if (hasStatus('poisoned')) staminaDrain *= 1.3;
        if (hasStatus('frostbite')) staminaDrain *= 1.2;
        
        gameState.stamina = Math.max(0, gameState.stamina - staminaDrain);
    }
    
    // Fullness drain
    let fullnessDrain = 3 * hours;
    if (!resting && gameState.currentLoad > 25) {
        fullnessDrain *= (1 + (gameState.currentLoad - 25) * 0.02);
    }
    gameState.fullness = Math.max(0, gameState.fullness - fullnessDrain);
    
    // Sunny weather sanity bonus while moving
    if (!resting && gameState.weather.type === 'sunny') {
        gameState.sanity = Math.min(100, gameState.sanity + 1 * hours);
    }
    
    // Temperature effects
    updateBodyTemperature(hours);
    
    // Sleep deprivation
    if (gameState.hoursWithoutSleep > 24) {
        gameState.stamina = Math.max(0, gameState.stamina - 10 * hours);
        gameState.sanity = Math.max(0, gameState.sanity - 5 * hours);
    }
    
    // Zero fullness effects
    if (gameState.fullness === 0) {
        gameState.hoursAtZeroFullness += hours;
        gameState.bodyTemp = Math.max(32, gameState.bodyTemp - 0.5 * hours);
    } else {
        gameState.hoursAtZeroFullness = 0;
    }
    
    // Zero stamina tracking
    if (gameState.stamina === 0) {
        gameState.hoursAtZeroStamina += hours;
    } else {
        gameState.hoursAtZeroStamina = 0;
    }
    
    // Update status effects
    updateStatusEffects(hours);
}

function updateBodyTemperature(hours) {
    const ambientTemp = gameState.weather.temp;
    let tempChange = 0;
    
    // Cold weather
    if (ambientTemp < 0) {
        tempChange = -0.3 * hours;
        
        // Clothing protection
        if (hasItem('jacket')) tempChange *= 0.7;
        if (hasItem('gloves')) tempChange *= 0.9;
        if (hasItem('mask')) tempChange *= 0.9;
        
        // Sleeping bag protection (only when resting)
        const sleepingBag = gameState.inventory.find(i => i.id && i.id.startsWith('bag-'));
        if (sleepingBag && ambientTemp >= sleepingBag.minTemp) {
            tempChange *= 0.5;
        }
    }
    
    // Hot weather
    if (ambientTemp > 25) {
        tempChange = 0.2 * hours;
    }
    
    // Wet status
    if (hasStatus('wet')) {
        tempChange -= 0.5 * hours;
    }
    
    gameState.bodyTemp = Math.max(30, Math.min(42, gameState.bodyTemp + tempChange));
    
    // Extreme temperature effects
    if (gameState.bodyTemp < 35 || gameState.bodyTemp > 38) {
        gameState.extremeTempHours += hours;
        gameState.sanity = Math.max(0, gameState.sanity - 2 * hours);
        gameState.stamina = Math.max(0, gameState.stamina - 2 * hours);
    } else {
        gameState.extremeTempHours = 0;
    }
}

function advanceTime(hours) {
    gameState.time += hours;
    gameState.hoursWithoutSleep += hours;
    
    while (gameState.time >= 24) {
        gameState.time -= 24;
        gameState.day++;
        
        // Generate new weather each day
        generateWeather();
    }
}

function generateWeather() {
    // Store previous day's temp for precipitation logic
    const previousTemp = gameState.weather.temp;
    
    // Random weather selection: sunny, cloudy, windy, or precipitation
    const weatherOptions = ['sunny', 'cloudy', 'windy', 'precipitation'];
    let selectedWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    
    // Start with previous temp or initial temp
    let temp = previousTemp !== undefined ? previousTemp : -5;
    let weatherType = 'clear';
    let description = 'Clear';
    
    // Apply temperature changes based on weather type
    switch(selectedWeather) {
        case 'sunny':
            weatherType = 'sunny';
            description = 'Sunny';
            temp += 3 + Math.random() * 2; // +3°C to +5°C
            break;
        case 'cloudy':
            weatherType = 'cloudy';
            description = 'Cloudy';
            temp += -1 + Math.random() * 2; // -1°C to +1°C
            break;
        case 'windy':
            weatherType = 'windy';
            description = 'Windy';
            temp += -5 + Math.random() * 2; // -5°C to -3°C
            break;
        case 'precipitation':
            // Determine rain or snow based on previous day's temp
            if (previousTemp >= 0) {
                weatherType = 'rainy';
                description = 'Rainy';
                temp += -4 + Math.random() * 2; // -4°C to -2°C
                // Check for wet status
                if (!hasItem('jacket') && Math.random() < 0.6) {
                    addStatus('wet');
                }
            } else {
                weatherType = 'snowy';
                description = 'Snowy';
                temp += -7 + Math.random() * 3; // -7°C to -4°C
            }
            break;
    }
    
    gameState.weather = { type: weatherType, temp: Math.round(temp), description };
    updateLandscapeVisuals();
}

function updateStatusEffects(hours) {
    gameState.statusEffects = gameState.statusEffects.filter(status => {
        if (status.duration) {
            status.duration -= hours;
            if (status.duration <= 0) {
                addLog(`${status.name} has worn off`, 'success');
                return false;
            }
        }
        return true;
    });
}

function updateLandscapeVisuals() {
    const landscape = document.getElementById('landscape');
    if (!landscape) return;
    
    const weather = gameState.weather.type;
    
    // Remove all weather classes
    landscape.className = 'landscape';
    
    // Apply weather-specific styling
    switch(weather) {
        case 'sunny':
            landscape.classList.add('weather-sunny');
            landscape.style.background = 'linear-gradient(to bottom, #87ceeb 0%, #f0f8ff 40%, #90ee90 100%)';
            break;
        case 'cloudy':
            landscape.classList.add('weather-cloudy');
            landscape.style.background = 'linear-gradient(to bottom, #778899 0%, #b0c4de 40%, #8fbc8f 100%)';
            break;
        case 'windy':
            landscape.classList.add('weather-windy');
            landscape.style.background = 'linear-gradient(to bottom, #6b7f99 0%, #9db4c9 40%, #7a9d7a 100%)';
            break;
        case 'rainy':
            landscape.classList.add('weather-rainy');
            landscape.style.background = 'linear-gradient(to bottom, #4a5f7f 0%, #6b8ba9 40%, #5a7a5a 100%)';
            // Add rain effect
            landscape.setAttribute('data-weather', '🌧️');
            break;
        case 'snowy':
            landscape.classList.add('weather-snowy');
            landscape.style.background = 'linear-gradient(to bottom, #d0d8e0 0%, #e8f0f8 40%, #f0f8ff 100%)';
            // Add snow effect
            landscape.setAttribute('data-weather', '❄️');
            break;
        default:
            landscape.style.background = 'linear-gradient(to bottom, #87ceeb 0%, #f0f8ff 50%, #90ee90 100%)';
    }
}

// ===========================
// INVENTORY
// ===========================
function openInventory() {
    const modal = document.getElementById('inventory-modal');
    const content = document.getElementById('inventory-content');
    
    content.innerHTML = '';
    
    // Add backpack
    if (gameState.backpack) {
        content.innerHTML += `
            <div class="inventory-card">
                <div class="inventory-card-header">${gameState.backpack.name}</div>
                <div class="inventory-card-details">
                    ${gameState.backpack.weight}kg | Max: ${gameState.backpack.maxLoad}kg
                </div>
            </div>
        `;
    }
    
    // Aggregate items by ID
    const itemGroups = {};
    gameState.inventory.forEach((item, index) => {
        if (!itemGroups[item.id]) {
            itemGroups[item.id] = {
                item: item,
                count: 0,
                indices: []
            };
        }
        itemGroups[item.id].count++;
        itemGroups[item.id].indices.push(index);
    });
    
    // Add aggregated items
    Object.values(itemGroups).forEach(group => {
        const item = group.item;
        const canUse = item.consumable;
        const totalWeight = (item.weight * group.count).toFixed(1);
        
        content.innerHTML += `
            <div class="inventory-card">
                <div class="inventory-card-header">${item.name} ${group.count > 1 ? `x${group.count}` : ''}</div>
                <div class="inventory-card-details">
                    ${totalWeight}kg (${item.weight}kg each)
                    ${item.effect ? `<br>${item.effect}` : ''}
                </div>
                ${canUse ? `<button class="btn btn-primary" onclick="useItemByType('${item.id}')">Use</button>` : ''}
            </div>
        `;
    });
    
    if (gameState.trash > 0) {
        content.innerHTML += `
            <div class="inventory-card">
                <div class="inventory-card-header">🗑️ Trash</div>
                <div class="inventory-card-details">
                    ${(gameState.trash * 0.5).toFixed(1)}kg | $${gameState.trash * 500} reward
                </div>
            </div>
        `;
    }
    
    modal.classList.add('active');
}

function closeInventory() {
    document.getElementById('inventory-modal').classList.remove('active');
}

function useItemByType(itemId) {
    const index = gameState.inventory.findIndex(i => i.id === itemId);
    if (index === -1) return;
    useItem(index);
}

function useItem(index) {
    const item = gameState.inventory[index];
    if (!item || !item.consumable) return;
    
    if (item.id === 'biscuit') {
        gameState.fullness = Math.min(100, gameState.fullness + 40);
        addLog('Ate compressed biscuits (+40 Fullness)', 'success');
        removeItem(index);
    } else if (item.id === 'mre') {
        if (!gameState.fireActive) {
            addLog('Need to build a fire first! (Build Fire button)', 'warning');
            return;
        }
        
        gameState.fullness = Math.min(100, gameState.fullness + 60);
        gameState.sanity = Math.min(100, gameState.sanity + 30);
        addLog('Ate MRE (+60 Fullness, +30 Sanity)', 'success');
        removeItem(index);
    } else if (item.id === 'blanket') {
        if (gameState.bodyTemp < 36) {
            gameState.bodyTemp = Math.min(37, gameState.bodyTemp + 2);
            addLog('Used thermal blanket to warm up', 'success');
            removeItem(index);
        } else {
            addLog('Body temperature is already normal', 'warning');
        }
    } else if (item.id === 'firstaid') {
        let used = false;
        
        if (hasStatus('poisoned')) {
            removeStatus('poisoned');
            used = true;
        }
        
        if (hasStatus('frostbite') && gameState.bodyTemp >= 36) {
            removeStatus('frostbite');
            used = true;
        }
        
        if (gameState.bodyTemp > 38) {
            gameState.bodyTemp = 37;
            used = true;
        }
        
        if (used) {
            addLog('Used first aid kit', 'success');
            removeItem(index);
        } else {
            addLog('Nothing to treat right now', 'warning');
        }
    }
    
    closeInventory();
    updateUI();
}

function removeItem(index) {
    const item = gameState.inventory[index];
    gameState.currentLoad -= item.weight;
    gameState.inventory.splice(index, 1);
}

function hasItem(itemId) {
    return gameState.inventory.some(i => i.id === itemId);
}

function buildFire() {
    if (gameState.fireActive) {
        addLog('Fire is already active!', 'warning');
        return;
    }
    
    if (!hasItem('stove')) {
        addLog('Need a stove to build fire!', 'warning');
        return;
    }
    
    if (!hasItem('gas')) {
        addLog('Need a gas canister to build fire!', 'warning');
        return;
    }
    
    // Consume gas
    const gasIndex = gameState.inventory.findIndex(i => i.id === 'gas');
    if (gasIndex !== -1) {
        removeItem(gasIndex);
        gameState.fireActive = true;
        addLog('🔥 Built a fire! Can now cook MREs and warm up.', 'success');
        
        // Fire warms you up
        if (gameState.bodyTemp < 36.5) {
            gameState.bodyTemp = Math.min(37, gameState.bodyTemp + 1.5);
            addLog('Warming up by the fire...', 'success');
        }
        
        updateUI();
    }
}

function quickEat() {
    // Prioritize biscuits for quick eating
    const biscuitIndex = gameState.inventory.findIndex(i => i.id === 'biscuit');
    if (biscuitIndex !== -1) {
        gameState.fullness = Math.min(100, gameState.fullness + 40);
        addLog('Quick ate compressed biscuits (+40 Fullness)', 'success');
        removeItem(biscuitIndex);
        updateUI();
        return;
    }
    
    // Try MRE if fire is active
    const mreIndex = gameState.inventory.findIndex(i => i.id === 'mre');
    if (mreIndex !== -1 && gameState.fireActive) {
        gameState.fullness = Math.min(100, gameState.fullness + 60);
        gameState.sanity = Math.min(100, gameState.sanity + 30);
        addLog('Quick ate MRE (+60 Fullness, +30 Sanity)', 'success');
        removeItem(mreIndex);
        updateUI();
        return;
    }
    
    addLog('No food available to quick eat!', 'warning');
}

// ===========================
// STATUS EFFECTS
// ===========================
function addStatus(statusName) {
    if (hasStatus(statusName)) return;
    
    let status = { name: statusName };
    
    switch(statusName) {
        case 'wet':
            status.duration = 5;
            status.description = 'Body temperature dropping rapidly';
            addLog('You are wet!', 'danger');
            break;
        case 'poisoned':
            status.duration = 5;
            gameState.stamina = Math.max(0, gameState.stamina - 15);
            status.description = 'Stamina draining faster';
            addLog('Poisoned from wild fruit!', 'danger');
            break;
        case 'frostbite':
            gameState.stamina = Math.max(0, gameState.stamina - 15);
            status.description = 'Requires First Aid + normal body temp';
            addLog('Frostbite! Need medical attention!', 'danger');
            break;
        case 'tired':
            status.description = 'Movement speed decreased';
            break;
        case 'delirious':
            status.description = 'Movement slow, injury risk high';
            break;
        case 'hungry':
            status.description = 'Movement speed decreased';
            break;
    }
    
    gameState.statusEffects.push(status);
    updateUI();
}

function removeStatus(statusName) {
    gameState.statusEffects = gameState.statusEffects.filter(s => s.name !== statusName);
    addLog(`Cured ${statusName}!`, 'success');
    updateUI();
}

function hasStatus(statusName) {
    return gameState.statusEffects.some(s => s.name === statusName);
}

// ===========================
// RANDOM EVENTS
// ===========================
function triggerRandomEvent() {
    const events = [
        'wildFruit',
        'wildAnimal',
        'trash'
    ];
    
    // Add special events
    if (gameState.stamina < 20 && gameState.trash > 0) {
        events.push('desperateMeasures');
    }
    
    // Injured hiker (once per game) - increased probability
    if (!gameState.injuredHikerEncountered && Math.random() < 0.25) {
        events.push('injuredHiker');
    }
    
    const eventType = events[Math.floor(Math.random() * events.length)];
    
    switch(eventType) {
        case 'wildFruit':
            showEvent('🍎 Wild Fruit', 'You found some wild berries growing by the trail.', [
                { text: 'Eat them (+10 Fullness, 25% poison risk)', action: () => eatWildFruit() },
                { text: 'Ignore', action: () => closeEvent() }
            ]);
            break;
        case 'wildAnimal':
            showEvent('🦌 Wild Animal', 'A wild animal appears on the trail.', [
                { text: 'Approach (25% attack, 25% +15 Sanity)', action: () => approachAnimal() },
                { text: 'Leave quietly', action: () => closeEvent() }
            ]);
            break;
        case 'trash':
            showEvent('🗑️ Trash', 'You found trash left by other hikers.', [
                { text: 'Pick it up (+0.5kg, $500 reward at end)', action: () => pickUpTrash() },
                { text: 'Ignore', action: () => closeEvent() }
            ]);
            break;
        case 'desperateMeasures':
            showEvent('⚠️ Desperate Measures', 'You are exhausted. The trash in your pack feels like lead. Every step is agony. Do you dump it?', [
                { text: 'Keep it (Respect Nature) -2 Sanity', action: () => keepTrash() },
                { text: 'Throw it away +5 Stamina, -5 Sanity', action: () => dumpTrash() }
            ]);
            break;
        case 'injuredHiker':
            startInjuredHikerEvent();
            break;
    }
}

function showEvent(title, description, choices) {
    document.getElementById('event-title').textContent = title;
    document.getElementById('event-description').textContent = description;
    
    const choicesDiv = document.getElementById('event-choices');
    choicesDiv.innerHTML = '';
    
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'event-choice-btn';
        btn.textContent = choice.text;
        btn.onclick = choice.action;
        choicesDiv.appendChild(btn);
    });
    
    document.getElementById('event-modal').classList.add('active');
}

function closeEvent() {
    document.getElementById('event-modal').classList.remove('active');
}

function eatWildFruit() {
    gameState.fullness = Math.min(100, gameState.fullness + 10);
    addLog('Ate wild fruit (+10 Fullness)', 'success');
    
    if (Math.random() < 0.25) {
        addStatus('poisoned');
    }
    
    closeEvent();
    updateUI();
}

function approachAnimal() {
    const roll = Math.random();
    
    if (roll < 0.25) {
        gameState.stamina = Math.max(0, gameState.stamina - 15);
        addLog('The animal attacked you! (-15 Stamina)', 'danger');
    } else if (roll < 0.5) {
        gameState.sanity = Math.min(100, gameState.sanity + 15);
        addLog('You observed the beautiful creature (+15 Sanity)', 'success');
    } else {
        addLog('The animal ran away', 'warning');
    }
    
    closeEvent();
    updateUI();
}

function pickUpTrash() {
    if (gameState.currentLoad + 0.5 > gameState.maxLoad) {
        addLog('Not enough space in backpack!', 'warning');
    } else {
        gameState.trash++;
        gameState.currentLoad += 0.5;
        addLog('Picked up trash (+0.5kg)', 'success');
    }
    closeEvent();
    updateUI();
}

function keepTrash() {
    gameState.sanity = Math.max(0, gameState.sanity - 2);
    addLog('The weight crushes your spirit... (-2 Sanity)', 'warning');
    closeEvent();
    updateUI();
}

function dumpTrash() {
    const trashWeight = gameState.trash * 0.5;
    gameState.currentLoad -= trashWeight;
    gameState.trash = 0;
    gameState.stamina = Math.min(100, gameState.stamina + 5);
    gameState.sanity = Math.max(0, gameState.sanity - 5);
    addLog('Dumped all trash. You feel lighter but guilty. (+5 Stamina, -5 Sanity)', 'warning');
    closeEvent();
    updateUI();
}

function startInjuredHikerEvent() {
    gameState.injuredHiker = { stage: 1, startTime: gameState.day * 24 + gameState.time };
    gameState.injuredHikerEncountered = true; // Mark as encountered to prevent re-occurrence
    
    showEvent('🚨 Injured Hiker', 'You encounter a badly injured hiker. They need immediate aid. Can you provide a Compressed Biscuit OR First Aid Kit?', [
        { text: 'Give Compressed Biscuit', action: () => giveHikerBiscuit() },
        { text: 'Give First Aid Kit', action: () => giveHikerFirstAid() },
        { text: 'Walk away', action: () => refuseHiker() }
    ]);
}

function giveHikerBiscuit() {
    const biscuitIndex = gameState.inventory.findIndex(i => i.id === 'biscuit');
    if (biscuitIndex === -1) {
        addLog('You don\'t have a biscuit!', 'warning');
        return;
    }
    
    removeItem(biscuitIndex);
    gameState.injuredHiker.stage = 2;
    
    showEvent('🚨 Injured Hiker', 'The hiker thanks you. "Please, reach the Rescue Point and call for help. I\'ll wait here." Will you help?', [
        { text: 'Agree to get help', action: () => agreeToHelp() },
        { text: 'Refuse', action: () => refuseHiker() }
    ]);
}

function giveHikerFirstAid() {
    const aidIndex = gameState.inventory.findIndex(i => i.id === 'firstaid');
    if (aidIndex === -1) {
        addLog('You don\'t have a first aid kit!', 'warning');
        return;
    }
    
    removeItem(aidIndex);
    gameState.injuredHiker.stage = 2;
    
    showEvent('🚨 Injured Hiker', 'The hiker thanks you. "Please, reach the Rescue Point and call for help. I\'ll wait here." Will you help?', [
        { text: 'Agree to get help', action: () => agreeToHelp() },
        { text: 'Refuse', action: () => refuseHiker() }
    ]);
}

function agreeToHelp() {
    gameState.injuredHiker.stage = 3;
    
    showEvent('🚨 Injured Hiker', 'The rescue will take time. They need food to survive - 3 Compressed Biscuits. Can you spare them?', [
        { text: 'Give 3 Biscuits', action: () => give3Biscuits() },
        { text: 'Sorry, I can\'t', action: () => refuseBiscuits() }
    ]);
}

function give3Biscuits() {
    const biscuits = gameState.inventory.filter(i => i.id === 'biscuit');
    if (biscuits.length < 3) {
        addLog('You don\'t have 3 biscuits!', 'warning');
        return;
    }
    
    // Remove 3 biscuits
    for (let i = 0; i < 3; i++) {
        const index = gameState.inventory.findIndex(i => i.id === 'biscuit');
        if (index !== -1) removeItem(index);
    }
    
    gameState.injuredHiker.stage = 4;
    gameState.injuredHiker.deadline = gameState.day * 24 + gameState.time + 48;
    
    addLog('Race against time: Reach rescue point within 2 days!', 'warning');
    closeEvent();
    updateUI();
}

function refuseBiscuits() {
    gameState.injuredHiker.stage = 5; // Failed
    gameState.sanity = Math.max(0, gameState.sanity - 20);
    addLog('The hiker will likely starve waiting... (-20 Sanity)', 'danger');
    closeEvent();
    updateUI();
}

function refuseHiker() {
    gameState.injuredHiker = null;
    gameState.sanity = Math.max(0, gameState.sanity - 20);
    addLog('You left the hiker to die... (-20 Sanity)', 'danger');
    closeEvent();
    updateUI();
}

// ===========================
// UI UPDATES
// ===========================
function updateUI() {
    // Vitals
    document.getElementById('temp-value').textContent = `${gameState.bodyTemp.toFixed(1)}°C`;
    document.getElementById('stamina-value').textContent = `${Math.round(gameState.stamina)}/100`;
    document.getElementById('sanity-value').textContent = `${Math.round(gameState.sanity)}/100`;
    document.getElementById('fullness-value').textContent = `${Math.round(gameState.fullness)}/100`;
    document.getElementById('load-value').textContent = `${gameState.currentLoad.toFixed(1)}/${gameState.maxLoad} kg`;
    
    // Progress bars
    document.getElementById('temp-bar').style.width = `${(gameState.bodyTemp / 40) * 100}%`;
    document.getElementById('stamina-bar').style.width = `${gameState.stamina}%`;
    document.getElementById('sanity-bar').style.width = `${gameState.sanity}%`;
    document.getElementById('fullness-bar').style.width = `${gameState.fullness}%`;
    document.getElementById('load-bar').style.width = `${(gameState.currentLoad / gameState.maxLoad) * 100}%`;
    
    // Color coding
    updateVitalColor('stamina', gameState.stamina);
    updateVitalColor('sanity', gameState.sanity);
    updateVitalColor('fullness', gameState.fullness);
    
    // Stats
    document.getElementById('money-value').textContent = gameState.money.toLocaleString();
    document.getElementById('distance-value').textContent = `${gameState.distance.toFixed(1)}/${gameState.targetDistance} km`;
    document.getElementById('time-value').textContent = `Day ${gameState.day}, ${formatTime(gameState.time)}`;
    document.getElementById('weather-value').textContent = `${gameState.weather.description}, ${gameState.weather.temp}°C`;
    
    // Shop money
    if (document.getElementById('shop-money')) {
        document.getElementById('shop-money').textContent = gameState.money.toLocaleString();
    }
    
    // Status effects
    updateStatusEffectsUI();
    
    // Quick inventory
    updateQuickInventory();
    
    // Update landscape visuals
    updateLandscapeVisuals();
    
    // Update fire button state
    const fireBtn = document.getElementById('build-fire-btn');
    if (fireBtn) {
        if (gameState.fireActive) {
            fireBtn.disabled = true;
            fireBtn.textContent = '🔥 Fire Active';
            fireBtn.classList.add('btn-success');
        } else {
            fireBtn.disabled = false;
            fireBtn.textContent = '🔥 Build Fire';
            fireBtn.classList.remove('btn-success');
        }
    }
    
    // Auto-add status for low vitals
    if (gameState.stamina < 20 && !hasStatus('tired')) addStatus('tired');
    if (gameState.sanity < 20 && !hasStatus('delirious')) addStatus('delirious');
    if (gameState.fullness < 20 && !hasStatus('hungry')) addStatus('hungry');
    
    // Auto-remove status when vitals return to normal
    if (gameState.stamina >= 20 && hasStatus('tired')) removeStatus('tired');
    if (gameState.sanity >= 20 && hasStatus('delirious')) removeStatus('delirious');
    if (gameState.fullness >= 20 && hasStatus('hungry')) removeStatus('hungry');
}

function updateVitalColor(vitalName, value) {
    const bar = document.getElementById(`${vitalName}-bar`);
    const valueSpan = document.getElementById(`${vitalName}-value`);
    
    if (value < 20) {
        valueSpan.style.color = 'var(--danger-color)';
    } else if (value < 50) {
        valueSpan.style.color = 'var(--warning-color)';
    } else {
        valueSpan.style.color = 'var(--success-color)';
    }
}

function updateStatusEffectsUI() {
    const container = document.getElementById('status-effects');
    
    if (gameState.statusEffects.length === 0) {
        container.innerHTML = '<p class="no-status">No active effects</p>';
        return;
    }
    
    container.innerHTML = '';
    gameState.statusEffects.forEach(status => {
        const div = document.createElement('div');
        div.className = 'status-effect';
        div.innerHTML = `
            <strong>${status.name}</strong>
            ${status.duration ? ` (${status.duration}h)` : ''}
            <br>
            <small>${status.description || ''}</small>
        `;
        container.appendChild(div);
    });
}

function updateQuickInventory() {
    const container = document.getElementById('quick-inventory');
    container.innerHTML = '';
    
    if (gameState.backpack) {
        container.innerHTML += `<div class="inventory-item"><span>🎒 ${gameState.backpack.name}</span></div>`;
    }
    
    // Group items
    const itemCounts = {};
    gameState.inventory.forEach(item => {
        if (itemCounts[item.name]) {
            itemCounts[item.name].count++;
        } else {
            itemCounts[item.name] = { count: 1, weight: item.weight };
        }
    });
    
    Object.entries(itemCounts).forEach(([name, data]) => {
        container.innerHTML += `
            <div class="inventory-item">
                <span>${name} x${data.count}</span>
                <span>${(data.weight * data.count).toFixed(1)}kg</span>
            </div>
        `;
    });
    
    if (gameState.trash > 0) {
        container.innerHTML += `
            <div class="inventory-item">
                <span>🗑️ Trash x${gameState.trash}</span>
                <span>${(gameState.trash * 0.5).toFixed(1)}kg</span>
            </div>
        `;
    }
}

function formatTime(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function addLog(message, type = '') {
    const log = document.getElementById('activity-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${formatTime(gameState.time)}] ${message}`;
    log.insertBefore(entry, log.firstChild);
    
    // Limit to 50 entries
    while (log.children.length > 50) {
        log.removeChild(log.lastChild);
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function updateShopMoney() {
    const moneyDisplay = document.getElementById('shop-money');
    if (moneyDisplay) {
        moneyDisplay.textContent = gameState.money.toLocaleString();
    }
}

// ===========================
// DEATH & VICTORY
// ===========================
function checkDeathConditions() {
    let deathMessage = '';
    
    // Temperature deaths
    if (gameState.bodyTemp <= 32 && gameState.extremeTempHours >= 4) {
        deathMessage = 'You died from severe hypothermia.';
    } else if (gameState.bodyTemp >= 41 && gameState.extremeTempHours >= 12) {
        deathMessage = 'You died from severe hyperthermia.';
    }
    
    // Sanity
    if (gameState.sanity === 0) {
        deathMessage = 'Your mind shattered. You couldn\'t go on.';
    }
    
    // Stamina
    if (gameState.hoursAtZeroStamina >= 4) {
        deathMessage = 'Your body gave out from exhaustion.';
    }
    
    // Starvation
    if (gameState.hoursAtZeroFullness >= 72) {
        deathMessage = 'You died of starvation.';
    }
    
    if (deathMessage) {
        gameOver(deathMessage);
    }
}

function gameOver(message) {
    gameState.gameOver = true;
    
    document.getElementById('gameover-title').textContent = '☠️ Game Over';
    document.getElementById('gameover-message').textContent = message;
    
    const stats = document.getElementById('gameover-stats');
    stats.innerHTML = `
        <h3>Final Statistics</h3>
        <p><strong>Distance Traveled:</strong> ${gameState.distance.toFixed(1)} / ${gameState.targetDistance} km</p>
        <p><strong>Days Survived:</strong> ${gameState.day}</p>
        <p><strong>Money Left:</strong> $${gameState.money.toLocaleString()}</p>
        <p><strong>Final Stamina:</strong> ${Math.round(gameState.stamina)}</p>
        <p><strong>Final Sanity:</strong> ${Math.round(gameState.sanity)}</p>
        <p><strong>Final Fullness:</strong> ${Math.round(gameState.fullness)}</p>
    `;
    
    showScreen('gameover-screen');
}

function victory() {
    gameState.gameOver = true;
    
    // Calculate rewards
    let totalMoney = gameState.money + (gameState.trash * 500);
    
    // Check injured hiker reward
    if (gameState.injuredHiker && gameState.injuredHiker.stage === 4) {
        const currentTime = gameState.day * 24 + gameState.time;
        if (currentTime <= gameState.injuredHiker.deadline) {
            totalMoney += 50000;
            addLog('Hiker rescued! +$50,000 reward!', 'success');
        } else {
            addLog('Rescue team arrived too late...', 'danger');
        }
    }
    
    const stats = document.getElementById('victory-stats');
    stats.innerHTML = `
        <h3>Victory Statistics</h3>
        <p><strong>Days Taken:</strong> ${gameState.day}</p>
        <p><strong>Final Stamina:</strong> ${Math.round(gameState.stamina)}</p>
        <p><strong>Final Sanity:</strong> ${Math.round(gameState.sanity)}</p>
        <p><strong>Trash Collected:</strong> ${gameState.trash} pieces</p>
        <p><strong>Total Money:</strong> $${totalMoney.toLocaleString()}</p>
    `;
    
    showScreen('victory-screen');
}

function restartGame() {
    // Reset game state
    Object.assign(gameState, {
        bodyTemp: 36.5,
        stamina: 100,
        sanity: 100,
        fullness: 100,
        money: 30000,
        distance: 0,
        targetDistance: 50,
        time: 6,
        day: 1,
        currentLoad: 0,
        maxLoad: 0,
        statusEffects: [],
        inventory: [],
        backpack: null,
        weather: { type: 'clear', temp: -5, description: 'Clear' },
        gameStarted: false,
        gameOver: false,
        shopPhase: false,
        lastSleep: 0,
        hoursWithoutSleep: 0,
        hoursAtZeroFullness: 0,
        hoursAtZeroStamina: 0,
        extremeTempHours: 0,
        injuredHiker: null,
        injuredHikerEncountered: false,
        trash: 0,
        fireActive: false
    });
    
    // Clear log
    document.getElementById('activity-log').innerHTML = '';
    
    showScreen('start-screen');
    updateUI();
}
