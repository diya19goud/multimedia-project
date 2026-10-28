from typing import List, Optional
from backend.schemas.knowledge import (
    KnowledgeArticle,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse
)

class KnowledgeEngineService:
    ARTICLES: List[KnowledgeArticle] = [
        KnowledgeArticle(
            id="KB-001",
            code_id="ACI 318-19",
            title="Building Code Requirements for Structural Concrete & Rebar Placement",
            category="Structural Concrete & Steel",
            jurisdiction="International / US",
            summary="Defines standard structural concrete design, minimum slab reinforcement ratios, cover requirements, shear stirrup spacing, and lap splice development lengths.",
            key_clauses=[
                "Clause 20.6: Minimum clear cover of 75mm for concrete cast against and permanently exposed to earth (footings).",
                "Clause 25.4: Tension development length formulation for deformed bars in normal-weight concrete.",
                "Clause 18.7: Ductile detailing requirements for special moment frames in high seismic hazard categories (SDC D, E, F)."
            ],
            mandatory_tolerances=[
                "Cover to reinforcing steel: -10mm / +15mm for elements <= 300mm depth",
                "Stirrup spacing tolerance: +/- 25mm along longitudinal axis",
                "Slab thickness tolerance: -6mm / +12mm for suspended slabs"
            ],
            inspection_checklist=[
                "Verify mill test certificates (MTC) match specified yield strength Grade 60 (420 MPa) or Grade 80 (550 MPa).",
                "Check rebar cleanliness: free of heavy flaking rust, form oil, or dried slurry.",
                "Verify minimum 100% tie-wire security at perimeter bar intersections and 50% at interior intersections."
            ],
            risk_level_if_violated="Critical: Substandard lap lengths or cover deficiencies lead to premature bond failure, catastrophic shear cracking, and rebar corrosion spalling.",
            tags=["Concrete", "ACI 318", "Rebar", "Structural Design", "Cover", "Seismic"]
        ),
        KnowledgeArticle(
            id="KB-002",
            code_id="OSHA 1926.501",
            title="Duty to Have Fall Protection in Construction",
            category="Safety & OSHA Compliance",
            jurisdiction="United States (OSHA Federal)",
            summary="Specifies mandatory fall protection measures for unprotected sides and edges, leading edges, hoist areas, holes, formwork, and roofing operations at elevations of 6 feet (1.8m) or higher.",
            key_clauses=[
                "1926.501(b)(1): Each employee on a walking/working surface with an unprotected side or edge 6 feet or more above lower level must be protected by guardrail systems, safety net systems, or personal fall arrest systems.",
                "1926.502(d)(15): Anchorages used for attachment of personal fall arrest equipment must be capable of supporting at least 5,000 lbs (22.2 kN) per employee attached.",
                "1926.502(b): Guardrail top edge height shall be 42 inches plus or minus 3 inches above walking/working level."
            ],
            mandatory_tolerances=[
                "Guardrail top rail must withstand 200 lbs force without failure",
                "Midrail must withstand 150 lbs force without failure",
                "Hole covers must withstand twice the maximum anticipated axle or personnel load"
            ],
            inspection_checklist=[
                "Inspect full body harness webbing for cuts, fraying, chemical burns, or elongated stitch indicators.",
                "Confirm self-retracting lanyards (SRL) feature current annual factory calibration tags.",
                "Verify beam clamps and post anchorages are tightened to manufacturer specified torque."
            ],
            risk_level_if_violated="Extreme: Falls from height remain the leading cause of construction site fatalities (#1 OSHA Focus Four hazard).",
            tags=["OSHA", "Safety", "Fall Protection", "Harness", "Guardrails", "HSE"]
        ),
        KnowledgeArticle(
            id="KB-003",
            code_id="IBC 2024 Chapter 16",
            title="Structural Design, Dead, Live, Wind and Seismic Load Combinations",
            category="Structural Concrete & Steel",
            jurisdiction="International / US",
            summary="Prescribes structural load requirements including basic wind speeds, ground snow loads, geotechnical bearing pressures, and ASCE 7-22 load combinations for building envelopes.",
            key_clauses=[
                "Section 1604.3: Serviceability deflection limits for roof beams supporting plaster ceilings (L/360).",
                "Section 1607: Minimum uniformly distributed live loads: Office space (50 psf + 15 psf partition allowance), Corridors (80-100 psf).",
                "Section 1609: Wind load calculation methodology referencing ASCE 7 Chapter 26 to 31."
            ],
            mandatory_tolerances=[
                "Maximum lateral building drift limit: H / 400 for 10-year wind return period",
                "P-Delta secondary moment threshold checks for all framing columns"
            ],
            inspection_checklist=[
                "Verify live load postings on mechanical equipment rooms and heavy storage floors.",
                "Review geotechnical soil report against design bearing capacity assumptions.",
                "Confirm wind exposure category (Exposure B vs Exposure C) matches site surroundings."
            ],
            risk_level_if_violated="High: Underestimating environmental loads causes structural over-stress, excessive lateral sway, and facade sealant rupture.",
            tags=["IBC", "Structural Loads", "Wind Loads", "Seismic", "Deflection"]
        ),
        KnowledgeArticle(
            id="KB-004",
            code_id="ASTM C94 / C94M",
            title="Standard Specification for Ready-Mixed Concrete Delivery & Testing",
            category="Structural Concrete & Steel",
            jurisdiction="International / US",
            summary="Establishes manufacturing, batching, delivery time constraints, slump testing, and air-entrainment criteria for batch plant ready-mix concrete.",
            key_clauses=[
                "Section 12.5: Discharge of the concrete shall be completed within 1-1/2 hours (90 minutes) or before the drum has revolved 300 revolutions after the introduction of mixing water.",
                "Section 12.7: Water additions on-site are strictly limited to bring slump up to design range only if water-cement ratio is not exceeded.",
                "Section 16: Minimum frequency of sampling: 1 strength test (4 cylinders) per 150 cubic yards (115 m³) or per 5,000 sq ft of slab."
            ],
            mandatory_tolerances=[
                "Slump tolerance: +/- 25mm (1 inch) for specified slump 50mm to 100mm",
                "Air content tolerance: +/- 1.5% of specified volume",
                "Batch delivery temperature: Between 10°C (50°F) and 32°C (90°F)"
            ],
            inspection_checklist=[
                "Check delivery ticket: Verify water batch timestamp, mix design code, chemical admixtures (superplasticizer/retarder), and transit revolutions.",
                "Perform slump test on-site according to ASTM C143; discard load if segregation occurs.",
                "Fabricate 100mm x 200mm compressive strength test cylinders; store in temperature-controlled curing box on site for initial 24-48 hours."
            ],
            risk_level_if_violated="High: Exceeding 90-minute discharge window results in cold joints, massive loss of design compressive strength, and delayed hydration problems.",
            tags=["ASTM C94", "Concrete", "Ready-Mix", "Slump Test", "Batch Plant", "Quality Control"]
        ),
        KnowledgeArticle(
            id="KB-005",
            code_id="OSHA 1926.451",
            title="General Requirements for Scaffolds in Construction Operations",
            category="Safety & OSHA Compliance",
            jurisdiction="United States (OSHA Federal)",
            summary="Governs scaffold capacity, construction, access, use, and fall protection. Mandates qualified person design for scaffolds loaded beyond standard parameters.",
            key_clauses=[
                "1926.451(a)(1): Each scaffold component must be capable of supporting, without failure, its own weight and at least 4 times the maximum intended load.",
                "1926.451(b)(1): Each platform on all working levels shall be fully planked or decked between the front uprights and the guardrail supports.",
                "1926.451(e)(1): Portable ladders, hook-on ladders, or stair towers must be provided when scaffold platform is more than 2 feet above or below a point of access."
            ],
            mandatory_tolerances=[
                "Scaffold platform deflection: No more than 1/60th of the span when loaded",
                "Plank extension over end supports: Minimum 6 inches, maximum 12 inches unless cleated"
            ],
            inspection_checklist=[
                "Check mudsills and screw jacks: base plates must rest on sound timber sills; no hollow concrete block supports allowed.",
                "Verify cross-bracing pins and locking pins are fully engaged at all frame joints.",
                "Confirm daily Competent Person scaffold inspection tag (Green / Yellow / Red) is displayed at access ladders."
            ],
            risk_level_if_violated="High: Scaffold structural collapse or falling planks endanger both workers aloft and ground crews below.",
            tags=["Scaffolding", "OSHA 1926", "Safety", "Access Towers", "Falsework"]
        ),
        KnowledgeArticle(
            id="KB-006",
            code_id="NFPA 101 / IBC Ch 10",
            title="Life Safety Code: Means of Egress, Fire Barriers & Stairwell Pressurization",
            category="MEP & Electrical Codes",
            jurisdiction="International / US",
            summary="Covers building egress capacity, maximum travel distances to exits, fire separation ratings for stair shafts, emergency lighting, and positive pressure smoke control.",
            key_clauses=[
                "Section 7.3: Minimum width of egress corridors (44 inches for occupant load > 50).",
                "Section 7.5: Maximum travel distance to an exit: 200 feet (un-sprinklered) or 250 feet (equipped throughout with NFPA 13 automatic sprinkler system).",
                "Section 7.6: Dead-end corridor maximum length: 20 feet (or 50 feet in fully sprinklered buildings)."
            ],
            mandatory_tolerances=[
                "Stair riser height: Minimum 4 inches, maximum 7 inches; variation between adjacent risers <= 3/8 inch (9.5mm)",
                "Stair tread depth: Minimum 11 inches"
            ],
            inspection_checklist=[
                "Verify fire-rated door assemblies (UL 10C label intact) with functioning magnetic hold-opens and positive latching.",
                "Test emergency battery pack lighting along all egress paths for continuous 90-minute runtime.",
                "Inspect UL-listed firestop penetrations across all floor slabs and demising fire walls."
            ],
            risk_level_if_violated="Critical: Substandard egress dimensions or compromised fire seals result in life-safety hazard and withholding of Certificate of Occupancy.",
            tags=["Fire Safety", "NFPA", "Egress", "Emergency Exits", "Life Safety", "IBC"]
        ),
        KnowledgeArticle(
            id="KB-007",
            code_id="ACI 224R-01",
            title="Control of Cracking in Concrete Structures and Permissible Tolerances",
            category="Structural Concrete & Steel",
            jurisdiction="International / US",
            summary="Provides comprehensive guidance on causes of concrete cracking (plastic shrinkage, thermal contraction, chemical reactions, flexural tension) and acceptable crack widths in different exposure environments.",
            key_clauses=[
                "Section 4.1: Maximum permissible crack width at tensile face of reinforced concrete: Dry air / protective membrane = 0.41mm (0.016 in); Humidity / moist air = 0.30mm (0.012 in); Deicing chemicals = 0.18mm (0.007 in); Seawater immersion = 0.15mm (0.006 in).",
                "Section 2.2: Contraction joint spacing recommendations: 24 to 30 times slab thickness (e.g. 150mm slab = 3.6m to 4.5m joint centers)."
            ],
            mandatory_tolerances=[
                "Sawcut joint depth: Minimum 1/4 of slab thickness",
                "Timing of joint cutting: Within 4 to 12 hours after final finishing before thermal contraction initiates"
            ],
            inspection_checklist=[
                "Use optical crack comparator gauge to measure width at three points along fracture.",
                "Distinguish between superficial map crazing and full-depth structural shear cracking.",
                "Inspect vapor retarder (15-mil polyolefin) integrity directly below slab on grade."
            ],
            risk_level_if_violated="Moderate to High: Uncontrolled cracking allows aggressive chloride ion ingress leading to rapid corrosion of internal steel reinforcement.",
            tags=["Cracks", "ACI 224", "Concrete Durability", "Remediation", "Epoxy Injection"]
        ),
        KnowledgeArticle(
            id="KB-008",
            code_id="EN 1992-1-1",
            title="Eurocode 2: Design of Concrete Structures - General Rules and Rules for Buildings",
            category="Structural Concrete & Steel",
            jurisdiction="Eurocode (CEN)",
            summary="European unified standard for structural concrete design, incorporating limit state design philosophy for ultimate limit state (ULS) and serviceability limit state (SLS).",
            key_clauses=[
                "Clause 4.4.1: Concrete cover requirements based on environmental exposure classes (XC1 carbonation to XS3 marine tidal zones).",
                "Clause 7.3: Crack control calculation without direct calculation using maximum bar diameters and maximum bar spacing tables.",
                "Clause 9.2: Detailing of beams, minimum and maximum longitudinal reinforcement percentages."
            ],
            mandatory_tolerances=[
                "Nominal cover: c_nom = c_min + delta_c_dev (typically 10mm execution allowance)",
                "Minimum reinforcement ratio: 0.26 * (f_ctm / f_yk) * b_t * d >= 0.0013 * b_t * d"
            ],
            inspection_checklist=[
                "Verify exposure class designation on structural general arrangement drawings.",
                "Confirm concrete cover spacer blocks are fiber-reinforced cementitious type matching parent concrete durability.",
                "Check rebar bend mandrel diameters satisfy Eurocode minimum pin size (4x bar diameter for bars <= 16mm)."
            ],
            risk_level_if_violated="High: Inadequate cover or reinforcement spacing causes serviceability limit state failures and premature structural obsolescence.",
            tags=["Eurocode", "EN 1992", "Concrete Design", "Cover", "Durability"]
        )
    ]

    @classmethod
    def search(cls, req: KnowledgeSearchRequest) -> KnowledgeSearchResponse:
        results = cls.ARTICLES
        
        # Category filter
        if req.category and req.category != "All":
            results = [a for a in results if a.category.lower() == req.category.lower()]

        # Jurisdiction filter
        if req.jurisdiction and req.jurisdiction != "All":
            results = [a for a in results if req.jurisdiction.lower() in a.jurisdiction.lower()]

        # Tag filter
        if req.tag:
            results = [a for a in results if any(req.tag.lower() == t.lower() for t in a.tags)]

        # Text query
        if req.query and req.query.strip():
            q = req.query.strip().lower()
            filtered = []
            for a in results:
                searchable = f"{a.code_id} {a.title} {a.summary} {' '.join(a.key_clauses)} {' '.join(a.tags)}".lower()
                if q in searchable:
                    filtered.append(a)
            results = filtered

        categories = sorted(list(set(a.category for a in cls.ARTICLES)))
        jurisdictions = sorted(list(set(a.jurisdiction for a in cls.ARTICLES)))

        return KnowledgeSearchResponse(
            total_results=len(results),
            articles=results,
            available_categories=["All"] + categories,
            available_jurisdictions=["All"] + jurisdictions
        )
