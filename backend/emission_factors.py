"""
Predefined scientific carbon emission factors based on EPA, DEFRA, and IPCC methodologies.
Units: kg CO2 equivalent (kg CO2e) per relevant unit.
"""

# Transportation Factors (kg CO2e per km)
TRANSPORT_FACTORS = {
    # Car by fuel type (average passenger vehicle)
    "car_petrol": 0.192,       # Petrol / Gasoline car (DEFRA average)
    "car_diesel": 0.171,       # Diesel car
    "car_hybrid": 0.109,       # Hybrid petrol/electric
    "car_ev": 0.053,           # Battery Electric Vehicle (accounting for grid generation)
    "motorcycle": 0.103,       # Average motorbike / scooter
    
    # Public transit (per passenger-km)
    "bus": 0.089,              # Urban/commuter transit bus
    "train_metro": 0.035,      # Electric train, subway, metro
    
    # Active travel
    "bicycle": 0.0,            # Zero direct emissions
    "walking": 0.0,            # Zero direct emissions
    
    # Aviation (per passenger-km, including radiative forcing)
    "flight_domestic": 0.255,  # Short haul / domestic (< 1500 km)
    "flight_international": 0.150 # Long haul (> 1500 km)
}

# Energy & Electricity Factors
ENERGY_FACTORS = {
    # Electricity per kWh (Grid average)
    "electricity_grid": 0.475,  # Global / US mixed grid average kg CO2e / kWh
    "electricity_green": 0.020, # 100% renewable / rooftop solar lifecycle kg CO2e / kWh
    
    # Heating & Cooking
    "natural_gas_kwh": 0.185,   # Natural gas per kWh equivalent
    "lpg_cylinder_kg": 2.98,    # Liquefied Petroleum Gas per kg
    "heating_oil_liter": 2.68   # Domestic heating oil per liter
}

# Food Consumption Factors (kg CO2e per person per day)
FOOD_FACTORS = {
    # Diet types (University of Oxford / Scarborough et al. dietary impact study)
    "high_meat": 7.19,     # >100g meat/day (~2,624 kg/year)
    "medium_meat": 5.63,   # 50-100g meat/day (~2,055 kg/year)
    "low_meat": 4.67,      # <50g meat/day (~1,705 kg/year)
    "pescatarian": 3.91,   # Fish & seafood, no meat (~1,427 kg/year)
    "vegetarian": 3.81,    # Dairy and eggs, no meat/fish (~1,391 kg/year)
    "vegan": 2.89,         # 100% plant-based (~1,055 kg/year)
}

# Food Sourcing & Waste modifiers
FOOD_MODIFIERS = {
    "local_seasonal_discount": 0.12,  # 12% reduction for local/seasonal sourcing
    "high_processed_penalty": 0.15,   # 15% increase for heavy ultra-processed food
    "zero_waste_discount": 0.08       # 8% reduction for rigorous zero-waste pantry
}

# Waste Generation Factors
WASTE_FACTORS = {
    # Municipal solid waste to landfill (kg CO2e per kg or bag)
    "landfill_per_kg": 0.58,          # Methane & decomposition per kg
    "trash_bag_standard_kg": 4.5,     # Average weight of standard kitchen trash bag
    "trash_bag_co2": 2.61,            # 4.5 kg * 0.58 kg CO2e
    
    # Reductions through eco-friendly waste management
    "recycling_saving_per_kg": 0.40,  # Avoided emissions by recycling paper, plastic, glass, metal
    "composting_saving_per_kg": 0.22  # Avoided methane emissions by aerobic composting
}

# Reference Benchmark Averages (kg CO2e per person per year)
BENCHMARKS = {
    "global_average_annual": 4800,    # ~4.8 metric tons per person / year
    "us_average_annual": 14500,       # ~14.5 metric tons per person / year
    "eu_average_annual": 6800,        # ~6.8 metric tons per person / year
    "paris_agreement_target": 2000,   # 2.0 metric tons per person / year (sustainable target for 2030)
    "mature_tree_absorption_yr": 22   # 1 mature tree absorbs ~22 kg CO2e / year
}


def calculate_transport_emissions(data):
    """
    data format:
    {
        "car_type": "car_petrol" | "car_diesel" | "car_hybrid" | "car_ev" | "none",
        "car_km_per_week": float,
        "carpool_passengers": int (>=1),
        "bus_km_per_week": float,
        "train_km_per_week": float,
        "flights_domestic_hours_yr": float (~750 km/hr),
        "flights_intl_hours_yr": float (~850 km/hr)
    }
    Returns: dict with monthly and annual kg CO2e
    """
    car_type = data.get("car_type", "car_petrol")
    car_km_wk = float(data.get("car_km_per_week", 0) or 0)
    carpool = max(1, int(data.get("carpool_passengers", 1) or 1))
    bus_km_wk = float(data.get("bus_km_per_week", 0) or 0)
    train_km_wk = float(data.get("train_km_per_week", 0) or 0)
    flight_dom_hrs = float(data.get("flights_domestic_hours_yr", 0) or 0)
    flight_intl_hrs = float(data.get("flights_intl_hours_yr", 0) or 0)
    
    car_factor = TRANSPORT_FACTORS.get(car_type, 0.0) if car_type != "none" else 0.0
    
    # Weekly car CO2 / passengers
    car_weekly_co2 = (car_km_wk * car_factor) / carpool
    bus_weekly_co2 = bus_km_wk * TRANSPORT_FACTORS["bus"]
    train_weekly_co2 = train_km_wk * TRANSPORT_FACTORS["train_metro"]
    
    # Annual flight CO2 (assume 750 km/h domestic, 850 km/h intl)
    flight_dom_co2 = (flight_dom_hrs * 750) * TRANSPORT_FACTORS["flight_domestic"]
    flight_intl_co2 = (flight_intl_hrs * 850) * TRANSPORT_FACTORS["flight_international"]
    flight_annual_co2 = flight_dom_co2 + flight_intl_co2
    
    weekly_transit_co2 = car_weekly_co2 + bus_weekly_co2 + train_weekly_co2
    annual_transit_co2 = (weekly_transit_co2 * 52) + flight_annual_co2
    monthly_transit_co2 = annual_transit_co2 / 12
    
    return {
        "annual": round(annual_transit_co2, 2),
        "monthly": round(monthly_transit_co2, 2),
        "breakdown": {
            "car": round((car_weekly_co2 * 52), 2),
            "public_transit": round(((bus_weekly_co2 + train_weekly_co2) * 52), 2),
            "flights": round(flight_annual_co2, 2)
        }
    }


def calculate_energy_emissions(data):
    """
    data format:
    {
        "electricity_kwh_per_month": float,
        "clean_energy_percentage": float (0-100),
        "natural_gas_therms_month": float (1 therm ~ 29.3 kWh),
        "lpg_cylinders_year": float (average 14.2 kg cylinder),
        "household_members": int (>=1)
    }
    """
    kwh_month = float(data.get("electricity_kwh_per_month", 0) or 0)
    clean_pct = min(100, max(0, float(data.get("clean_energy_percentage", 0) or 0))) / 100.0
    gas_therms_month = float(data.get("natural_gas_therms_month", 0) or 0)
    lpg_year = float(data.get("lpg_cylinders_year", 0) or 0)
    household_members = max(1, int(data.get("household_members", 1) or 1))
    
    # Blended electricity factor based on clean energy share
    effective_elec_factor = (clean_pct * ENERGY_FACTORS["electricity_green"]) + ((1.0 - clean_pct) * ENERGY_FACTORS["electricity_grid"])
    monthly_elec_co2 = kwh_month * effective_elec_factor
    
    # 1 therm natural gas = 29.3 kWh gas equivalent
    monthly_gas_co2 = (gas_therms_month * 29.3) * ENERGY_FACTORS["natural_gas_kwh"]
    
    # LPG per year (14.2 kg per standard domestic cylinder)
    annual_lpg_co2 = (lpg_year * 14.2) * ENERGY_FACTORS["lpg_cylinder_kg"]
    
    # Total household energy per year
    annual_household_co2 = ((monthly_elec_co2 + monthly_gas_co2) * 12) + annual_lpg_co2
    
    # Per-person share
    annual_per_person = annual_household_co2 / household_members
    monthly_per_person = annual_per_person / 12
    
    return {
        "annual": round(annual_per_person, 2),
        "monthly": round(monthly_per_person, 2),
        "breakdown": {
            "electricity": round((monthly_elec_co2 * 12) / household_members, 2),
            "heating_gas": round(((monthly_gas_co2 * 12) + annual_lpg_co2) / household_members, 2)
        }
    }


def calculate_food_emissions(data):
    """
    data format:
    {
        "diet_type": "high_meat" | "medium_meat" | "low_meat" | "pescatarian" | "vegetarian" | "vegan",
        "locally_sourced": bool,
        "food_waste_frequency": "rarely" | "sometimes" | "often",
        "packaged_processed": "low" | "medium" | "high"
    }
    """
    diet = data.get("diet_type", "medium_meat")
    daily_base = FOOD_FACTORS.get(diet, FOOD_FACTORS["medium_meat"])
    
    multiplier = 1.0
    if data.get("locally_sourced", False):
        multiplier -= FOOD_MODIFIERS["local_seasonal_discount"]
        
    waste_freq = data.get("food_waste_frequency", "sometimes")
    if waste_freq == "rarely":
        multiplier -= FOOD_MODIFIERS["zero_waste_discount"]
    elif waste_freq == "often":
        multiplier += 0.15
        
    processed = data.get("packaged_processed", "medium")
    if processed == "high":
        multiplier += FOOD_MODIFIERS["high_processed_penalty"]
    elif processed == "low":
        multiplier -= 0.05
        
    multiplier = max(0.5, multiplier)
    annual_food_co2 = (daily_base * multiplier) * 365.25
    monthly_food_co2 = annual_food_co2 / 12
    
    return {
        "annual": round(annual_food_co2, 2),
        "monthly": round(monthly_food_co2, 2),
        "breakdown": {
            "diet_baseline": round(daily_base * 365.25, 2),
            "lifestyle_adjusted": round(annual_food_co2, 2)
        }
    }


def calculate_waste_emissions(data):
    """
    data format:
    {
        "trash_bags_per_week": float,
        "recycle_paper_plastic": bool,
        "recycle_glass_metal": bool,
        "compost_organic": bool,
        "household_members": int
    }
    """
    bags_per_week = float(data.get("trash_bags_per_week", 2) or 2)
    recycle_paper_plastic = bool(data.get("recycle_paper_plastic", False))
    recycle_glass_metal = bool(data.get("recycle_glass_metal", False))
    compost = bool(data.get("compost_organic", False))
    household_members = max(1, int(data.get("household_members", 1) or 1))
    
    # Base landfill emissions per week
    weekly_landfill_co2 = bags_per_week * WASTE_FACTORS["trash_bag_co2"]
    
    # Reductions
    weekly_savings = 0.0
    if recycle_paper_plastic:
        weekly_savings += 1.5 * WASTE_FACTORS["recycling_saving_per_kg"]
    if recycle_glass_metal:
        weekly_savings += 1.2 * WASTE_FACTORS["recycling_saving_per_kg"]
    if compost:
        weekly_savings += 2.0 * WASTE_FACTORS["composting_saving_per_kg"]
        
    net_weekly = max(0.2, weekly_landfill_co2 - weekly_savings)
    annual_waste_co2 = (net_weekly * 52) / household_members
    monthly_waste_co2 = annual_waste_co2 / 12
    annual_savings_co2 = (weekly_savings * 52) / household_members
    
    return {
        "annual": round(annual_waste_co2, 2),
        "monthly": round(monthly_waste_co2, 2),
        "annual_savings": round(annual_savings_co2, 2),
        "breakdown": {
            "gross_waste": round((weekly_landfill_co2 * 52) / household_members, 2),
            "diversion_savings": round(annual_savings_co2, 2)
        }
    }


def calculate_full_footprint(inputs):
    """
    Aggregates all 4 pillars and returns comprehensive footprint analytics.
    """
    transport = calculate_transport_emissions(inputs.get("transport", {}))
    energy = calculate_energy_emissions(inputs.get("energy", {}))
    food = calculate_food_emissions(inputs.get("food", {}))
    waste = calculate_waste_emissions(inputs.get("waste", {}))
    
    total_annual = transport["annual"] + energy["annual"] + food["annual"] + waste["annual"]
    total_monthly = round(total_annual / 12, 2)
    total_daily = round(total_annual / 365.25, 2)
    
    # Tree equivalence: 1 mature tree absorbs ~22 kg CO2 / year
    trees_needed = round(total_annual / BENCHMARKS["mature_tree_absorption_yr"], 1)
    
    # Benchmark comparisons
    vs_global_avg = round(((total_annual - BENCHMARKS["global_average_annual"]) / BENCHMARKS["global_average_annual"]) * 100, 1)
    vs_paris_target = round(((total_annual - BENCHMARKS["paris_agreement_target"]) / BENCHMARKS["paris_agreement_target"]) * 100, 1)
    
    # Category percentages
    categories = {
        "transport": round(transport["annual"], 2),
        "energy": round(energy["annual"], 2),
        "food": round(food["annual"], 2),
        "waste": round(waste["annual"], 2)
    }
    
    pct_breakdown = {}
    for cat, val in categories.items():
        pct_breakdown[cat] = round((val / total_annual * 100) if total_annual > 0 else 0, 1)
        
    return {
        "summary": {
            "total_annual_co2_kg": round(total_annual, 2),
            "total_monthly_co2_kg": total_monthly,
            "total_daily_co2_kg": total_daily,
            "trees_needed_to_offset": trees_needed,
            "vs_global_avg_pct": vs_global_avg,
            "vs_paris_target_pct": vs_paris_target,
            "rating": get_footprint_rating(total_annual)
        },
        "pillars": {
            "transport": transport,
            "energy": energy,
            "food": food,
            "waste": waste
        },
        "percentage_breakdown": pct_breakdown
    }


def get_footprint_rating(annual_kg):
    if annual_kg <= 2500:
        return {"grade": "A+", "label": "Eco Hero", "color": "#10b981", "desc": "Outstanding! Your footprint is close to the Paris 2030 Climate Goal."}
    elif annual_kg <= 4500:
        return {"grade": "A", "label": "Planet Protector", "color": "#059669", "desc": "Great job! Below the global average footprint."}
    elif annual_kg <= 7500:
        return {"grade": "B", "label": "Conscious Citizen", "color": "#f59e0b", "desc": "Moderate impact. Solid opportunities to cut emissions further."}
    elif annual_kg <= 12000:
        return {"grade": "C", "label": "High Impact", "color": "#f97316", "desc": "Higher than average emissions. Great potential for eco savings."}
    else:
        return {"grade": "D", "label": "Critical Reducer", "color": "#ef4444", "desc": "Very heavy footprint. Actionable changes can slash tons of CO2."}
