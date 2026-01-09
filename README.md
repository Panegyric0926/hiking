# ⛰️ Mountain Survival - Hiking Game

A challenging browser-based survival game where you must navigate treacherous mountain terrain while managing your vitals, inventory, and making critical decisions to survive.

![Game Genre](https://img.shields.io/badge/Genre-Survival-green)
![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Status](https://img.shields.io/badge/Status-Playable-success)

## 🎮 Game Overview

Mountain Survival is a text-based survival simulation game where you embark on a 100km journey through harsh mountain environments. Manage your body temperature, stamina, sanity, and hunger while dealing with random events, harsh weather conditions, and making life-or-death decisions.

**Death is permanent. Every choice matters.**

## 🎯 Objective

Travel 100 kilometers through the mountains while keeping yourself alive. Manage your resources wisely, respond to random events carefully, and reach the destination before your vitals run out.

## ✨ Features

### 📊 Complex Vitals System
- **Body Temperature**: Affected by weather, clothing, and conditions. Both hypothermia and hyperthermia are deadly
- **Stamina**: Drains while moving, affected by load weight and terrain
- **Sanity**: Decreases from traumatic events and isolation, increases from social encounters
- **Fullness**: Hunger management system - starve too long and you die
- **Load Management**: Backpack capacity limits what you can carry

### 🏪 Comprehensive Shop System
- **4 Backpack Types**: From light (15kg) to expedition (50kg)
- **15+ Gear Items**: Including tents, sleeping bags, climbing equipment, and protective clothing
- **Multiple Supply Options**: Food, medical kits, cooking equipment
- **Strategic Purchasing**: Start with $20,000 - spend wisely!

### 🎲 Random Events
- **Wild Fruit**: Risk poisoning for a food boost
- **Wild Animals**: Chance of injury or sanity boost
- **Trash Collection**: Environmental stewardship vs. weight burden
- **Injured Hiker**: Complex multi-stage rescue mission with time pressure and $50,000 reward (25% encounter rate!)
- **Desperate Measures**: Moral dilemma when survival is on the line

### 🌡️ Dynamic Weather System
- **5 Weather Types**: Sunny, Cloudy, Windy, Rainy, and Snowy conditions
- **Temperature-Based Precipitation**: Rain occurs when previous temp ≥ 0°C, Snow when < 0°C
- **Realistic Temperature Changes**: 
  - Sunny: +3°C to +5°C (optimal conditions)
  - Cloudy: -1°C to +1°C (stable)
  - Windy: -3°C to -5°C (wind chill)
  - Rainy: -2°C to -4°C (only above freezing)
  - Snowy: -4°C to -7°C (only below freezing)
- **Visual Weather Effects**: Dynamic landscape changes with animated weather icons
- **Weather-based penalties**: Movement speed and stamina affected by conditions
- **Status effects**: Wet (from rain), visibility reduction (from snow)

### ⚠️ Status Effects
- **Wet**: Rapid temperature loss (curable: 5 hours or Waterproof Jacket)
- **Poisoned**: Accelerated stamina drain (curable: First Aid Kit)
- **Frostbite**: Permanent until treated with First Aid + warmth
- **Tired/Hungry/Delirious**: Movement penalties from low vitals

### 💀 Multiple Death Conditions
- Hypothermia (4 hours at extreme low temp)
- Hyperthermia (12 hours at extreme high temp)
- Zero Sanity (instant death)
- Stamina Exhaustion (4 hours at zero)
- Starvation (3 days at zero fullness)

## 🎮 How to Play

### Starting the Game

1. **Open** `index.html` in any modern web browser
2. **Click** "Start Expedition" to begin
3. **Shop wisely** - You have $20,000 to spend
   - **MUST purchase a backpack first** (required to start)
   - Buy essential survival gear (tent, sleeping bag, food)
   - Consider your strategy (light and fast vs. heavy but prepared)
4. **Click** "Finish Shopping & Begin Journey" to start your expedition

### Game Controls

- **🚶 Move Forward**: Travel ~0.6km per hour, drains vitals
- **😴 Rest**: Recover 15 stamina over 1 hour
- **🛌 Sleep**: Recover 80 stamina and 40 sanity over 8 hours (requires tent & sleeping bag)
- **🎒 Inventory**: View and use items (food, medical supplies, etc.)

### Survival Tips

1. **Monitor Your Temperature**
   - Buy appropriate sleeping bags for the cold (-10°C to -40°C ratings)
   - Get protective gear (jacket, gloves, mask) to prevent frostbite
   - Use thermal blankets in emergencies

2. **Manage Your Stamina**
   - Don't let it hit zero for more than 4 hours
   - Trekking poles and knee pads reduce drain by 7.5% and 5%
   - Sleep regularly to recover

3. **Keep Your Sanity**
   - Sleep prevents deterioration
   - Cook MREs for +30 sanity boost (requires stove + gas)
   - Avoid letting vitals drop too low

4. **Stay Fed**
   - Compressed biscuits: +40 fullness (instant)
   - MREs: +60 fullness, +30 sanity (requires cooking)
   - Zero fullness for 24 hours = immobility

5. **Pack Smart**
   - Heavier loads = slower movement + faster vitals drain
   - Buy the right backpack for your strategy
   - Balance preparedness with mobility

6. **Weather Awareness**
   - Check current weather conditions
   - Rain without a waterproof jacket = wet status
   - Extreme cold requires proper sleeping bags

### Random Event Strategies

- **Wild Fruit**: Safe early game, risky late game (poison can be fatal)
- **Wild Animals**: 50% neutral, 25% helpful, 25% dangerous
- **Trash**: Carry for $500 reward each, but increases load
- **Injured Hiker**: Requires 1 food/med + 3 biscuits + reaching rescue within 48 hours for $50,000 reward
- **Desperate Measures**: Appear when stamina < 20 with trash - choose survival or morality

## 🛠️ Technical Details

### Files Structure
```
Hiking/
├── index.html      # Main game interface
├── styles.css      # Beautiful mountain-themed styling
├── game.js         # Complete game logic and mechanics
├── setting.md      # Game design document
└── README.md       # This file
```

### Technologies Used
- **HTML5**: Semantic structure and layout
- **CSS3**: Gradient backgrounds, animations, responsive design
- **Vanilla JavaScript**: No dependencies, pure ES6+

### Browser Compatibility
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Requirements
- Modern web browser with JavaScript enabled
- No installation or server required
- Works offline once files are downloaded

## 🎨 Design Highlights

- **Beautiful Gradient UI**: Mountain-inspired blue color scheme
- **Dynamic Weather Visuals**: Landscape changes with weather conditions - see the sun, clouds, rain, and snow!
- **Animated Weather Effects**: Floating rain/snow icons, pulsing sun, shaking wind effects
- **Real-time Progress Bars**: Color-coded vital statistics
- **Smooth Animations**: Fade-ins, hover effects, transitions
- **Responsive Layout**: Three-panel design (vitals | game | inventory)
- **Activity Log**: Real-time feedback on all actions
- **Modal System**: Clean event and inventory interfaces

## 🎲 Game Balance

- **Baseline Movement**: 15km per day at 25kg load in sunny/cloudy weather
- **Load Penalties**: Each kg over 25 = 2% speed reduction
- **Stamina Drain**: 5 per hour moving (affected by load, gear, and weather)
- **Fullness Drain**: 3 per hour (affected by load)
- **Weather Temperature Effects**: Daily temperature changes based on weather type
- **Weather Movement Penalties**: Rainy (-10%), Snowy (-20%), Windy (-5%)
- **Status Effect Duration**: Most effects last 5 hours
- **Random Event Rate**: 15% per hour moved, with 25% chance for injured hiker

## 🏆 Winning Strategies

### Speed Run Strategy
- Light Backpack (15kg)
- Minimal supplies (3-4 meals)
- No extra gear
- Move constantly, rest rarely
- High risk, fast completion

### Prepared Strategy
- Expedition Backpack (50kg)
- Full sleeping gear
- Medical supplies
- Extra food reserves
- Low risk, slower pace

### Balanced Strategy
- Advanced Backpack (25kg)
- Essential gear only
- Moderate food supply
- One sleeping bag + tent
- Medium risk/reward

## 🐛 Known Issues

- None currently - game is fully functional!

## 🔮 Future Enhancements

Potential features for future versions:
- Multiple mountain routes with different difficulties
- Achievement system
- Crafting system for makeshift items
- Wildlife hunting mechanics
- Weather forecast system
- Companion NPC system
- Multiple ending scenarios

## 📝 Credits

- **Game Design**: Based on survival hiking mechanics
- **Development**: Pure vanilla JavaScript implementation
- **Art**: CSS3 gradients and SVG mountains
- **Inspiration**: Real-world mountaineering challenges

## 📄 License

This game is open source and free to play, modify, and distribute.

---

## 🎮 Quick Start Guide

1. Download all files to a folder
2. Open `index.html` in your browser
3. Buy a backpack and supplies
4. Survive the 100km journey!

**Good luck, adventurer. The mountain awaits.**

---

*For detailed game mechanics, see `setting.md`*
