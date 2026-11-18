"""
Seed initial challenges, badges, community users, and demo user data.
"""

from datetime import datetime, timedelta
import json
import random
from database import get_db, init_db, hash_password

CHALLENGES = [
    {
        "code": "bike_commute",
        "title": "Pedal Power Commute",
        "description": "Replace a car trip with cycling or walking for at least 5 km today.",
        "category": "transport",
        "points": 50,
        "co2_saved_kg": 1.9,
        "difficulty": "Medium",
        "duration": "Daily",
        "icon": "Bike"
    },
    {
        "code": "public_transit_day",
        "title": "Transit Explorer",
        "description": "Take the metro, bus, or train instead of driving solo.",
        "category": "transport",
        "points": 35,
        "co2_saved_kg": 1.2,
        "difficulty": "Easy",
        "duration": "Daily",
        "icon": "Bus"
    },
    {
        "code": "meatless_day",
        "title": "Meatless Monday & Beyond",
        "description": "Enjoy delicious 100% plant-based or vegetarian meals for an entire day.",
        "category": "food",
        "points": 45,
        "co2_saved_kg": 3.4,
        "difficulty": "Easy",
        "duration": "Daily",
        "icon": "Salad"
    },
    {
        "code": "local_harvest",
        "title": "Zero Food Miles",
        "description": "Cook a dinner where all fresh produce was grown locally within 100 km.",
        "category": "food",
        "points": 40,
        "co2_saved_kg": 1.5,
        "difficulty": "Medium",
        "duration": "Weekly",
        "icon": "Apple"
    },
    {
        "code": "vampire_power",
        "title": "Vampire Power Hunt",
        "description": "Unplug standby electronics, chargers, and appliances before heading to bed.",
        "category": "energy",
        "points": 30,
        "co2_saved_kg": 0.8,
        "difficulty": "Easy",
        "duration": "Daily",
        "icon": "ZapOff"
    },
    {
        "code": "natural_climate",
        "title": "Thermostat Discipline",
        "description": "Adjust your AC/heating by 2°C (cooler in winter, warmer in summer) for 24 hours.",
        "category": "energy",
        "points": 40,
        "co2_saved_kg": 2.1,
        "difficulty": "Medium",
        "duration": "Daily",
        "icon": "Thermometer"
    },
    {
        "code": "zero_plastic",
        "title": "Single-Use Plastic Ban",
        "description": "Say NO to disposable plastic bottles, bags, and cutlery all day.",
        "category": "waste",
        "points": 35,
        "co2_saved_kg": 0.9,
        "difficulty": "Easy",
        "duration": "Daily",
        "icon": "ShoppingBag"
    },
    {
        "code": "compost_master",
        "title": "Composting Champion",
        "description": "Divert 100% of organic kitchen scraps into a compost bin instead of the trash.",
        "category": "waste",
        "points": 60,
        "co2_saved_kg": 2.5,
        "difficulty": "Medium",
        "duration": "Weekly",
        "icon": "Recycle"
    },
    {
        "code": "cold_wash",
        "title": "Cold Water Laundry",
        "description": "Wash laundry in cold water (30°C or tap cold) and hang-dry in the air.",
        "category": "energy",
        "points": 30,
        "co2_saved_kg": 1.4,
        "difficulty": "Easy",
        "duration": "Weekly",
        "icon": "Droplets"
    },
    {
        "code": "tree_guardian",
        "title": "Green Thumb Pledge",
        "description": "Plant a native tree, shrub, or window herb garden.",
        "category": "lifestyle",
        "points": 100,
        "co2_saved_kg": 22.0,
        "difficulty": "Hard",
        "duration": "Weekly",
        "icon": "Trees"
    }
]

BADGES = [
    {
        "code": "carbon_scout",
        "name": "Carbon Scout",
        "description": "Completed your first comprehensive carbon footprint calculation.",
        "icon": "Compass",
        "category": "Discovery",
        "points_required": 50,
        "tier": "Bronze"
    },
    {
        "code": "green_commuter",
        "name": "Green Commuter",
        "description": "Saved 15 kg of CO₂ through cycling, walking, or public transit.",
        "icon": "Bike",
        "category": "Transport",
        "points_required": 150,
        "tier": "Silver"
    },
    {
        "code": "energy_ninja",
        "name": "Energy Ninja",
        "description": "Completed 5 energy-saving challenges and lowered electric load.",
        "icon": "Zap",
        "category": "Energy",
        "points_required": 250,
        "tier": "Silver"
    },
    {
        "code": "plant_pioneer",
        "name": "Plant Pioneer",
        "description": "Embraced sustainable plant-forward dietary habits.",
        "icon": "Leaf",
        "category": "Food",
        "points_required": 350,
        "tier": "Gold"
    },
    {
        "code": "zero_waste_hero",
        "name": "Zero Waste Hero",
        "description": "Consistently reduced landfill waste and mastered composting.",
        "icon": "Recycle",
        "category": "Waste",
        "points_required": 500,
        "tier": "Gold"
    },
    {
        "code": "streak_titan",
        "name": "Streak Titan",
        "description": "Maintained an active eco-habit streak for 14 consecutive days.",
        "icon": "Flame",
        "category": "Consistency",
        "points_required": 700,
        "tier": "Emerald"
    },
    {
        "code": "climate_champion",
        "name": "Climate Champion",
        "description": "Achieved overall carbon reduction exceeding 500 kg CO₂e.",
        "icon": "Trophy",
        "category": "Milestone",
        "points_required": 1000,
        "tier": "Emerald"
    }
]

LEADERBOARD_USERS = [
    {"name": "Elena Rostova", "email": "elena@example.com", "points": 1420, "streak": 28, "savings": 412.5, "avatar": "sun"},
    {"name": "Marcus Chen", "email": "marcus@example.com", "points": 1280, "streak": 21, "savings": 374.0, "avatar": "bike"},
    {"name": "Sarah Jenkins", "email": "sarah@example.com", "points": 1150, "streak": 19, "savings": 329.8, "avatar": "trees"},
    {"name": "Devon Patel", "email": "devon@example.com", "points": 940, "streak": 14, "savings": 281.2, "avatar": "droplets"},
    {"name": "Sophia Kim", "email": "sophia@example.com", "points": 830, "streak": 11, "savings": 245.0, "avatar": "wind"},
    {"name": "Lucas Silva", "email": "lucas@example.com", "points": 620, "streak": 8, "savings": 190.4, "avatar": "shield"},
]


def seed_database():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    # Seed challenges
    for ch in CHALLENGES:
        cursor.execute("""
            INSERT OR IGNORE INTO challenges (code, title, description, category, points, co2_saved_kg, difficulty, duration, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (ch["code"], ch["title"], ch["description"], ch["category"], ch["points"], ch["co2_saved_kg"], ch["difficulty"], ch["duration"], ch["icon"]))

    # Seed badges
    for b in BADGES:
        cursor.execute("""
            INSERT OR IGNORE INTO badges (code, name, description, icon, category, points_required, tier)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (b["code"], b["name"], b["description"], b["icon"], b["category"], b["points_required"], b["tier"]))

    # Seed leaderboard community users
    now = datetime.now()
    for lu in LEADERBOARD_USERS:
        cursor.execute("SELECT id FROM users WHERE email = ?", (lu["email"],))
        existing = cursor.fetchone()
        if not existing:
            cursor.execute("""
                INSERT INTO users (name, email, password_hash, points, streak_days, last_active_date, avatar, target_reduction_pct, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 30, ?)
            """, (lu["name"], lu["email"], hash_password("secret123"), lu["points"], lu["streak"], (now - timedelta(days=1)).strftime("%Y-%m-%d"), lu["avatar"], (now - timedelta(days=45)).isoformat()))

    # Seed Demo User: "Alex Green"
    demo_email = "alex@carbonless.org"
    cursor.execute("SELECT id FROM users WHERE email = ?", (demo_email,))
    demo = cursor.fetchone()
    
    if not demo:
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, points, streak_days, last_active_date, avatar, bio, target_reduction_pct, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "Alex Green",
            demo_email,
            hash_password("password123"),
            580, # eco points
            12,  # streak
            now.strftime("%Y-%m-%d"),
            "leaf",
            "Passionate about zero-waste living & public transit. Aiming for 30% reduction this year!",
            30,
            (now - timedelta(days=60)).isoformat()
        ))
        demo_user_id = cursor.lastrowid
    else:
        demo_user_id = demo["id"]

    # Seed demo user initial calculation if none exists
    cursor.execute("SELECT id FROM emission_logs WHERE user_id = ?", (demo_user_id,))
    if not cursor.fetchone():
        sample_inputs = {
            "transport": {
                "car_type": "car_hybrid",
                "car_km_per_week": 90,
                "carpool_passengers": 1,
                "bus_km_per_week": 35,
                "train_km_per_week": 50,
                "flights_domestic_hours_yr": 3,
                "flights_intl_hours_yr": 4
            },
            "energy": {
                "electricity_kwh_per_month": 240,
                "clean_energy_percentage": 25,
                "natural_gas_therms_month": 12,
                "lpg_cylinders_year": 0,
                "household_members": 2
            },
            "food": {
                "diet_type": "low_meat",
                "locally_sourced": True,
                "food_waste_frequency": "rarely",
                "packaged_processed": "low"
            },
            "waste": {
                "trash_bags_per_week": 1.5,
                "recycle_paper_plastic": True,
                "recycle_glass_metal": True,
                "compost_organic": True,
                "household_members": 2
            }
        }
        
        # 1650 (transport) + 820 (energy) + 1380 (food) + 120 (waste) = 3970 kg/yr
        cursor.execute("""
            INSERT INTO emission_logs (user_id, transport_annual, energy_annual, food_annual, waste_annual, total_annual, inputs_json, calculated_at)
            VALUES (?, 1650.0, 820.0, 1380.0, 120.0, 3970.0, ?, ?)
        """, (demo_user_id, json.dumps(sample_inputs), (now - timedelta(days=20)).isoformat()))

    # Seed 30 days of daily records for trends chart
    cursor.execute("SELECT COUNT(*) as count FROM daily_records WHERE user_id = ?", (demo_user_id,))
    record_count = cursor.fetchone()["count"]
    if record_count < 30:
        cursor.execute("DELETE FROM daily_records WHERE user_id = ?", (demo_user_id,))
        base_transport = 4.5
        base_energy = 2.2
        base_food = 3.8
        base_waste = 0.35
        
        for i in range(30, -1, -1):
            day_date = (now - timedelta(days=i)).strftime("%Y-%m-%d")
            # Slight declining trend showing user's progress
            factor = max(0.68, 1.0 - (30 - i) * 0.009 + (random.uniform(-0.08, 0.08)))
            t_co2 = round(base_transport * factor, 2)
            e_co2 = round(base_energy * factor, 2)
            f_co2 = round(base_food * factor, 2)
            w_co2 = round(base_waste * factor, 2)
            total = round(t_co2 + e_co2 + f_co2 + w_co2, 2)
            savings = round(max(0.4, (base_transport + base_energy + base_food + base_waste) - total + random.uniform(0.2, 0.9)), 2)
            
            cursor.execute("""
                INSERT OR REPLACE INTO daily_records (user_id, date, transport_kg, energy_kg, food_kg, waste_kg, total_kg, savings_kg)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (demo_user_id, day_date, t_co2, e_co2, f_co2, w_co2, total, savings))

    # Seed demo user challenge participation
    cursor.execute("SELECT id FROM challenges WHERE code = 'bike_commute'")
    c1 = cursor.fetchone()
    if c1:
        cursor.execute("""
            INSERT OR IGNORE INTO user_challenges (user_id, challenge_id, status, joined_at, completed_at)
            VALUES (?, ?, 'completed', ?, ?)
        """, (demo_user_id, c1["id"], (now - timedelta(days=2)).isoformat(), (now - timedelta(days=1)).isoformat()))

    cursor.execute("SELECT id FROM challenges WHERE code = 'meatless_day'")
    c2 = cursor.fetchone()
    if c2:
        cursor.execute("""
            INSERT OR IGNORE INTO user_challenges (user_id, challenge_id, status, joined_at, completed_at)
            VALUES (?, ?, 'completed', ?, ?)
        """, (demo_user_id, c2["id"], (now - timedelta(days=3)).isoformat(), (now - timedelta(days=2)).isoformat()))

    cursor.execute("SELECT id FROM challenges WHERE code = 'vampire_power'")
    c3 = cursor.fetchone()
    if c3:
        cursor.execute("""
            INSERT OR IGNORE INTO user_challenges (user_id, challenge_id, status, joined_at, completed_at)
            VALUES (?, ?, 'in_progress', ?, NULL)
        """, (demo_user_id, c3["id"], now.isoformat()))

    # Seed badges unlocked for demo user
    cursor.execute("SELECT id FROM badges WHERE code IN ('carbon_scout', 'green_commuter', 'energy_ninja')")
    earned_badges = cursor.fetchall()
    for b in earned_badges:
        cursor.execute("""
            INSERT OR IGNORE INTO user_badges (user_id, badge_id, unlocked_at)
            VALUES (?, ?, ?)
        """, (demo_user_id, b["id"], (now - timedelta(days=5)).isoformat()))

    # Seed adopted recommendations
    sample_recs = [
        ("rec_transit", "Switch 2 drive days to Metro/Bus", "transport", 480.0),
        ("rec_led", "Upgrade all bulbs to 9W LEDs", "energy", 120.0),
        ("rec_food_waste", "Meal planning to eliminate perishables waste", "food", 185.0)
    ]
    for r_id, r_title, r_cat, r_sav in sample_recs:
        cursor.execute("""
            INSERT OR IGNORE INTO adopted_recommendations (user_id, rec_id, title, category, annual_co2_saving_kg, status, adopted_at)
            VALUES (?, ?, ?, ?, ?, 'active', ?)
        """, (demo_user_id, r_id, r_title, r_cat, r_sav, (now - timedelta(days=10)).isoformat()))

    conn.commit()
    conn.close()
    print("Database initialized and seeded successfully!")


if __name__ == "__main__":
    seed_database()
