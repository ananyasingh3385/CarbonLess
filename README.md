# CarbonLess 🌍
> **Tagline: Track Your Impact. Reduce Your Carbon. Save Our Planet.**

CarbonLess is a modern, responsive, eco-friendly web application designed to help individuals, households, and communities calculate, monitor, and aggressively reduce their carbon footprint.

---

## 🌿 Key Features

1. **Live Dashboard**
   - Displays total annual CO₂ emissions (in tonnes and kg), daily rate, monthly footprint, and carbon avoided.
   - Interactive Recharts area chart displaying 30-day daily emissions and eco-savings trends.
   - Interactive Donut chart displaying breakdown across the 4 core pillars: Transportation, Electricity & Energy, Food Habits, and Waste Generation.
   - Climate status grade badge (A+ Eco Hero, A Planet Protector, B Conscious Citizen, C High Impact, D Critical Reducer).
   - Dynamic tree absorption equivalence (1 mature tree ≈ 22 kg CO₂/year).

2. **Scientific Carbon Calculator**
   - **Transportation**: Car types (Petrol, Diesel, Hybrid, EV, None), weekly commute kilometers, carpool split, bus travel, train/subway commute, and annual domestic/international flights.
   - **Electricity & Energy**: Monthly kWh electricity, clean renewable/solar grid percentage, natural gas therms, LPG cylinders, and household size divider.
   - **Food Habits**: Oxford/IPCC dietary patterns (High meat, Medium meat, Flexitarian, Pescatarian, Vegetarian, Vegan), local/seasonal sourcing discounts, food waste frequency, and ultra-processed food modifiers.
   - **Waste Generation**: Kitchen trash bags/week, recycling toggles (paper/plastic, glass/metal), and aerobic home composting methane diversion.
   - Real-time calculations with instant live sidebar feedback.
   - "Save to Profile" stores calculation to SQLite, awards **+50 Eco-Points**, logs to daily trends, and automatically evaluates achievement badges.

3. **Smart AI Recommendations**
   - Dynamically analyzes the user's highest emitting category to prioritize actionable solutions.
   - Displays estimated CO₂ savings in kg/year, impact level (High, Medium, Low), difficulty, and financial savings payback.
   - One-click "Commit to Action" awards **+25 Eco-Points** and tracks cumulative potential reductions.

4. **Gamified Eco Challenges**
   - Daily & weekly micro-missions: Pedal Power Commute, Transit Explorer, Meatless Monday & Beyond, Vampire Power Hunt, Thermostat Discipline, Single-Use Plastic Ban, Composting Champion, Cold Water Laundry, and Green Thumb Pledge.
   - Tracks habit streaks (`streak_days`) and awards bonus points upon completion.

5. **Rewards & Leaderboards**
   - Eco-points balance and tier progression (Bronze, Silver, Gold, Emerald).
   - Achievement Badges: *Carbon Scout*, *Green Commuter*, *Energy Ninja*, *Plant Pioneer*, *Zero Waste Hero*, *Streak Titan*, and *Climate Champion*.
   - Community Leaderboard ranking eco warriors by verified CO₂ avoided and points.

6. **Audit Reports & Analytics**
   - Weekly comparison across the past 4 weeks (emissions vs savings).
   - Monthly 6-month historical trajectory.
   - Reduction statistics: mature trees equivalent, car miles avoided, and clean energy kWh equivalent.
   - One-click JSON export and printable PDF audit ledger.

7. **Authentication & User Profile**
   - Secure token authentication (Registration, Login, Demo Login, and Profile Management).
   - 1-Click "Demo Mode" as **Alex Green** with rich pre-seeded historical data.
   - Customizable avatar personas (Leaf, Cyclist, Solar, Water, Forest, Clean Wind) and target reduction goal setting.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (v18), Vite, Tailwind CSS, Lucide React Icons, Recharts, Canvas Confetti
- **Backend**: Python 3 Flask, RESTful API
- **Database**: SQLite3 (`carbonless.db`) with schema migrations & seeding
- **Carbon Factors**: Predefined scientific constants based on EPA, UK DEFRA GHG Conversion Factors, and IPCC 6th Assessment Guidelines.

---

## 🚀 Running the Application

### 1. Unified Flask Server (API + Built Frontend)
```bash
cd backend
python3 app.py
```
Open **`http://127.0.0.1:5001`** in any web browser.

### 2. Frontend Development Server (Hot Reloading)
```bash
cd frontend
npm run dev
```
Open **`http://127.0.0.1:3000`** in any web browser (proxies `/api` to Flask on `5001`).

---

## 👤 Demo Account Credentials
- **One-Click Demo Button**: Available directly in the navigation bar & login page.
- **Email**: `alex@carbonless.org`
- **Password**: `password123`
