from typing import List, Dict, Any, Optional
from backend.schemas.chat import ChatRequest, ChatResponse

class ChatEngineService:
    @classmethod
    def generate_response(cls, req: ChatRequest) -> ChatResponse:
        msg = req.message.lower().strip()
        history = req.history
        ctx = req.site_context

        # Scenario 1: Rebar / lap splice / development length
        if any(w in msg for w in ["rebar", "lap length", "lap splice", "development length", "reinforcement", "m30", "bar"]):
            reply = r"""### Concrete Reinforcement Lap Splice Calculation

Based on **ACI 318-19 Section 25.4 & 25.5** (and conforming to **IS 456:2000 Clause 26.2.5**):

#### 1. Input Parameters
- **Bar Diameter ($\Phi$):** 25 mm (Grade B500B / Fe 500D)
- **Concrete Grade:** M30 ($f'c = 30\\text{ MPa} \\approx 4350\\text{ psi}$)
- **Steel Yield Strength ($f_y$):** 500 MPa
- **Design Bond Stress ($\tau_{bd}$ for deformed bars):** $1.5 \\times 1.6 = 2.4\\text{ N/mm}^2$

#### 2. Formulas & Calculated Values
- **Tension Lap Length ($L_d$ Class B Splice):**
  $$L_d = \\frac{\\Phi \\cdot \\sigma_s}{4 \\cdot \\tau_{bd}} \\approx \\frac{25 \\times (0.87 \\times 500)}{4 \\times 2.4} = \\mathbf{1132\\text{ mm}} \\approx \\mathbf{46\\Phi}$$
- **Recommended On-Site Tension Lap:** **1,150 mm (1.15 m)**
- **Compression Lap Length:** Minimum $24\\Phi = 24 \\times 25\\text{ mm} = \\mathbf{600\\text{ mm}}$

> **⚠️ Field Compliance Rule:** Stagger lap splices by at least 1.3 times the lap length ($>1.5\\text{ m}$). Never lap more than 50% of the total tension reinforcement in a single cross-section. Ensure min 3 stirrups/ties within the splice zone."""
            standards = ["ACI 318-19 (Building Code Requirements for Structural Concrete)", "IS 456:2000 Clause 26.2", "Eurocode 2 (EN 1992-1-1 Section 8.7)"]
            followups = [
                "What is the required concrete clear cover for foundation footings?",
                "Calculate hook development length for 90-degree seismic hooks",
                "Can mechanical couplers replace lap splices for 32mm bars?"
            ]
            action = "rebar_calc"

        # Scenario 2: Scaffolding / OSHA fall guidelines
        elif any(w in msg for w in ["scaffold", "scaffolding", "osha", "tie-off", "fall protection", "guardrail"]):
            reply = """### OSHA Scaffolding & Fall Protection Directive (OSHA 1926 Subpart L & M)

#### Key Compliance Criteria for Supported Frame Scaffolds:
1. **Fall Protection Trigger Height:**
   - Fall protection (guardrails or PFAS) is strictly mandatory on scaffolds at or above **10 feet (3.1 meters)** above a lower level (*OSHA 1926.451(g)(1)*).
2. **Standard Guardrail Specifications:**
   - **Top Rail:** 38 to 45 inches above platform level; must withstand **200 lbs** downward/outward force.
   - **Midrail:** Centered midway between top rail and platform (~21 inches); must withstand **150 lbs**.
   - **Toeboards:** Minimum **3.5 inches** high; gap between platform and bottom of toeboard $\\le 1/4$ inch.
3. **Planking & Decking:**
   - Each platform unit must be fully planked or decked with no gaps $> 1\\text{ inch}$. Scaffold grade lumber (tested to ANSI A10.8) or aluminum planks only.
4. **Scaffold Ties & Guying (Height-to-Base Ratio):**
   - Scaffolds with a height-to-base width ratio exceeding **4:1** must be restrained from tipping by guying, ties, or bracing every **20 vertical feet** (for bases $\\le 3\\text{ft}$) or **26 vertical feet** (for bases $> 3\\text{ft}$).
5. **Inspection Tagging Protocol:**
   - **GREEN TAG:** Inspected, 100% compliant, ready for all personnel.
   - **YELLOW TAG:** Caution, special tie-off requirements or modified configuration.
   - **RED TAG:** Unsafe / Under Erection / Maintenance — DO NOT CLIMB."""
            standards = ["OSHA 29 CFR 1926.451 (General Scaffolding Requirements)", "OSHA 1926.502 (Fall Protection Systems Criteria)", "ANSI/ASSP A10.8-2019"]
            followups = [
                "Generate daily scaffolding pre-shift inspection checklist",
                "What are the anchorage requirements for personal fall arrest systems?",
                "What is the maximum scaffold platform deflection under working load?"
            ]
            action = "scaffold_audit"

        # Scenario 3: Daily Site Safety Log / Daily Diary
        elif any(w in msg for w in ["daily log", "site log", "daily report", "supervisor log", "draft log", "daily diary"]):
            temp = ctx.ambient_temp_c if ctx else 31.5
            wind = ctx.wind_speed_kph if ctx else 18.0
            proj = ctx.active_project if ctx else "Skyline Corporate Center"
            phase = ctx.current_phase if ctx else "Structural RCC Pouring"
            reply = f"""### AI-Generated Daily Site Supervisor Report

**Project:** {proj}  
**Date:** Today | **Shift:** Day Shift (07:00 – 16:30)  
**Environmental Conditions:** Ambient Temp: {temp}°C, Wind Velocity: {wind} km/h, Sky: Partially Overcast (Optimal Pouring Window)

---

#### 1. Manpower & Trade Census
- **General Contractor Supervisory Staff:** 4 Site Engineers, 2 HSE Officers
- **RCC Superstructure Crew:** 28 Steel Fixers, 16 Carpenters/Formwork, 12 Concreting Laborers
- **MEP Subcontractor (ElectraTherm):** 8 Electricians, 6 HVAC Pipefitters
- **Curtain Wall Riggers:** 6 Specialists
- **Total Headcount on Site:** **74 active personnel**

#### 2. Major Works Executed Today
- Completed Level 7 suspended slab post-tensioned tendon placement (Zone B).
- Executed continuous batch concrete pour for Grid C4–C9 transfer beams ($140\\text{ m}^3$ C40/50 mix).
- Slump tests recorded: $145\\text{ mm}$ (acceptable range $140\\pm 20\\text{ mm}$).
- 12 concrete test cubes cast for 7-day and 28-day compressive crushing trials.

#### 3. HSE & Safety Incidents
- **Zero Recordable Injuries / Zero Near Misses.**
- Morning Toolbox Talk topic: *Working Safely at Slab Edges and Controlled Access Zones.*
- Addressed 1 warning: Replaced weathered barricade tape at basement hoist shaft with rigid timber rails.

#### 4. Delay Risks & Tomorrow's Priorities
- High winds forecast for tomorrow afternoon ($\\\\ge 42\\\\text{ km/h}$); crane high-lift glass panels must be scheduled before 11:00 AM.
- Formwork stripping for Level 6 columns scheduled for 08:30 AM."""
            standards = ["CMAA Construction Management Standards", "AIA Document G702/G703", "OSHA 1926.20 General Safety & Health Provisions"]
            followups = [
                "Export daily log to PDF format",
                "Log a concrete delivery delay with batch plant timestamp",
                "Check weather window for tomorrow's crane hoist"
            ]
            action = "daily_log"

        # Scenario 4: Concrete curing / hot weather / pouring
        elif any(w in msg for w in ["concrete", "curing", "pour", "slump", "hydration", "hot weather", "cold weather"]):
            reply = r"""### Concrete Pouring & Curing Standards (ACI 305R / ACI 308R)

#### High-Temperature Concreting Protocols ($>32^\circ\\text{C} / 90^\circ\\text{F}$):
1. **Evaporation Rate Threshold:**
   - If surface evaporation rate exceeds **$1.0\\text{ kg/m}^2/\\text{hr}$ ($0.2\\text{ lb/ft}^2/\\text{hr}$)**, plastic shrinkage cracking is imminent.
   - Employ windbreaks, water fogging sprayers, or aliphatic alcohol evaporation retarders immediately after screeding.
2. **Fresh Concrete Temperature Control:**
   - Delivery temperature must not exceed **$32^\circ\\text{C} (90^\circ\\text{F})$** per *ASTM C94*.
   - Replace up to 30% of mixing water with shaved flake ice, or utilize liquid nitrogen dosing at the batching plant.
3. **Curing Regimes:**
   - **Initial Curing:** Apply white pigmented liquid membrane-forming curing compound (*ASTM C309 Type 2*) immediately after final troweling.
   - **Continuous Moist Curing:** Minimum **7 consecutive days** for ordinary Portland cement (OPC) or **14 days** for pozzolanic blends (fly ash / GGBS). Keep burlap wet continuously."""
            standards = ["ACI 305R-20 (Guide to Hot Weather Concreting)", "ACI 308R (Guide to External Curing of Concrete)", "ASTM C94 (Ready-Mixed Concrete)", "ASTM C309 (Liquid Membrane-Forming Compounds)"]
            followups = [
                "Calculate evaporation rate from current temperature, humidity, and wind",
                "What is the maximum permissible delay between batching and discharge?",
                "When can formwork be safely stripped from slab soffits?"
            ]
            action = "concrete_guide"

        # Scenario 5: General construction query
        else:
            reply = f"""### AI Site Assistant Briefing

I am your **AI Multimodal Construction Intelligence Copilot**, engineered for project managers, structural engineers, and site supervisors.

#### How I can assist you right now:
- **Structural Code Lookups:** Instant formulas for lap splices, minimum cover, seismic details (ACI 318, Eurocode 2, IS 456).
- **Safety Regulations:** OSHA 1926 scaffolding, trenching shoring tables, crane pick radii, PPE compliance mandates.
- **Multimodal Site Audits:** Correlate site photographs with crack risk scores and automated remediation plans.
- **Material QC & Testing:** Concrete slump parameters, core test evaluation, asphalt compaction tolerances.
- **Project Scheduling & Weather:** Critical path impacts, high-wind crane cutoffs, concrete curing temperature advisories.

*Your site context:* Project **{ctx.active_project if ctx else 'Harborview Tower'}**, Active Phase: **{ctx.current_phase if ctx else 'Structural RCC Framing'}**."""
            standards = ["ACI 318-19", "OSHA 1926", "IBC 2024", "AISC 360-22"]
            followups = [
                "Calculate rebar lap length for 25mm bars in M30 concrete",
                "What are OSHA guidelines for scaffolding tie-offs above 10ft?",
                "Draft today's site supervisor daily log",
                "Check high-heat concrete pouring advisory for current weather"
            ]
            action = "general_info"

        return ChatResponse(
            reply=reply,
            cited_standards=standards,
            suggested_followups=followups,
            action_type=action,
            data_payload={"query": req.message}
        )
