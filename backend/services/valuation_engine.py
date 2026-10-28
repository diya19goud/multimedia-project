import math
from typing import List
from backend.schemas.valuation import (
    ValuationRequest,
    ValuationResponse,
    CostCategoryItem,
    ValuationScenario,
    MonthlyCashflow
)

class ValuationEngineService:
    LOCATION_FACTORS = {
        "Austin, TX - Metro Corridor": 1.08,
        "San Francisco Bay Area, CA": 1.48,
        "New York Metro, NY": 1.52,
        "Chicago, IL": 1.18,
        "Miami, FL": 1.14,
        "Seattle, WA": 1.26,
        "London, UK": 1.40,
        "Frankfurt, Germany": 1.32,
        "Dubai, UAE": 1.12,
        "Bengaluru, India": 0.48,
        "Tokyo, Japan": 1.38,
        "Sydney, Australia": 1.35
    }

    PROJECT_BASE_COST_PER_SQFT = {
        "Commercial Office": 240.0,
        "Residential Multi-Family": 210.0,
        "Industrial Warehouse / Logistics": 135.0,
        "Luxury Villa / Estate": 360.0,
        "Retail Center": 195.0,
        "Healthcare / Medical Clinic": 340.0,
        "Educational Facility": 230.0
    }

    QUALITY_MULTIPLIERS = {
        "Standard / Builder Grade": 1.0,
        "Premium / Grade A": 1.25,
        "Luxury / Architectural Masterpiece": 1.60
    }

    STRUCTURAL_SYSTEM_MULTIPLIERS = {
        "Reinforced Concrete (RCC)": 1.0,
        "Structural Steel Frame": 1.08,
        "Mass Timber / Hybrid": 1.15,
        "Precast Concrete": 0.96
    }

    AMENITY_COSTS = {
        "Underground Parking": 450000.0,
        "Central HVAC VRF": 280000.0,
        "Smart Building BMS": 160000.0,
        "Rooftop Solar PV": 195000.0,
        "Seismic Dampers": 320000.0,
        "Backup Generator Substation": 210000.0,
        "EV Charging Plaza": 90000.0,
        "Rainwater Harvesting & Greywater": 115000.0,
        "Acoustic Glazing Upgrade": 140000.0
    }

    @classmethod
    def calculate(cls, req: ValuationRequest) -> ValuationResponse:
        loc_mult = cls.LOCATION_FACTORS.get(req.location, 1.10)
        base_rate = cls.PROJECT_BASE_COST_PER_SQFT.get(req.project_type, 220.0)
        qual_mult = cls.QUALITY_MULTIPLIERS.get(req.construction_quality, 1.20)
        struct_mult = cls.STRUCTURAL_SYSTEM_MULTIPLIERS.get(req.structural_system, 1.0)
        
        # Floor height premium: +1.5% for every floor above 3
        floor_multiplier = 1.0 + (max(0, req.floors_count - 3) * 0.015)

        # Topography
        topo_addon = 0.0
        if "Sloped" in req.site_topography:
            topo_addon = 0.08
        elif "Water Table" in req.site_topography:
            topo_addon = 0.12

        effective_sqft_cost = base_rate * loc_mult * qual_mult * struct_mult * floor_multiplier * (1.0 + topo_addon)
        base_construction_cost = effective_sqft_cost * req.built_up_area_sqft

        # Add amenities
        amenities_total = sum(cls.AMENITY_COSTS.get(a, 120000.0) for a in req.amenities)
        total_cost = base_construction_cost + amenities_total

        # Valuation computation (Commercial cap rate ~ 6.5% to 7.5%, margin ~ 22% - 32%)
        market_margin = 0.28 if "Luxury" in req.construction_quality else 0.24
        estimated_valuation = total_cost * (1.0 + market_margin)

        cost_per_sqft = total_cost / req.built_up_area_sqft
        val_per_sqft = estimated_valuation / req.built_up_area_sqft

        # Breakdown percentages
        breakdown_pcts = [
            ("Substructure & Foundation", 0.13, "Excavation, footings, grade beams, piling, and waterproofing"),
            ("Superstructure & Framing", 0.24, "RCC columns, shear walls, post-tensioned slabs or steel columns"),
            ("Building Envelope & Facade", 0.15, "Curtain walling, double glazing, exterior insulation, roofing"),
            ("MEP & HVAC Engineering", 0.22, "HVAC VRF, electrical substations, plumbing, fire suppression"),
            ("Interior Fitout & Finishes", 0.13, "Drywall, ceilings, premium flooring, fixtures, joinery"),
            ("Site Works & Landscaping", 0.05, "Paving, grading, stormwater management, site lighting"),
            ("Permits, Architecture & Fees", 0.04, "Statutory permits, MEP engineering stamps, BIM coordination"),
            ("Contingency & Escalation", 0.04, "Design & material market fluctuation cushion")
        ]

        cost_items: List[CostCategoryItem] = []
        for name, pct, desc in breakdown_pcts:
            amt = total_cost * pct
            cost_items.append(CostCategoryItem(
                category=name,
                amount_usd=round(amt, 2),
                percentage=round(pct * 100, 1),
                description=desc
            ))

        # Valuation Scenarios
        scenarios = [
            ValuationScenario(
                scenario="Conservative (High Cap Rate 7.8%)",
                valuation_usd=round(total_cost * 1.15, 2),
                cost_usd=round(total_cost, 2),
                net_equity_gain=round(total_cost * 0.15, 2),
                roi_percentage=15.0
            ),
            ValuationScenario(
                scenario="Base Case (Current Market Yield 6.5%)",
                valuation_usd=round(estimated_valuation, 2),
                cost_usd=round(total_cost, 2),
                net_equity_gain=round(estimated_valuation - total_cost, 2),
                roi_percentage=round(market_margin * 100, 1)
            ),
            ValuationScenario(
                scenario="Optimistic (Tight Cap Rate 5.5% + Green Premium)",
                valuation_usd=round(total_cost * 1.38, 2),
                cost_usd=round(total_cost, 2),
                net_equity_gain=round(total_cost * 0.38, 2),
                roi_percentage=38.0
            ),
        ]

        # Estimated project duration in months
        est_months = max(8, min(48, int(math.sqrt(req.built_up_area_sqft / 1000) * 2.8 + req.floors_count * 0.8)))

        # S-curve Monthly Cashflow projection
        cashflow_curve: List[MonthlyCashflow] = []
        phases = [
            "Site Mobilization & Excavation",
            "Deep Foundation & Piling",
            "Basement Retaining & Slabs",
            "Superstructure Levels 1-2",
            "Superstructure Mid-Rise",
            "Topping Out & Frame",
            "Exterior Facade Enclosure",
            "MEP Rough-in & Risers",
            "Interior Partitions & Drywall",
            "Elevators & Heavy Plant",
            "Interior Finishes & Flooring",
            "Testing, Commissioning & Handover"
        ]
        # Distribute months into curve
        cum_spend = 0.0
        for m in range(1, est_months + 1):
            phase_idx = min(len(phases) - 1, int(((m - 1) / est_months) * len(phases)))
            # S-curve bell distribution
            norm_x = (m - 0.5) / est_months
            # logistic-like weight
            weight = math.sin(norm_x * math.pi) ** 1.8
            cashflow_curve.append(MonthlyCashflow(
                month=m,
                phase_name=phases[phase_idx],
                monthly_expense_usd=0.0, # will normalize below
                cumulative_spend_usd=0.0,
                cumulative_progress_pct=0.0
            ))

        total_weight = sum(math.sin(((m - 0.5) / est_months) * math.pi) ** 1.8 for m in range(1, est_months + 1))
        running_spend = 0.0
        for i, cf in enumerate(cashflow_curve):
            m = i + 1
            w = math.sin(((m - 0.5) / est_months) * math.pi) ** 1.8
            monthly_val = (w / total_weight) * total_cost
            running_spend += monthly_val
            cf.monthly_expense_usd = round(monthly_val, 2)
            cf.cumulative_spend_usd = round(running_spend, 2)
            cf.cumulative_progress_pct = round((running_spend / total_cost) * 100, 1)

        key_drivers = [
            f"Regional market cost coefficient: {loc_mult:.2f}x for {req.location}",
            f"Specification tier: {req.construction_quality} with {req.structural_system}",
            f"Building verticality index: {req.floors_count} stories with factor {floor_multiplier:.2f}x",
            f"Integrated high-performance amenities: {len(req.amenities)} packages evaluated ($ {amenities_total:,.0f} total)",
            f"Estimated project lifecycle: {est_months} months to occupancy"
        ]

        summary = f"Comprehensive valuation and cost estimate for {req.built_up_area_sqft:,.0f} sq.ft {req.project_type} in {req.location}. Total project delivery cost is projected at ${total_cost:,.2f} (${cost_per_sqft:,.2f}/sq.ft) yielding an estimated stabilized market valuation of ${estimated_valuation:,.2f} (${val_per_sqft:,.2f}/sq.ft)."

        return ValuationResponse(
            project_summary=summary,
            total_estimated_cost_usd=round(total_cost, 2),
            estimated_market_valuation_usd=round(estimated_valuation, 2),
            cost_per_sqft=round(cost_per_sqft, 2),
            valuation_per_sqft=round(val_per_sqft, 2),
            developer_margin_pct=round(market_margin * 100, 1),
            estimated_duration_months=est_months,
            cost_breakdown=cost_items,
            scenarios=scenarios,
            cashflow_curve=cashflow_curve,
            key_drivers=key_drivers
        )
