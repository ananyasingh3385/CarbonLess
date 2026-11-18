import React, { useState, useEffect } from 'react';
import {
  Car,
  Zap,
  Salad,
  Trash2,
  Calculator as CalcIcon,
  Sparkles,
  Save,
  Info,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Plane,
  Bus,
  Bike,
  Trees,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Calculator({ setActiveTab }) {
  const { user, showNotification } = useAuth();

  // Active step / tab in the calculator: 'all', 'transport', 'energy', 'food', 'waste'
  const [activeStep, setActiveStep] = useState('transport');
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    transport: {
      car_type: 'car_hybrid',
      car_km_per_week: 80,
      carpool_passengers: 1,
      bus_km_per_week: 30,
      train_km_per_week: 40,
      flights_domestic_hours_yr: 2,
      flights_intl_hours_yr: 4,
    },
    energy: {
      electricity_kwh_per_month: 250,
      clean_energy_percentage: 20,
      natural_gas_therms_month: 10,
      lpg_cylinders_year: 0,
      household_members: 2,
    },
    food: {
      diet_type: 'medium_meat',
      locally_sourced: true,
      food_waste_frequency: 'sometimes',
      packaged_processed: 'medium',
    },
    waste: {
      trash_bags_per_week: 2,
      recycle_paper_plastic: true,
      recycle_glass_metal: true,
      compost_organic: true,
      household_members: 2,
    },
  });

  // Real-time calculation result
  const [result, setResult] = useState(null);

  // Update nested form fields
  const updateField = (pillar, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [pillar]: {
        ...prev[pillar],
        [field]: value,
      },
    }));
  };

  // Perform calculation via API
  const runCalculation = async () => {
    try {
      setCalculating(true);
      const res = await api.calculate(formData);
      setResult(res);
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setCalculating(false);
    }
  };

  // Run calculation whenever form values change (debounced or effect)
  useEffect(() => {
    runCalculation();
  }, [formData]);

  // Save footprint to database
  const handleSave = async () => {
    if (!user) {
      showNotification('Please sign in or use Demo Login to save calculations.', 'error');
      setActiveTab('login');
      return;
    }

    try {
      setSaving(true);
      const res = await api.saveFootprint(formData);
      showNotification(res.message || 'Carbon footprint saved! +50 Eco-Points awarded.', 'success');
      if (res.new_badges && res.new_badges.length > 0) {
        setTimeout(() => {
          showNotification(`New Badge Unlocked: ${res.new_badges.join(', ')}! 🏆`, 'success');
        }, 1500);
      }
    } catch (err) {
      console.error('Save error:', err);
      showNotification('Failed to save calculation.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Quick Presets
  const applyPreset = (presetName) => {
    if (presetName === 'eco_warrior') {
      setFormData({
        transport: {
          car_type: 'car_ev',
          car_km_per_week: 30,
          carpool_passengers: 2,
          bus_km_per_week: 50,
          train_km_per_week: 80,
          flights_domestic_hours_yr: 0,
          flights_intl_hours_yr: 0,
        },
        energy: {
          electricity_kwh_per_month: 160,
          clean_energy_percentage: 80,
          natural_gas_therms_month: 4,
          lpg_cylinders_year: 0,
          household_members: 2,
        },
        food: {
          diet_type: 'vegan',
          locally_sourced: true,
          food_waste_frequency: 'rarely',
          packaged_processed: 'low',
        },
        waste: {
          trash_bags_per_week: 1,
          recycle_paper_plastic: true,
          recycle_glass_metal: true,
          compost_organic: true,
          household_members: 2,
        },
      });
      showNotification('Eco Warrior Preset Applied! 🌿');
    } else if (presetName === 'average') {
      setFormData({
        transport: {
          car_type: 'car_petrol',
          car_km_per_week: 150,
          carpool_passengers: 1,
          bus_km_per_week: 20,
          train_km_per_week: 10,
          flights_domestic_hours_yr: 4,
          flights_intl_hours_yr: 6,
        },
        energy: {
          electricity_kwh_per_month: 350,
          clean_energy_percentage: 10,
          natural_gas_therms_month: 25,
          lpg_cylinders_year: 2,
          household_members: 3,
        },
        food: {
          diet_type: 'medium_meat',
          locally_sourced: false,
          food_waste_frequency: 'sometimes',
          packaged_processed: 'medium',
        },
        waste: {
          trash_bags_per_week: 3,
          recycle_paper_plastic: true,
          recycle_glass_metal: false,
          compost_organic: false,
          household_members: 3,
        },
      });
      showNotification('Average Household Preset Applied!');
    }
  };

  const steps = [
    { id: 'transport', label: '1. Transport', icon: Car, desc: 'Commute, cars & flights' },
    { id: 'energy', label: '2. Energy', icon: Zap, desc: 'Electricity & heating' },
    { id: 'food', label: '3. Food Habits', icon: Salad, desc: 'Diet & food sourcing' },
    { id: 'waste', label: '4. Waste', icon: Trash2, desc: 'Garbage, recycling & composting' },
  ];

  const summary = result?.summary;
  const pillars = result?.pillars;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-eco-700 bg-eco-50 px-2.5 py-1 rounded-full border border-eco-200 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>IPCC &amp; DEFRA Scientifically Verified Formula</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Carbon Footprint Calculator
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Input your weekly and monthly lifestyle habits across all 4 key emission pillars to compute your precise annual carbon footprint.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Presets:</span>
          <button
            onClick={() => applyPreset('eco_warrior')}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
          >
            🌱 Low Impact
          </button>
          <button
            onClick={() => applyPreset('average')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            🏙️ Moderate
          </button>
        </div>
      </div>

      {/* Main Grid: Form Steps (Left 2 cols) + Live Result Sticky Card (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pillar Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {steps.map((st) => {
              const Icon = st.icon;
              const isActive = activeStep === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStep(st.id)}
                  className={`flex flex-col items-center sm:items-start p-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-white text-eco-800 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-eco-600' : 'text-slate-400'}`}
                    />
                    <span className="text-xs font-bold">{st.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                    {st.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form Content Cards */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            {/* STEP 1: TRANSPORT */}
            {activeStep === 'transport' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Car className="w-5 h-5 text-eco-600" />
                    Transportation &amp; Commute
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vehicles, fuel types, public transit, and annual flights.
                  </p>
                </div>

                {/* Car Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Primary Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { id: 'car_petrol', label: 'Petrol (Gas)', factor: '0.19 kg/km' },
                      { id: 'car_diesel', label: 'Diesel', factor: '0.17 kg/km' },
                      { id: 'car_hybrid', label: 'Hybrid', factor: '0.11 kg/km' },
                      { id: 'car_ev', label: 'Electric (EV)', factor: '0.05 kg/km' },
                      { id: 'none', label: 'No Car (Transit/Walk)', factor: '0.00 kg/km' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateField('transport', 'car_type', opt.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          formData.transport.car_type === opt.id
                            ? 'border-eco-600 bg-eco-50/70 text-eco-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold leading-tight">{opt.label}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{opt.factor}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.transport.car_type !== 'none' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Car Travel: <strong>{formData.transport.car_km_per_week} km/week</strong>
                        </label>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="800"
                        step="10"
                        value={formData.transport.car_km_per_week}
                        onChange={(e) =>
                          updateField('transport', 'car_km_per_week', Number(e.target.value))
                        }
                        className="w-full accent-eco-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>0 km</span>
                        <span>400 km</span>
                        <span>800 km/wk</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Average Carpool Occupants
                      </label>
                      <select
                        value={formData.transport.carpool_passengers}
                        onChange={(e) =>
                          updateField('transport', 'carpool_passengers', Number(e.target.value))
                        }
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-eco-500"
                      >
                        <option value={1}>1 person (Solo driver)</option>
                        <option value={2}>2 persons (Split emissions by 2)</option>
                        <option value={3}>3 persons</option>
                        <option value={4}>4+ persons</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Public Transit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Bus Travel: <strong>{formData.transport.bus_km_per_week} km/week</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="5"
                      value={formData.transport.bus_km_per_week}
                      onChange={(e) =>
                        updateField('transport', 'bus_km_per_week', Number(e.target.value))
                      }
                      className="w-full accent-eco-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Train / Metro: <strong>{formData.transport.train_km_per_week} km/week</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={formData.transport.train_km_per_week}
                      onChange={(e) =>
                        updateField('transport', 'train_km_per_week', Number(e.target.value))
                      }
                      className="w-full accent-eco-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Aviation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Domestic Flights: <strong>{formData.transport.flights_domestic_hours_yr} hrs/yr</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={formData.transport.flights_domestic_hours_yr}
                      onChange={(e) =>
                        updateField('transport', 'flights_domestic_hours_yr', Number(e.target.value))
                      }
                      className="w-full accent-eco-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400">Short haul ~750 km/h</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      International Flights: <strong>{formData.transport.flights_intl_hours_yr} hrs/yr</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="2"
                      value={formData.transport.flights_intl_hours_yr}
                      onChange={(e) =>
                        updateField('transport', 'flights_intl_hours_yr', Number(e.target.value))
                      }
                      className="w-full accent-eco-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400">Long haul ~850 km/h</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep('energy')}
                    className="flex items-center gap-2 px-4 py-2 bg-eco-600 text-white rounded-xl text-xs font-bold hover:bg-eco-700 transition-colors"
                  >
                    Next: Energy Consumption <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ENERGY */}
            {activeStep === 'energy' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-eco-600" />
                    Electricity &amp; Home Energy
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Grid power, clean renewable share, natural gas, and heating.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Monthly Electricity: <strong>{formData.energy.electricity_kwh_per_month} kWh</strong>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="1500"
                      step="25"
                      value={formData.energy.electricity_kwh_per_month}
                      onChange={(e) =>
                        updateField('energy', 'electricity_kwh_per_month', Number(e.target.value))
                      }
                      className="w-full accent-eco-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Average 2-person apartment is ~250 kWh/mo</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Renewable/Solar Share: <strong>{formData.energy.clean_energy_percentage}%</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.energy.clean_energy_percentage}
                      onChange={(e) =>
                        updateField('energy', 'clean_energy_percentage', Number(e.target.value))
                      }
                      className="w-full accent-eco-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Rooftop solar or green grid tariff percentage</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Natural Gas (Therms/mo)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={formData.energy.natural_gas_therms_month}
                      onChange={(e) =>
                        updateField('energy', 'natural_gas_therms_month', Number(e.target.value))
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      LPG Cylinders / Year
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={formData.energy.lpg_cylinders_year}
                      onChange={(e) =>
                        updateField('energy', 'lpg_cylinders_year', Number(e.target.value))
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Household Members
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.energy.household_members}
                      onChange={(e) =>
                        updateField('energy', 'household_members', Number(e.target.value))
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep('transport')}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep('food')}
                    className="flex items-center gap-2 px-4 py-2 bg-eco-600 text-white rounded-xl text-xs font-bold hover:bg-eco-700"
                  >
                    Next: Food Habits <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: FOOD */}
            {activeStep === 'food' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Salad className="w-5 h-5 text-eco-600" />
                    Food Habits &amp; Nutrition
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dietary impact based on Oxford University &amp; IPCC lifecycle studies.
                  </p>
                </div>

                {/* Diet Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Dietary Pattern
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'high_meat', label: '🥩 Heavy Meat Lover', sub: '>100g meat/day (High CO₂)' },
                      { id: 'medium_meat', label: '🍗 Average Omnivore', sub: 'Regular mixed diet' },
                      { id: 'low_meat', label: '🥗 Flexitarian / Low Meat', sub: '<50g meat or 1-2 times/wk' },
                      { id: 'pescatarian', label: '🐟 Pescatarian', sub: 'Fish & seafood, no meat' },
                      { id: 'vegetarian', label: '🧀 Vegetarian', sub: 'Dairy & eggs, no meat' },
                      { id: 'vegan', label: '🌱 100% Plant-Based', sub: 'Pure vegan (~60% lower CO₂)' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateField('food', 'diet_type', opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          formData.food.diet_type === opt.id
                            ? 'border-eco-600 bg-eco-50/70 text-eco-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sourcing & Waste Modifiers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Local / Seasonal Food?
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateField('food', 'locally_sourced', true)}
                        className={`flex-1 py-2 text-xs rounded-lg border font-semibold ${
                          formData.food.locally_sourced
                            ? 'bg-eco-600 text-white border-eco-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        Yes (-12% CO₂)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('food', 'locally_sourced', false)}
                        className={`flex-1 py-2 text-xs rounded-lg border font-semibold ${
                          !formData.food.locally_sourced
                            ? 'bg-eco-600 text-white border-eco-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        Standard
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Food Waste Frequency
                    </label>
                    <select
                      value={formData.food.food_waste_frequency}
                      onChange={(e) =>
                        updateField('food', 'food_waste_frequency', e.target.value)
                      }
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700"
                    >
                      <option value="rarely">Rarely (Zero waste discipline)</option>
                      <option value="sometimes">Sometimes (Moderate scraps)</option>
                      <option value="often">Often (Regular leftovers tossed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Packaged / Processed Foods
                    </label>
                    <select
                      value={formData.food.packaged_processed}
                      onChange={(e) =>
                        updateField('food', 'packaged_processed', e.target.value)
                      }
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700"
                    >
                      <option value="low">Low (Whole foods &amp; bulk)</option>
                      <option value="medium">Medium (Standard grocery mix)</option>
                      <option value="high">High (Convenience &amp; fast foods)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep('energy')}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep('waste')}
                    className="flex items-center gap-2 px-4 py-2 bg-eco-600 text-white rounded-xl text-xs font-bold hover:bg-eco-700"
                  >
                    Next: Waste Generation <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: WASTE */}
            {activeStep === 'waste' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-eco-600" />
                    Waste Generation &amp; Recycling
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Landfill diversion, household recycling, and organic composting.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Standard Trash Bags / Week: <strong>{formData.waste.trash_bags_per_week} bags</strong>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={formData.waste.trash_bags_per_week}
                      onChange={(e) =>
                        updateField('waste', 'trash_bags_per_week', Number(e.target.value))
                      }
                      className="w-full accent-eco-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Average kitchen bin bag ≈ 4.5 kg waste</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Household Size (Sharing waste)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.waste.household_members}
                      onChange={(e) =>
                        updateField('waste', 'household_members', Number(e.target.value))
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700"
                    />
                  </div>
                </div>

                {/* Eco Practices Toggles */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Eco Waste Diverters (Reduces Net Footprint)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-eco-300">
                      <input
                        type="checkbox"
                        checked={formData.waste.recycle_paper_plastic}
                        onChange={(e) =>
                          updateField('waste', 'recycle_paper_plastic', e.target.checked)
                        }
                        className="rounded text-eco-600 focus:ring-eco-500 w-4 h-4 accent-eco-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">Recycle Paper &amp; Plastic</div>
                        <div className="text-[10px] text-slate-400">Avoids ~31 kg CO₂/yr</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-eco-300">
                      <input
                        type="checkbox"
                        checked={formData.waste.recycle_glass_metal}
                        onChange={(e) =>
                          updateField('waste', 'recycle_glass_metal', e.target.checked)
                        }
                        className="rounded text-eco-600 focus:ring-eco-500 w-4 h-4 accent-eco-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">Recycle Glass &amp; Metal</div>
                        <div className="text-[10px] text-slate-400">Avoids ~25 kg CO₂/yr</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-eco-300">
                      <input
                        type="checkbox"
                        checked={formData.waste.compost_organic}
                        onChange={(e) =>
                          updateField('waste', 'compost_organic', e.target.checked)
                        }
                        className="rounded text-eco-600 focus:ring-eco-500 w-4 h-4 accent-eco-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">Home Composting</div>
                        <div className="text-[10px] text-slate-400">Cuts landfill methane</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep('food')}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Footprint to Profile (+50 Pts)'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Live Calculation Sticky Summary Card */}
        <div className="sticky top-24 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-emerald-200/90 shadow-eco space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-eco-100 text-eco-700 flex items-center justify-center font-bold">
                  <CalcIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Carbon Impact</h3>
                  <span className="text-[10px] text-slate-400 font-medium">Real-time estimate</span>
                </div>
              </div>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: summary?.rating?.color || '#059669' }}
              >
                {summary?.rating?.grade || 'A'} &bull; {summary?.rating?.label || 'Good'}
              </span>
            </div>

            {/* Grand Total Display */}
            <div className="text-center py-2 bg-gradient-to-br from-emerald-50/50 to-teal-50/40 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Annual Footprint
              </span>
              <div className="text-4xl font-black text-slate-900 tracking-tight mt-1">
                {summary ? (summary.total_annual_co2_kg / 1000).toFixed(2) : '3.97'}
                <span className="text-base font-semibold text-slate-500 ml-1">t CO₂e</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ≈ {summary ? summary.total_annual_co2_kg.toLocaleString() : '3,970'} kg / year
              </p>
            </div>

            {/* Pillar Breakdown Micro-bars */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Pillar Breakdown
              </span>

              {/* Transport */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Car className="w-3.5 h-3.5 text-emerald-600" /> Transport
                  </span>
                  <span className="font-bold text-slate-900">
                    {pillars?.transport?.annual || 0} kg
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        ((pillars?.transport?.annual || 0) / (summary?.total_annual_co2_kg || 1)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Energy */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Zap className="w-3.5 h-3.5 text-teal-600" /> Electricity &amp; Gas
                  </span>
                  <span className="font-bold text-slate-900">
                    {pillars?.energy?.annual || 0} kg
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        ((pillars?.energy?.annual || 0) / (summary?.total_annual_co2_kg || 1)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Food */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Salad className="w-3.5 h-3.5 text-green-500" /> Food &amp; Diet
                  </span>
                  <span className="font-bold text-slate-900">{pillars?.food?.annual || 0} kg</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        ((pillars?.food?.annual || 0) / (summary?.total_annual_co2_kg || 1)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Waste */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Trash2 className="w-3.5 h-3.5 text-emerald-400" /> Waste &amp; Landfill
                  </span>
                  <span className="font-bold text-slate-900">{pillars?.waste?.annual || 0} kg</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        ((pillars?.waste?.annual || 0) / (summary?.total_annual_co2_kg || 1)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Tree Equivalence Callout */}
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {summary?.trees_needed_to_offset || 0} Mature Trees Needed
                </div>
                <div className="text-[10px] text-teal-800 leading-tight">
                  To absorb your annual emissions in a year
                </div>
              </div>
            </div>

            {/* Action Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save & Track Impact'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
