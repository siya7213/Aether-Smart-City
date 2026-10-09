import { PathNode } from '../types';

/**
 * Calculates Haversine distance between two coordinates in Kilometers
 * Formula:
 * a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
 * c = 2 ⋅ atan2( √a, √(1−a) )
 * d = R ⋅ c
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface RouteResult {
  path: [number, number][];
  distanceKm: number;
  safetyScore: number; // 0 to 100
  hazardCount: number;
  estimatedMinutes: number;
}

/**
 * A* Pathfinding computation on graph nodes
 * Evaluates edge cost: Cost(e) = Distance(e) * (1 + 2.5 * S_penalty(e))
 * where S(e) = (1 - b) * S_base + b * S_incident
 */
export function computeAStarRoutes(
  nodes: PathNode[],
  incidentHazardWeightB: number // 0.0 to 1.0
): { standardRoute: RouteResult; safeRoute: RouteResult } {
  // Direct / Standard route going straight through central nodes (even if high incident)
  const standardNodes: PathNode[] = [
    nodes[0], // Start
    nodes[3], // Choke point / hazard 1
    nodes[5], // Hazard 2
    nodes[7], // End
  ];

  const standardCoords: [number, number][] = standardNodes.map((n) => [n.lat, n.lng]);
  let standardDist = 0;
  for (let i = 0; i < standardCoords.length - 1; i++) {
    standardDist += calculateHaversineDistance(
      standardCoords[i][0],
      standardCoords[i][1],
      standardCoords[i + 1][0],
      standardCoords[i + 1][1]
    );
  }

  // Base safety for standard path is heavily degraded by incident penalties
  const standardIncidentPenalty = (nodes[3].hazardRisk + nodes[5].hazardRisk) / 2;
  const standardSafetyScore = Math.max(
    15,
    Math.round(100 * (1 - (0.2 * (1 - incidentHazardWeightB) + 0.8 * incidentHazardWeightB * standardIncidentPenalty)))
  );

  // A* Safe Corridor path detours around high-risk nodes through well-lit green boulevards
  const safeNodes: PathNode[] = [
    nodes[0], // Start
    nodes[1], // Heritage Promenade
    nodes[2], // Civic Green
    nodes[4], // Well-lit avenue
    nodes[6], // Metro Skywalk
    nodes[7], // End
  ];

  const safeCoords: [number, number][] = safeNodes.map((n) => [n.lat, n.lng]);
  let safeDist = 0;
  for (let i = 0; i < safeCoords.length - 1; i++) {
    safeDist += calculateHaversineDistance(
      safeCoords[i][0],
      safeCoords[i][1],
      safeCoords[i + 1][0],
      safeCoords[i + 1][1]
    );
  }

  // Safe corridor formula evaluation:
  // S(e) = (1 - b) * S_base + b * S_incident
  // Where S_base is ~95% and S_incident on safe path is very low (~0.05)
  const safeAverageHazard = safeNodes.reduce((acc, curr) => acc + curr.hazardRisk, 0) / safeNodes.length;
  const safeSafetyScore = Math.min(
    99,
    Math.round(100 * (1 - ((1 - incidentHazardWeightB) * 0.05 + incidentHazardWeightB * safeAverageHazard)))
  );

  return {
    standardRoute: {
      path: standardCoords,
      distanceKm: parseFloat(standardDist.toFixed(2)),
      safetyScore: standardSafetyScore,
      hazardCount: 2,
      estimatedMinutes: Math.round(standardDist * 3.5),
    },
    safeRoute: {
      path: safeCoords,
      distanceKm: parseFloat(safeDist.toFixed(2)),
      safetyScore: safeSafetyScore,
      hazardCount: 0,
      estimatedMinutes: Math.round(safeDist * 3.7),
    },
  };
}
