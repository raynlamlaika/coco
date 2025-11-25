import { ITrip } from '../models/Trip';
import { IUser } from '../models/User';

/**
 * Scoring weights for trip compatibility
 */
const WEIGHTS = {
  SAME_DEPARTURE_LOCATION: 20,
  SIMILAR_DEPARTURE_TIME: 15, // Within 30 minutes
  SAME_MATCH: 25,
  SAME_FAVOURITE_TEAM: 10,
  OVERLAPPING_INTERESTS: 10,
  SAME_SUPPORTER_GROUP: 10,
  SAME_REGION: 10
};

/**
 * Calculate compatibility score between two trips
 * @param trip1 - First trip to compare
 * @param trip2 - Second trip to compare
 * @param driver1 - Driver of first trip
 * @param driver2 - Driver of second trip
 * @returns Compatibility score (0-100)
 */
export const calculateCompatibilityScore = (
  trip1: ITrip,
  trip2: ITrip,
  driver1: IUser,
  driver2: IUser
): number => {
  let score = 0;

  // Same departure location
  if (trip1.departureLocation.toLowerCase() === trip2.departureLocation.toLowerCase()) {
    score += WEIGHTS.SAME_DEPARTURE_LOCATION;
  }

  // Similar departure time (within 30 minutes)
  const timeDiff = Math.abs(
    new Date(trip1.departureTime).getTime() - new Date(trip2.departureTime).getTime()
  );
  const thirtyMinutes = 30 * 60 * 1000;
  if (timeDiff <= thirtyMinutes) {
    score += WEIGHTS.SIMILAR_DEPARTURE_TIME;
  }

  // Same match
  if (trip1.match.toString() === trip2.match.toString()) {
    score += WEIGHTS.SAME_MATCH;
  }

  // Same favourite team
  if (driver1.favouriteTeam.toLowerCase() === driver2.favouriteTeam.toLowerCase()) {
    score += WEIGHTS.SAME_FAVOURITE_TEAM;
  }

  // Overlapping interests
  const interests1 = new Set(driver1.interests.map((i: string) => i.toLowerCase()));
  const interests2 = driver2.interests.map((i: string) => i.toLowerCase());
  const overlapping = interests2.filter((i: string) => interests1.has(i)).length;
  if (overlapping > 0) {
    // Partial score based on number of overlapping interests
    const maxInterestScore = WEIGHTS.OVERLAPPING_INTERESTS;
    const interestScore = Math.min(overlapping * 2, maxInterestScore);
    score += interestScore;
  }

  // Same supporter group
  if (driver1.supporterGroup.toLowerCase() === driver2.supporterGroup.toLowerCase()) {
    score += WEIGHTS.SAME_SUPPORTER_GROUP;
  }

  // Same region
  if (driver1.region.toLowerCase() === driver2.region.toLowerCase()) {
    score += WEIGHTS.SAME_REGION;
  }

  return Math.min(score, 100);
};

/**
 * Determine if two trips should be suggested for grouping
 * @param score - Compatibility score
 * @param threshold - Minimum score for grouping (default 70)
 * @returns Boolean indicating if grouping should be suggested
 */
export const shouldSuggestGrouping = (score: number, threshold: number = 70): boolean => {
  return score >= threshold;
};

/**
 * Calculate scores for a trip against multiple other trips
 * @param targetTrip - The trip to find recommendations for
 * @param targetDriver - Driver of the target trip
 * @param otherTrips - Array of trips to compare against
 * @param otherDrivers - Map of trip IDs to drivers
 * @returns Array of trip IDs with scores, sorted by score descending
 */
export const getGroupingRecommendations = (
  targetTrip: ITrip,
  targetDriver: IUser,
  otherTrips: ITrip[],
  otherDrivers: Map<string, IUser>
): Array<{ tripId: string; score: number }> => {
  const recommendations: Array<{ tripId: string; score: number }> = [];

  for (const otherTrip of otherTrips) {
    // Skip self
    if (otherTrip._id.toString() === targetTrip._id.toString()) {
      continue;
    }

    const otherDriver = otherDrivers.get(otherTrip._id.toString());
    if (!otherDriver) {
      continue;
    }

    const score = calculateCompatibilityScore(targetTrip, otherTrip, targetDriver, otherDriver);
    
    if (shouldSuggestGrouping(score)) {
      recommendations.push({
        tripId: otherTrip._id.toString(),
        score
      });
    }
  }

  // Sort by score descending
  return recommendations.sort((a, b) => b.score - a.score);
};
