# General Settings

- A hiking game featuring a shop system, random events, and survival vitals. The game is accessible via a web browser.

# Vitals

- **Body Temperature**
    - **Effect:** Continues to drop if clothing is insufficient for the cold weather.
    - **Consequences:** Both hypothermia (low temp) and hyperthermia (high temp) result in Sanity and Stamina loss.
    - **Critical State:** Persisting abnormal temperatures lead to death.
        - Extreme low temperature: Death in 4 hours.
        - Extreme high temperature: Death in 12 hours.
    - **Recovery (Low Temp):** Build a fire (requires Stove + Gas Canister), use a Thermal Blanket, or sleep in a Tent with a Sleeping Bag.
    - **Recovery (Fever):** Cured by using a First Aid Kit.

- **Stamina (0-100)**
    - **Low Stamina (< 20):** Movement speed decreases.
    - **Zero Stamina:** Player becomes immobile. Death occurs after 4 hours at zero stamina.
    - **Drain:** Decreases while moving. Heavier loads cause rapid depletion. Drain rate increases with severe hunger, bad weather, or high altitude.
    - **Recovery:** Rest (small amount) or Sleep (large amount).
    - **Penalty:** Stamina drops significantly if the player does not sleep for more than 1 day.

- **Sanity (0-100)**
    - **Low Sanity (< 20):** Movement speed decreases; chance of injury increases.
    - **Zero Sanity:** Instant death.
    - **Drain:** Decreases upon encountering a corpse, prolonged hunger, or sleep deprivation (> 1 day).
    - **Recovery:** Encountering a living human (high amount), eating specific foods, or sleeping (medium amount).

- **Fullness (0-100)**
    - **Low Fullness (< 20):** Movement speed decreases.
    - **Drain:** Decreases while moving (heavier loads increase drain rate).
    - **Zero Fullness:** Death occurs in 3 days. Causes rapid body temperature loss. More than one day at zero fullness results in immobility.
    - **Recovery:** Eating food.

- **Load**
    - **Capacity:** Maximum load is determined by the backpack purchased.
    - **Penalty:** Heavier loads result in slower movement speed and faster depletion of Stamina and Fullness.

# Shop

- **Initial Money:** 20,000

## Backpacks
- **Light Backpack:** Max 15kg, Weight 1.1kg | Cost: 1,200
- **Advanced Backpack:** Max 25kg, Weight 1.8kg | Cost: 2,800
- **Heavy Backpack:** Max 40kg, Weight 2.6kg | Cost: 4,500
- **Expedition Backpack:** Max 50kg, Weight 3.5kg | Cost: 6,000

## Outdoor Gear
- **Trekking Poles:** 0.48kg, 900 | Stamina drain reduced by 7.5%
- **Knee Pads:** 0.25kg, 480 | Stamina drain reduced by 5%
- **Tent:** 2.8kg, 5,800 | Required for sleeping outdoors
- **Waterproof Jacket:** 0.3kg, 200 | Waterproof and windproof
- **Goggles:** 0.12kg, 600 | Prevents snow blindness
- **Gloves:** 0.25kg, 800
- **Windproof Mask:** 0.1kg, 420
- **-10° Sleeping Bag:** 0.95kg, 1,800 | Min temp: -10°
- **-20° Sleeping Bag:** 1.3kg, 3,200 | Min temp: -20°
- **-30° Sleeping Bag:** 1.7kg, 4,800 | Min temp: -30°
- **-40° Sleeping Bag:** 2.2kg, 6,800 | Min temp: -40°
- **Headlamp:** 0.15kg, 650
- **Crampons:** 0.8kg, 600
- **Climbing Ropes:** 1.5kg, 800
- **Thermal Blanket:** 0.18kg, 80 | Single-use item

## Supplies
- **Compressed Biscuits:** 0.5kg, 120 | +40 Fullness
- **MRE (Meal, Ready-to-Eat):** 0.8kg, 200 | +60 Fullness, +30 Sanity (Requires Stove + Gas Canister)
- **Gas Canister:** 0.35kg, 60 | Single-use fuel
- **Stove:** 0.35kg, 800 | Reusable cooking tool
- **First Aid Kit:** 0.6kg, 450 | Single-use medical item

# Special States

- **Tired:** (Stamina < 20) Decreased movement speed.
- **Delirious:** (Sanity < 20) Decreased movement speed, increased injury chance.
- **Hungry:** (Fullness < 20) Decreased movement speed.
- **Wet:** Occurs on rainy days without a Waterproof Jacket. Causes rapid body temperature loss. Auto-expires in 5 hours.
- **Poisoned:** Chance to occur when eating wild fruit. Causes sudden 15-point Stamina loss, accelerates Stamina drain, and decreases movement speed for 5 hours. Cured via First Aid Kit.
- **Frostbite:** Occurs if sleeping when ambient temp is lower than Sleeping Bag rating, if body temp is critical, or if moving in sub-zero temps without Gloves/Mask. Causes sudden 15-point Stamina loss, accelerates Stamina drain, and decreases movement speed. **Does not expire automatically**; requires First Aid Kit + normal body temperature to cure.

# Random Events

- **Find Wild Fruit:**
    - Choice: Eat or Ignore.
    - Outcome: If eaten, +10 Fullness. 25% chance to gain "Poisoned" state.
- **Encounter Wild Animal:**
    - Choice: Approach or Leave.
    - Outcome: If approached, 25% chance to lose 15 Stamina (attacked), 25% chance to gain 15 Sanity (petting/observing).
- **Encounter Injured Hiker:**
    - **Context:** There is no phone signal in the mountains. The player must physically reach the Rescue Point to summon help.
    - **Step 1: Immediate Aid**
        - Choice: Provide 1 Compressed Biscuit OR 1 First Aid Kit.
        - **If nothing is provided:** The hiker dies from their injuries. Player loses 20 Sanity. Event ends.
    - **Step 2: The Promise**
        - Choice: Agree to hike to the Rescue Point to summon the team?
        - **If refused:** The hiker dies of exposure. Player loses 20 Sanity. Event ends.
    - **Step 3: Provisions**
        - **Context:** The rescue team will take time to return. The hiker needs food to survive the wait (1 biscuit per day for 3 days).
        - Choice: Leave 3 *additional* Compressed Biscuits?
        - **If No:** The rescue team eventually finds the hiker, but they have starved to death. No Reward.
    - **Step 4: The Race (Condition)**
        - **If Yes (Biscuits provided):** The player must reach the Rescue Point within **2 Days (48 hours)**.
        - **Outcome A (Arrive > 2 Days):** The rescue team arrives too late. The hiker is found dead.
        - **Outcome B (Arrive ≤ 2 Days):** The hiker survives and is rescued. **Reward:** 50,000 Money.
- **Find Trash:**
    - Choice: Pick up or Ignore.
    - Outcome: If picked up, adds 0.5kg load. Player receives 500 money per 0.5kg of trash upon surviving the level.
- **Desperate Measures**
    - **Trigger Conditions:** 
        1. Player Stamina is **< 20**.
        2. Player has at least **1 "Trash" item** in inventory.
    - **Context:** You are exhausted. Your legs are heavy, and every ounce of weight feels like a boulder. You look at the useless junk in your pack.
    - **Choice:** Dump all Trash items?
        - **Option A: Keep it (Respect Nature)**
            - **Effect:** No change in inventory.
            - **Consequence:** Lose 2 Sanity (The stress of carrying useless weight while dying).
        - **Option B: Throw it away (Survival First)**
            - **Effect:** All items tagged as "Trash" are removed from inventory.
            - **Benefit:** 
                - Load is reduced immediately.
                - Regain **+5 Stamina** (Relief from the weight).
            - **Consequence:** 
                - Lose **5 Sanity** (Guilt for polluting the pristine mountain).

# Speed Mechanics

- **Baseline:** The player can walk 15km per day with a 25kg load.