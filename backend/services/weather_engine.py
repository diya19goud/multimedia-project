import time
from typing import List, Dict
from backend.schemas.weather import (
    WeatherMetric,
    TradeFeasibility,
    DayForecastItem,
    WeatherAdvisoryResponse
)

class WeatherEngineService:
    CITIES_DATA: Dict[str, Dict] = {
        "Austin, TX": {
            "temp_c": 33.5,
            "temp_f": 92.3,
            "feels_like_c": 37.0,
            "humidity": 62,
            "wind_kph": 16.0,
            "wind_gusts_kph": 24.0,
            "rain_prob": 15,
            "uv": 9,
            "condition": "Sunny & High Thermal Load",
            "icon": "sun"
        },
        "Phoenix, AZ": {
            "temp_c": 41.0,
            "temp_f": 105.8,
            "feels_like_c": 43.5,
            "humidity": 18,
            "wind_kph": 22.0,
            "wind_gusts_kph": 35.0,
            "rain_prob": 5,
            "uv": 11,
            "condition": "Extreme Heat Wave",
            "icon": "flame"
        },
        "Seattle, WA": {
            "temp_c": 14.0,
            "temp_f": 57.2,
            "feels_like_c": 13.0,
            "humidity": 88,
            "wind_kph": 28.0,
            "wind_gusts_kph": 46.0,
            "rain_prob": 75,
            "uv": 3,
            "condition": "Steady Rainfall & Moderate Gusts",
            "icon": "cloud-rain"
        },
        "Chicago, IL": {
            "temp_c": 6.0,
            "temp_f": 42.8,
            "feels_like_c": 2.5,
            "humidity": 68,
            "wind_kph": 38.0,
            "wind_gusts_kph": 52.0,
            "rain_prob": 30,
            "uv": 4,
            "condition": "Cold Winds & High Shear Gusts",
            "icon": "wind"
        },
        "Miami, FL": {
            "temp_c": 30.5,
            "temp_f": 86.9,
            "feels_like_c": 36.2,
            "humidity": 78,
            "wind_kph": 19.0,
            "wind_gusts_kph": 30.0,
            "rain_prob": 65,
            "uv": 8,
            "condition": "Humid with Afternoon Squalls",
            "icon": "cloud-lightning"
        },
        "Dubai, UAE": {
            "temp_c": 38.0,
            "temp_f": 100.4,
            "feels_like_c": 44.0,
            "humidity": 55,
            "wind_kph": 15.0,
            "wind_gusts_kph": 22.0,
            "rain_prob": 0,
            "uv": 10,
            "condition": "Intense Solar Radiation",
            "icon": "sun"
        },
        "London, UK": {
            "temp_c": 17.5,
            "temp_f": 63.5,
            "feels_like_c": 17.0,
            "humidity": 72,
            "wind_kph": 18.0,
            "wind_gusts_kph": 28.0,
            "rain_prob": 40,
            "uv": 5,
            "condition": "Partly Cloudy with Scattered Drizzle",
            "icon": "cloud-sun"
        }
    }

    @classmethod
    def get_advisory(cls, location: str = "Austin, TX") -> WeatherAdvisoryResponse:
        data = cls.CITIES_DATA.get(location, cls.CITIES_DATA["Austin, TX"])
        temp = data["temp_c"]
        wind = data["wind_kph"]
        gusts = data["wind_gusts_kph"]
        rain = data["rain_prob"]
        humidity = data["humidity"]

        alerts = []
        overall_risk = "Low Risk - Operations Normal"

        if temp >= 38.0:
            alerts.append("CRITICAL HEAT ALERT (OSHA NEP): Ambient temperature exceeds 38°C (100°F). Mandatory 15-minute shaded rest breaks every 45 minutes of heavy manual labor.")
            overall_risk = "High Risk - High Hazard Conditions"
        elif temp >= 32.0:
            alerts.append("HOT WEATHER CONCRETING (ACI 305R): Concrete discharge must conclude within 60 minutes of batching. Shaved ice required in mix water.")
            if overall_risk != "High Risk - High Hazard Conditions":
                overall_risk = "Moderate Risk - Mitigations Required"

        if gusts >= 45.0:
            alerts.append("HIGH WIND WARNING: Wind gusts exceed 45 km/h. Mandatory halt on tower crane hoisting of large surface panels and suspended scaffold operations.")
            overall_risk = "High Risk - High Hazard Conditions"
        elif gusts >= 32.0:
            alerts.append("WIND CAUTION: Crane operators must monitor anemometer. Reduce rated load capacity by 25% when lifting formwork panels.")

        if rain >= 60:
            alerts.append("HEAVY PRECIPITATION FORECAST: Waterstop installation and uncovered structural concrete pours must be rescheduled to prevent cement paste washout.")
            if overall_risk != "High Risk - High Hazard Conditions":
                overall_risk = "Moderate Risk - Mitigations Required"

        # Trade advisories
        trades = [
            TradeFeasibility(
                trade_name="Structural Concrete Pouring (ACI 305/306)",
                status="Caution" if temp > 32 or rain > 50 else ("Halt / Prohibited" if rain > 70 or temp > 40 else "Optimal"),
                risk_level="High" if temp > 38 or rain > 60 else ("Moderate" if temp > 32 or rain > 40 else "Low"),
                restriction_reason="High hydration heat causes plastic shrinkage micro-cracking" if temp > 32 else ("Water-cement ratio dilution hazard from rainfall" if rain > 50 else "Ideal curing ambient window"),
                protective_measures=[
                    "Pre-chill mixing water with liquid nitrogen or chipped ice",
                    "Apply aliphatic alcohol evaporation retarder spray immediately after strike-off",
                    "Continuous wet burlap curing for minimum 7 days"
                ] if temp > 32 else ["Standard continuous moist curing protocols"]
            ),
            TradeFeasibility(
                trade_name="Tower Crane & High Elevation Hoisting",
                status="Halt / Prohibited" if gusts > 42 else ("Caution" if gusts > 28 else "Optimal"),
                risk_level="High" if gusts > 42 else ("Moderate" if gusts > 28 else "Low"),
                restriction_reason=f"Anemometer gust reading ({gusts} km/h) exceeds safe sail-area threshold (42 km/h)" if gusts > 42 else "Wind speeds within safe operational parameters",
                protective_measures=[
                    "Engage crane slew parking brake / free-wheeling weathervane mode",
                    "Tag lines mandatory on all rigging loads",
                    "Prohibit hoisting of broad-surface curtain wall glazing panels"
                ] if gusts > 28 else ["Standard dual tag line rigger control"]
            ),
            TradeFeasibility(
                trade_name="Roofing & Waterproofing Membrane Application",
                status="Halt / Prohibited" if rain > 45 or humidity > 85 else "Optimal",
                risk_level="High" if rain > 45 or humidity > 85 else "Low",
                restriction_reason="Moisture entrapment under SBS bituminous sheet causes catastrophic blister delamination" if rain > 45 else "Dry substrate moisture content < 4% verified",
                protective_measures=[
                    "Electronic moisture meter probe testing prior to primer application",
                    "Have heavy-gauge polyethylene tarpaulins staged at roof perimeter"
                ]
            ),
            TradeFeasibility(
                trade_name="Deep Foundation & Trenching Excavation",
                status="Caution" if rain > 50 else "Optimal",
                risk_level="Moderate" if rain > 50 else "Low",
                restriction_reason="Soil saturation increases lateral earth pressure and sloughing risk" if rain > 50 else "Stable soil cohesive shear profile",
                protective_measures=[
                    "Inspect trench shoring and hydraulic shields every 2 hours during wet shifts",
                    "Maintain continuous perimeter French drain and sump submersible pumping"
                ]
            ),
            TradeFeasibility(
                trade_name="Exterior Paint & Sealant Application",
                status="Caution" if temp > 35 or rain > 30 else "Optimal",
                risk_level="Moderate" if temp > 35 or rain > 30 else "Low",
                restriction_reason="Rapid solvent evaporation causes flash skinning and poor adhesion" if temp > 35 else "Substrate temperature within 10°C - 32°C specification",
                protective_measures=[
                    "Schedule exterior facade coatings for early morning shaded facade faces",
                    "Verify dew point differential is greater than 3°C above air temp"
                ]
            )
        ]

        # 7-day forecast
        day_names = ["Today (Wed)", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"]
        forecast_items: List[DayForecastItem] = []
        for i, name in enumerate(day_names):
            t_high = round(temp + (i % 3 - 1) * 2.5, 1)
            t_low = round(t_high - 8.5, 1)
            p_rain = min(90, max(5, rain + (i * 12 % 40) - 15))
            w_max = round(wind + (i * 7 % 25) - 6, 1)
            
            if w_max > 42 or p_rain > 65:
                status = "Stop Work Warning"
                crane = "Halt Afternoon" if w_max > 42 else "Caution"
                concrete = "Reschedule Pour" if p_rain > 65 else "Weather Watch"
            elif t_high > 35 or p_rain > 35:
                status = "Weather Caution"
                crane = "Normal Ops"
                concrete = "Night Pour Required" if t_high > 35 else "Cover Required"
            else:
                status = "Optimal Site Work"
                crane = "Optimal"
                concrete = "Optimal"

            forecast_items.append(DayForecastItem(
                day_name=name,
                date_str=f"Day +{i}",
                high_temp_c=t_high,
                low_temp_c=t_low,
                condition="Sunny" if p_rain < 20 else ("Rain Showers" if p_rain > 50 else "Scattered Clouds"),
                precipitation_chance=p_rain,
                wind_max_kph=w_max,
                overall_site_status=status,
                concrete_suitability=concrete,
                crane_suitability=crane,
                earthwork_suitability="Good Drainage" if p_rain < 30 else "Monitor Slopes"
            ))

        return WeatherAdvisoryResponse(
            location=location,
            recorded_at=time.strftime("%Y-%m-%d %H:%M:%S"),
            current_metrics=WeatherMetric(
                temperature_c=temp,
                temperature_f=data["temp_f"],
                feels_like_c=data["feels_like_c"],
                humidity_pct=humidity,
                wind_speed_kph=wind,
                wind_gusts_kph=gusts,
                rain_probability_pct=rain,
                uv_index=data["uv"],
                condition=data["condition"],
                condition_icon=data["icon"]
            ),
            overall_site_risk=overall_risk,
            critical_alerts=alerts if alerts else ["All climatic parameters currently within normal construction operating envelope."],
            trade_advisories=trades,
            forecast_7day=forecast_items,
            concrete_curing_guidelines=[
                "ACI 305R: Maintain concrete placement temperature between 10°C and 30°C.",
                "Ensure continuous water fogging or curing compound application within 20 minutes of strike-off.",
                "Check temperature sensors in mass concrete elements; maximum core-to-surface temperature gradient cannot exceed 20°C."
            ],
            osha_heat_cold_protocols=[
                "OSHA 3151 Heat Illness Prevention: Provide minimum 1 quart (0.95L) of potable cool water per worker per hour.",
                "Mandatory shaded resting stations equipped with misting fans for wet-bulb globe temperature > 28°C.",
                "Buddy system enforcement to monitor early symptoms of heat exhaustion or heat stroke."
            ]
        )
