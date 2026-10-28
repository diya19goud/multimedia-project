from typing import List
from backend.schemas.scheduling import (
    GanttPhase,
    Milestone,
    ScheduleOptimizationRequest,
    ScheduleAnalysisResponse
)

class SchedulingEngineService:
    @classmethod
    def get_schedule(cls, req: ScheduleOptimizationRequest) -> ScheduleAnalysisResponse:
        total_days = req.target_duration_months * 30
        current_day = int(total_days * 0.42) # currently 42% through project

        phases: List[GanttPhase] = [
            GanttPhase(
                id="PH-01",
                phase_name="Site Clearing & Bulk Earthwork Excavation",
                category="Substructure",
                start_day=0,
                duration_days=45,
                end_day=45,
                progress_pct=100,
                status="Completed",
                is_critical_path=True,
                contractor="Apex Earthworks & Shoring Corp",
                dependencies=[],
                delay_risk="Low",
                risk_factors=["Completed 2 days ahead of contractual target"]
            ),
            GanttPhase(
                id="PH-02",
                phase_name="Secant Pile Shoring & Foundation Footings",
                category="Substructure",
                start_day=40,
                duration_days=65,
                end_day=105,
                progress_pct=100,
                status="Completed",
                is_critical_path=True,
                contractor="Titan Geotechnical Engineering",
                dependencies=["PH-01"],
                delay_risk="Low",
                risk_factors=["Encountered hard bedrock; hydraulic rock breaker utilized"]
            ),
            GanttPhase(
                id="PH-03",
                phase_name="Subterranean Basement RCC Retaining Walls",
                category="Substructure",
                start_day=100,
                duration_days=60,
                end_day=160,
                progress_pct=100,
                status="Completed",
                is_critical_path=True,
                contractor="Vanguard Concrete Structures",
                dependencies=["PH-02"],
                delay_risk="Low",
                risk_factors=["Waterstop membrane integrity verified via spark testing"]
            ),
            GanttPhase(
                id="PH-04",
                phase_name="Superstructure RCC Framing (Levels 1 to 12)",
                category="Superstructure",
                start_day=155,
                duration_days=110,
                end_day=265,
                progress_pct=72,
                status="In Progress",
                is_critical_path=True,
                contractor="Vanguard Concrete Structures",
                dependencies=["PH-03"],
                delay_risk="Medium",
                risk_factors=[
                    "Tower crane maintenance scheduled for day 220",
                    "High ambient temperature requires night-time pour protocols"
                ]
            ),
            GanttPhase(
                id="PH-05",
                phase_name="Unitized Curtain Wall & Architectural Glazing",
                category="Envelope",
                start_day=220,
                duration_days=95,
                end_day=315,
                progress_pct=18,
                status="In Progress",
                is_critical_path=False,
                contractor="AeroFacade Systems Ltd",
                dependencies=["PH-04"],
                delay_risk="High",
                risk_factors=[
                    "Port customs clearance delay on specialized Low-E argon insulated panels",
                    "Bracket anchoring verification in progress"
                ]
            ),
            GanttPhase(
                id="PH-06",
                phase_name="MEP Heavy Plant, Risers & HVAC Ducts",
                category="MEP",
                start_day=240,
                duration_days=120,
                end_day=360,
                progress_pct=10,
                status="In Progress",
                is_critical_path=True,
                contractor="ElectraTherm Engineering Services",
                dependencies=["PH-04"],
                delay_risk="Medium",
                risk_factors=["Copper pipe and electrical transformer substation delivery on critical path"]
            ),
            GanttPhase(
                id="PH-07",
                phase_name="Interior Partitions, Drywall & Ceilings",
                category="Finishes",
                start_day=300,
                duration_days=105,
                end_day=405,
                progress_pct=0,
                status="Pending",
                is_critical_path=False,
                contractor="Pinnacle Interior Contractors",
                dependencies=["PH-05", "PH-06"],
                delay_risk="Low",
                risk_factors=["Awaiting envelope watertight dry-in certification"]
            ),
            GanttPhase(
                id="PH-08",
                phase_name="Elevator Installation & Vertical Transit",
                category="MEP",
                start_day=310,
                duration_days=80,
                end_day=390,
                progress_pct=0,
                status="Pending",
                is_critical_path=False,
                contractor="Otis Mobility Global",
                dependencies=["PH-04"],
                delay_risk="Medium",
                risk_factors=["Hoistway plumbing plumb alignment survey pending"]
            ),
            GanttPhase(
                id="PH-09",
                phase_name="High-End Flooring, Millwork & Fixtures",
                category="Finishes",
                start_day=390,
                duration_days=90,
                end_day=480,
                progress_pct=0,
                status="Pending",
                is_critical_path=True,
                contractor="Pinnacle Interior Contractors",
                dependencies=["PH-07"],
                delay_risk="Low",
                risk_factors=["Italian porcelain tile delivery scheduled month 13"]
            ),
            GanttPhase(
                id="PH-10",
                phase_name="BMS Integration, Fire Life-Safety Commissioning",
                category="Commissioning",
                start_day=470,
                duration_days=50,
                end_day=520,
                progress_pct=0,
                status="Pending",
                is_critical_path=True,
                contractor="Nexus Automation & Fire Safety",
                dependencies=["PH-06", "PH-08", "PH-09"],
                delay_risk="Medium",
                risk_factors=["Municipal fire marshall smoke evacuation acceptance test"]
            ),
            GanttPhase(
                id="PH-11",
                phase_name="Final Snagging, Substantial Completion & Handover",
                category="Commissioning",
                start_day=515,
                duration_days=25,
                end_day=540,
                progress_pct=0,
                status="Pending",
                is_critical_path=True,
                contractor="General Prime Contractor",
                dependencies=["PH-10"],
                delay_risk="Low",
                risk_factors=["Occupancy permit and green building certification sign-off"]
            ),
        ]

        milestones: List[Milestone] = [
            Milestone(id="M1", title="Excavation & Shoring Sign-off", due_day=45, phase_id="PH-01", status="Completed", deliverable="Geotechnical engineer stability certification"),
            Milestone(id="M2", title="Substructure Ground Zero Slab Cast", due_day=160, phase_id="PH-03", status="Completed", deliverable="Basement waterproofing warranty 10-year"),
            Milestone(id="M3", title="Superstructure Halfway Mark (Level 6)", due_day=210, phase_id="PH-04", status="Completed", deliverable="Post-tensioning elongation log approval"),
            Milestone(id="M4", title="Structural Topping Out Ceremony", due_day=265, phase_id="PH-04", status="On Track", deliverable="Final roof slab cube crush test 28-day certificate"),
            Milestone(id="M5", title="Building Enclosure 100% Watertight (Dry-in)", due_day=315, phase_id="PH-05", status="At Risk", deliverable="AAMA 501.2 field water penetration test report"),
            Milestone(id="M6", title="Permanent Power Energization", due_day=360, phase_id="PH-06", status="On Track", deliverable="Utility electrical inspection clearance"),
            Milestone(id="M7", title="Integrated Fire Alarm & Smoke Clearance", due_day=520, phase_id="PH-10", status="On Track", deliverable="NFPA 72 compliance certificate"),
            Milestone(id="M8", title="Final Certificate of Occupancy (CO)", due_day=540, phase_id="PH-11", status="On Track", deliverable="Municipal authority occupancy authorization"),
        ]

        critical_phases = [p.phase_name for p in phases if p.is_critical_path]
        overall_progress = round(sum(p.progress_pct * (p.duration_days / total_days) for p in phases), 1)

        advisories = [
            "CRITICAL PATH WARNING: Superstructure Framing (PH-04) is currently controlling overall completion. Maintaining 7-day floor turnaround cycle is vital.",
            "FACADE SUPPLY CHAIN ALERT: Curtain Wall (PH-05) has high delay risk due to international maritime shipment transit. Pre-fabricate secondary bracket mounts to fast-track on-site mounting once shipments arrive.",
            "FLOAT CONSUMPTION: Exterior Envelope delay has consumed 65% of available free float. If delayed past Day 320, it will transition onto the Critical Path.",
            "WEATHER BUFFER RECOMMENDATION: Integrate 4-day weather contingency into scheduled crane hoisting windows during upcoming seasonal gust periods."
        ]

        return ScheduleAnalysisResponse(
            project_name=req.project_name,
            total_planned_days=total_days,
            current_day=current_day,
            overall_progress_pct=overall_progress,
            critical_path_duration_days=sum(p.duration_days for p in phases if p.is_critical_path),
            projected_delay_days=6,
            phases=phases,
            milestones=milestones,
            critical_path_phases=critical_phases,
            ai_schedule_advisories=advisories
        )
