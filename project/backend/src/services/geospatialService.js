class GeospatialService {
  constructor() {
    // Aspirational districts as per Government of India
    this.aspirationalDistricts = [
      // Andhra Pradesh
      { name: 'Vizianagaram', state: 'Andhra Pradesh', coordinates: [18.1167, 83.4167] },
      { name: 'Srikakulam', state: 'Andhra Pradesh', coordinates: [18.2949, 83.8938] },
      
      // Assam
      { name: 'Dhubri', state: 'Assam', coordinates: [26.0167, 89.9833] },
      { name: 'Darrang', state: 'Assam', coordinates: [26.4500, 92.0333] },
      { name: 'Baksa', state: 'Assam', coordinates: [26.5000, 91.0000] },
      
      // Bihar
      { name: 'Araria', state: 'Bihar', coordinates: [26.1500, 87.5167] },
      { name: 'Aurangabad', state: 'Bihar', coordinates: [24.7500, 84.3667] },
      { name: 'Banka', state: 'Bihar', coordinates: [24.8833, 86.9167] },
      { name: 'Begusarai', state: 'Bihar', coordinates: [25.4167, 86.1333] },
      { name: 'Gaya', state: 'Bihar', coordinates: [24.7833, 85.0000] },
      { name: 'Jamui', state: 'Bihar', coordinates: [24.9167, 86.2167] },
      { name: 'Jehanabad', state: 'Bihar', coordinates: [25.2167, 84.9833] },
      { name: 'Katihar', state: 'Bihar', coordinates: [25.5333, 87.5833] },
      { name: 'Khagaria', state: 'Bihar', coordinates: [25.5000, 86.4833] },
      { name: 'Kishanganj', state: 'Bihar', coordinates: [26.1000, 87.9500] },
      { name: 'Lakhisarai', state: 'Bihar', coordinates: [25.1833, 86.0833] },
      { name: 'Munger', state: 'Bihar', coordinates: [25.3833, 86.4667] },
      { name: 'Muzaffarpur', state: 'Bihar', coordinates: [26.1167, 85.3833] },
      { name: 'Nalanda', state: 'Bihar', coordinates: [25.1333, 85.4500] },
      { name: 'Nawada', state: 'Bihar', coordinates: [24.8833, 85.5333] },
      { name: 'Purnia', state: 'Bihar', coordinates: [25.7833, 87.4667] },
      { name: 'Saharsa', state: 'Bihar', coordinates: [25.8833, 86.6000] },
      { name: 'Samastipur', state: 'Bihar', coordinates: [25.8667, 85.7833] },
      { name: 'Sheikhpura', state: 'Bihar', coordinates: [25.1333, 85.8500] },
      { name: 'Sheohar', state: 'Bihar', coordinates: [26.5167, 85.2833] },
      { name: 'Sitamarhi', state: 'Bihar', coordinates: [26.6000, 85.4833] },
      { name: 'Supaul', state: 'Bihar', coordinates: [26.1167, 86.6000] },
      { name: 'West Champaran', state: 'Bihar', coordinates: [27.0333, 84.3500] },
      
      // Chhattisgarh
      { name: 'Bijapur', state: 'Chhattisgarh', coordinates: [19.0833, 81.7500] },
      { name: 'Dantewada', state: 'Chhattisgarh', coordinates: [18.9000, 81.3500] },
      { name: 'Gariaband', state: 'Chhattisgarh', coordinates: [20.6167, 82.0667] },
      { name: 'Korba', state: 'Chhattisgarh', coordinates: [22.3500, 82.7000] },
      { name: 'Koriya', state: 'Chhattisgarh', coordinates: [23.2667, 82.6833] },
      { name: 'Narayanpur', state: 'Chhattisgarh', coordinates: [19.5000, 81.2000] },
      { name: 'Rajnandgaon', state: 'Chhattisgarh', coordinates: [21.1000, 81.0333] },
      { name: 'Sukma', state: 'Chhattisgarh', coordinates: [18.3833, 81.6667] },
      
      // Gujarat
      { name: 'Dahod', state: 'Gujarat', coordinates: [22.8333, 74.2500] },
      { name: 'Narmada', state: 'Gujarat', coordinates: [21.8833, 73.7000] },
      
      // Haryana
      { name: 'Mewat', state: 'Haryana', coordinates: [27.7833, 76.9667] },
      
      // Jharkhand
      { name: 'Chatra', state: 'Jharkhand', coordinates: [24.2000, 84.8667] },
      { name: 'Dumka', state: 'Jharkhand', coordinates: [24.2667, 87.2500] },
      { name: 'Garhwa', state: 'Jharkhand', coordinates: [24.1667, 83.8000] },
      { name: 'Godda', state: 'Jharkhand', coordinates: [24.8333, 87.2167] },
      { name: 'Gumla', state: 'Jharkhand', coordinates: [23.0500, 84.5333] },
      { name: 'Hazaribagh', state: 'Jharkhand', coordinates: [23.9833, 85.3667] },
      { name: 'Jamtara', state: 'Jharkhand', coordinates: [23.9667, 86.8000] },
      { name: 'Khunti', state: 'Jharkhand', coordinates: [23.0833, 85.2833] },
      { name: 'Latehar', state: 'Jharkhand', coordinates: [23.7333, 84.5000] },
      { name: 'Lohardaga', state: 'Jharkhand', coordinates: [23.4333, 84.6833] },
      { name: 'Pakur', state: 'Jharkhand', coordinates: [24.6333, 87.8500] },
      { name: 'Palamu', state: 'Jharkhand', coordinates: [24.0333, 84.0667] },
      { name: 'Ramgarh', state: 'Jharkhand', coordinates: [23.6333, 85.5167] },
      { name: 'Sahebganj', state: 'Jharkhand', coordinates: [25.2500, 87.6333] },
      { name: 'Simdega', state: 'Jharkhand', coordinates: [22.6167, 84.5167] },
      { name: 'West Singhbhum', state: 'Jharkhand', coordinates: [22.5667, 85.8167] },
      
      // Add more aspirational districts...
    ];

    this.ruralClusters = [];
    this.urbanCenters = [
      { name: 'Mumbai', coordinates: [19.0760, 72.8777], tier: 1 },
      { name: 'Delhi', coordinates: [28.7041, 77.1025], tier: 1 },
      { name: 'Bangalore', coordinates: [12.9716, 77.5946], tier: 1 },
      { name: 'Hyderabad', coordinates: [17.3850, 78.4867], tier: 1 },
      { name: 'Chennai', coordinates: [13.0827, 80.2707], tier: 1 },
      { name: 'Kolkata', coordinates: [22.5726, 88.3639], tier: 1 },
      { name: 'Pune', coordinates: [18.5204, 73.8567], tier: 1 },
      { name: 'Ahmedabad', coordinates: [23.0225, 72.5714], tier: 1 },
      { name: 'Jaipur', coordinates: [26.9124, 75.7873], tier: 2 },
      { name: 'Surat', coordinates: [21.1702, 72.8311], tier: 2 },
      { name: 'Lucknow', coordinates: [26.8467, 80.9462], tier: 2 },
      { name: 'Kanpur', coordinates: [26.4499, 80.3319], tier: 2 },
      { name: 'Nagpur', coordinates: [21.1458, 79.0882], tier: 2 },
      { name: 'Indore', coordinates: [22.7196, 75.8577], tier: 2 },
      { name: 'Thane', coordinates: [19.2183, 72.9781], tier: 2 },
      { name: 'Bhopal', coordinates: [23.2599, 77.4126], tier: 2 },
      { name: 'Visakhapatnam', coordinates: [17.6868, 83.2185], tier: 2 },
      { name: 'Pimpri-Chinchwad', coordinates: [18.6298, 73.7997], tier: 2 },
      { name: 'Patna', coordinates: [25.5941, 85.1376], tier: 2 },
      { name: 'Vadodara', coordinates: [22.3072, 73.1812], tier: 2 }
    ];
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Check if a location is in an aspirational district
  isAspirationalDistrict(district, state) {
    return this.aspirationalDistricts.some(ad => 
      ad.name.toLowerCase() === district.toLowerCase() && 
      ad.state.toLowerCase() === state.toLowerCase()
    );
  }

  // Get nearest aspirational district
  getNearestAspirationalDistrict(lat, lon) {
    let nearest = null;
    let minDistance = Infinity;

    this.aspirationalDistricts.forEach(district => {
      const distance = this.calculateDistance(lat, lon, district.coordinates[0], district.coordinates[1]);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...district, distance };
      }
    });

    return nearest;
  }

  // Classify location as rural/urban based on distance from urban centers
  classifyLocation(lat, lon) {
    const nearestUrbanCenter = this.getNearestUrbanCenter(lat, lon);
    
    if (nearestUrbanCenter.distance < 10) {
      return { type: 'urban', tier: nearestUrbanCenter.tier, center: nearestUrbanCenter.name };
    } else if (nearestUrbanCenter.distance < 50) {
      return { type: 'semi-urban', tier: nearestUrbanCenter.tier + 1, center: nearestUrbanCenter.name };
    } else {
      return { type: 'rural', tier: 3, center: nearestUrbanCenter.name };
    }
  }

  getNearestUrbanCenter(lat, lon) {
    let nearest = null;
    let minDistance = Infinity;

    this.urbanCenters.forEach(center => {
      const distance = this.calculateDistance(lat, lon, center.coordinates[0], center.coordinates[1]);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...center, distance };
      }
    });

    return nearest;
  }

  // DBSCAN clustering for geographic data
  dbscanClustering(points, epsilon = 50, minPoints = 3) {
    const clusters = [];
    const visited = new Set();
    const clustered = new Set();

    points.forEach((point, index) => {
      if (visited.has(index)) return;
      
      visited.add(index);
      const neighbors = this.getNeighbors(points, index, epsilon);
      
      if (neighbors.length < minPoints) {
        // Mark as noise
        point.cluster = -1;
      } else {
        // Start new cluster
        const clusterId = clusters.length;
        clusters.push([]);
        this.expandCluster(points, index, neighbors, clusterId, epsilon, minPoints, visited, clustered, clusters);
      }
    });

    return clusters;
  }

  getNeighbors(points, pointIndex, epsilon) {
    const neighbors = [];
    const point = points[pointIndex];
    
    points.forEach((otherPoint, index) => {
      if (index !== pointIndex) {
        const distance = this.calculateDistance(
          point.coordinates[0], point.coordinates[1],
          otherPoint.coordinates[0], otherPoint.coordinates[1]
        );
        if (distance <= epsilon) {
          neighbors.push(index);
        }
      }
    });
    
    return neighbors;
  }

  expandCluster(points, pointIndex, neighbors, clusterId, epsilon, minPoints, visited, clustered, clusters) {
    clusters[clusterId].push(pointIndex);
    clustered.add(pointIndex);
    points[pointIndex].cluster = clusterId;

    let i = 0;
    while (i < neighbors.length) {
      const neighborIndex = neighbors[i];
      
      if (!visited.has(neighborIndex)) {
        visited.add(neighborIndex);
        const neighborNeighbors = this.getNeighbors(points, neighborIndex, epsilon);
        
        if (neighborNeighbors.length >= minPoints) {
          neighbors.push(...neighborNeighbors);
        }
      }
      
      if (!clustered.has(neighborIndex)) {
        clusters[clusterId].push(neighborIndex);
        clustered.add(neighborIndex);
        points[neighborIndex].cluster = clusterId;
      }
      
      i++;
    }
  }

  // Generate geographic insights for opportunities
  generateGeographicInsights(opportunities) {
    const insights = {
      totalOpportunities: opportunities.length,
      stateDistribution: {},
      tierDistribution: { tier1: 0, tier2: 0, tier3: 0 },
      aspirationalCoverage: 0,
      ruralCoverage: 0,
      clusters: [],
      recommendations: []
    };

    // Analyze distribution
    opportunities.forEach(opp => {
      if (opp.location && opp.location.coordinates) {
        const [lat, lon] = opp.location.coordinates;
        const classification = this.classifyLocation(lat, lon);
        const isAspirational = this.isAspirationalDistrict(opp.location.district, opp.location.state);
        
        // State distribution
        insights.stateDistribution[opp.location.state] = 
          (insights.stateDistribution[opp.location.state] || 0) + 1;
        
        // Tier distribution
        if (classification.tier === 1) insights.tierDistribution.tier1++;
        else if (classification.tier === 2) insights.tierDistribution.tier2++;
        else insights.tierDistribution.tier3++;
        
        // Aspirational and rural coverage
        if (isAspirational) insights.aspirationalCoverage++;
        if (classification.type === 'rural') insights.ruralCoverage++;
      }
    });

    // Calculate percentages
    insights.aspirationalCoverage = (insights.aspirationalCoverage / opportunities.length) * 100;
    insights.ruralCoverage = (insights.ruralCoverage / opportunities.length) * 100;

    // Generate recommendations
    if (insights.aspirationalCoverage < 35) {
      insights.recommendations.push({
        type: 'aspirational',
        message: `Only ${insights.aspirationalCoverage.toFixed(1)}% of opportunities are in aspirational districts. Target: 35%`,
        priority: 'high'
      });
    }

    if (insights.ruralCoverage < 25) {
      insights.recommendations.push({
        type: 'rural',
        message: `Only ${insights.ruralCoverage.toFixed(1)}% of opportunities are in rural areas. Target: 25%`,
        priority: 'medium'
      });
    }

    // Perform clustering
    const pointsWithCoordinates = opportunities
      .filter(opp => opp.location && opp.location.coordinates)
      .map(opp => ({
        id: opp._id,
        coordinates: opp.location.coordinates,
        title: opp.title,
        company: opp.company
      }));

    insights.clusters = this.dbscanClustering(pointsWithCoordinates);

    return insights;
  }

  // Get location recommendations for better coverage
  getLocationRecommendations(currentOpportunities) {
    const insights = this.generateGeographicInsights(currentOpportunities);
    const recommendations = [];

    // Find underrepresented aspirational districts
    const coveredAspirational = new Set();
    currentOpportunities.forEach(opp => {
      if (opp.location && this.isAspirationalDistrict(opp.location.district, opp.location.state)) {
        coveredAspirational.add(`${opp.location.district}-${opp.location.state}`);
      }
    });

    const uncoveredAspirational = this.aspirationalDistricts.filter(district => 
      !coveredAspirational.has(`${district.name}-${district.state}`)
    );

    // Recommend top 10 uncovered aspirational districts
    recommendations.push(...uncoveredAspirational.slice(0, 10).map(district => ({
      type: 'aspirational_district',
      location: district,
      reason: 'Underrepresented aspirational district',
      priority: 'high',
      potentialImpact: 'Improves rural and aspirational coverage'
    })));

    return recommendations;
  }

  // Calculate geographic diversity score
  calculateDiversityScore(opportunities) {
    const stateCount = new Set(opportunities.map(opp => opp.location?.state).filter(Boolean)).size;
    const totalStates = 28; // Total states in India
    
    const insights = this.generateGeographicInsights(opportunities);
    
    const diversityScore = {
      stateSpread: (stateCount / totalStates) * 100,
      aspirationalCoverage: insights.aspirationalCoverage,
      ruralCoverage: insights.ruralCoverage,
      tierBalance: this.calculateTierBalance(insights.tierDistribution),
      overall: 0
    };

    // Calculate overall score (weighted average)
    diversityScore.overall = (
      diversityScore.stateSpread * 0.3 +
      diversityScore.aspirationalCoverage * 0.3 +
      diversityScore.ruralCoverage * 0.2 +
      diversityScore.tierBalance * 0.2
    );

    return diversityScore;
  }

  calculateTierBalance(tierDistribution) {
    const total = tierDistribution.tier1 + tierDistribution.tier2 + tierDistribution.tier3;
    if (total === 0) return 0;

    // Ideal distribution: 40% tier1, 35% tier2, 25% tier3
    const ideal = { tier1: 0.4, tier2: 0.35, tier3: 0.25 };
    const actual = {
      tier1: tierDistribution.tier1 / total,
      tier2: tierDistribution.tier2 / total,
      tier3: tierDistribution.tier3 / total
    };

    // Calculate deviation from ideal
    const deviation = Math.abs(actual.tier1 - ideal.tier1) +
                     Math.abs(actual.tier2 - ideal.tier2) +
                     Math.abs(actual.tier3 - ideal.tier3);

    return Math.max(0, 100 - (deviation * 100));
  }
}

const geospatialService = new GeospatialService();
module.exports = { geospatialService };