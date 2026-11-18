"""
Comprehensive verification test suite for CarbonLess backend API.
"""

import unittest
import json
from app import app
from database import init_db
from seed_data import seed_database

class CarbonLessApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        seed_database()
        cls.client = app.test_client()

    def test_01_factors(self):
        res = self.client.get('/api/calculator/factors')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('transport_factors', data)
        self.assertIn('energy_factors', data)
        self.assertIn('food_factors', data)
        self.assertIn('waste_factors', data)
        print("✓ Factors API test passed")

    def test_02_calculate(self):
        payload = {
            "transport": {
                "car_type": "car_petrol",
                "car_km_per_week": 100,
                "carpool_passengers": 1,
                "bus_km_per_week": 20,
                "train_km_per_week": 30,
                "flights_domestic_hours_yr": 2,
                "flights_intl_hours_yr": 0
            },
            "energy": {
                "electricity_kwh_per_month": 200,
                "clean_energy_percentage": 20,
                "natural_gas_therms_month": 10,
                "lpg_cylinders_year": 0,
                "household_members": 2
            },
            "food": {
                "diet_type": "medium_meat",
                "locally_sourced": True,
                "food_waste_frequency": "rarely",
                "packaged_processed": "medium"
            },
            "waste": {
                "trash_bags_per_week": 2,
                "recycle_paper_plastic": True,
                "recycle_glass_metal": True,
                "compost_organic": True,
                "household_members": 2
            }
        }
        res = self.client.post('/api/calculator/calculate', json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('summary', data)
        self.assertGreater(data['summary']['total_annual_co2_kg'], 0)
        print("✓ Calculate Footprint test passed: Total =", data['summary']['total_annual_co2_kg'], "kg")

    def test_03_auth_and_dashboard(self):
        # Demo login
        login_res = self.client.post('/api/auth/demo-login')
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.get_json()
        token = login_data['token']
        headers = {'Authorization': f'Bearer {token}'}

        # Dashboard Summary
        dash_res = self.client.get('/api/dashboard/summary', headers=headers)
        self.assertEqual(dash_res.status_code, 200)
        dash_data = dash_res.get_json()
        self.assertIn('metrics', dash_data)
        self.assertIn('category_distribution', dash_data)
        print("✓ Dashboard Summary test passed: Rating =", dash_data['metrics']['rating']['label'])

        # Dashboard Trends
        trends_res = self.client.get('/api/dashboard/trends?days=14', headers=headers)
        self.assertEqual(trends_res.status_code, 200)
        trends_data = trends_res.get_json()
        self.assertIn('trends', trends_data)
        self.assertGreater(len(trends_data['trends']), 0)
        print(f"✓ Dashboard Trends test passed: {len(trends_data['trends'])} days loaded")

        # Save Footprint
        save_res = self.client.post('/api/calculator/save', json={
            "transport": {"car_type": "car_ev", "car_km_per_week": 50},
            "energy": {"electricity_kwh_per_month": 180, "household_members": 2},
            "food": {"diet_type": "vegetarian"},
            "waste": {"trash_bags_per_week": 1, "recycle_paper_plastic": True}
        }, headers=headers)
        self.assertEqual(save_res.status_code, 200)
        print("✓ Save Footprint test passed")

        # Recommendations
        rec_res = self.client.get('/api/recommendations', headers=headers)
        self.assertEqual(rec_res.status_code, 200)
        rec_data = rec_res.get_json()
        self.assertGreater(len(rec_data['recommendations']), 0)
        first_rec = rec_data['recommendations'][0]
        
        adopt_res = self.client.post('/api/recommendations/adopt', json={'rec_id': first_rec['id']}, headers=headers)
        self.assertEqual(adopt_res.status_code, 200)
        print("✓ Recommendations & Adopt test passed")

        # Challenges
        ch_res = self.client.get('/api/challenges', headers=headers)
        self.assertEqual(ch_res.status_code, 200)
        ch_data = ch_res.get_json()
        self.assertGreater(len(ch_data['challenges']), 0)
        ch_id = ch_data['challenges'][0]['id']

        join_res = self.client.post(f'/api/challenges/{ch_id}/join', headers=headers)
        self.assertEqual(join_res.status_code, 200)

        comp_res = self.client.post(f'/api/challenges/{ch_id}/complete', headers=headers)
        self.assertEqual(comp_res.status_code, 200)
        comp_data = comp_res.get_json()
        self.assertIn('points_earned', comp_data)
        print(f"✓ Challenges Join & Complete test passed: +{comp_data['points_earned']} pts")

        # Rewards: Badges & Leaderboard
        b_res = self.client.get('/api/rewards/badges', headers=headers)
        self.assertEqual(b_res.status_code, 200)
        b_data = b_res.get_json()
        self.assertGreater(b_data['unlocked_count'], 0)

        l_res = self.client.get('/api/rewards/leaderboard', headers=headers)
        self.assertEqual(l_res.status_code, 200)
        l_data = l_res.get_json()
        self.assertGreater(len(l_data['leaderboard']), 0)
        print(f"✓ Badges ({b_data['unlocked_count']} unlocked) & Leaderboard ({len(l_data['leaderboard'])} entries) test passed")

        # Reports
        rep_res = self.client.get('/api/reports/analytics', headers=headers)
        self.assertEqual(rep_res.status_code, 200)
        rep_data = rep_res.get_json()
        self.assertIn('weekly_comparison', rep_data)
        self.assertIn('monthly_comparison', rep_data)
        self.assertIn('stats', rep_data)
        print("✓ Reports Analytics test passed")

    def test_04_frontend_serving(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'CarbonLess', res.data)
        print("✓ Frontend static bundle serving test passed")

if __name__ == '__main__':
    unittest.main()
