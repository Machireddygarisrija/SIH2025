import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Building2, Target, Filter, Download } from 'lucide-react';

// Leaflet imports
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GeospatialMapProps {
  data: any[];
  type: 'users' | 'opportunities' | 'clusters';
  onMarkerClick?: (item: any) => void;
  filters?: {
    showRural?: boolean;
    showAspirational?: boolean;
    showUrban?: boolean;
  };
}

export default function GeospatialMap({ data, type, onMarkerClick, filters }: GeospatialMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup>(new L.LayerGroup());
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mapStats, setMapStats] = useState({
    total: 0,
    rural: 0,
    urban: 0,
    aspirational: 0
  });

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Center of India

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add markers layer group
      markersRef.current.addTo(mapInstanceRef.current);
    }

    // Update markers when data changes
    updateMarkers();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data, filters]);

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    let stats = { total: 0, rural: 0, urban: 0, aspirational: 0 };

    data.forEach((item, index) => {
      // Apply filters
      if (filters) {
        if (!filters.showRural && item.isRural) return;
        if (!filters.showAspirational && item.isAspirational) return;
        if (!filters.showUrban && !item.isRural) return;
      }

      const coordinates = item.coordinates || [item.latitude, item.longitude];
      if (!coordinates || coordinates.length !== 2) return;

      // Create custom icon based on type and properties
      const icon = createCustomIcon(item, type);
      
      // Create marker
      const marker = L.marker([coordinates[0], coordinates[1]], { icon })
        .bindPopup(createPopupContent(item, type))
        .on('click', () => {
          setSelectedItem(item);
          if (onMarkerClick) onMarkerClick(item);
        });

      markersRef.current.addLayer(marker);

      // Update stats
      stats.total++;
      if (item.isRural) stats.rural++;
      else stats.urban++;
      if (item.isAspirational) stats.aspirational++;
    });

    setMapStats(stats);

    // Fit map to markers if there are any
    if (markersRef.current.getLayers().length > 0) {
      const group = new L.featureGroup(markersRef.current.getLayers());
      mapInstanceRef.current?.fitBounds(group.getBounds().pad(0.1));
    }
  };

  const createCustomIcon = (item: any, type: string) => {
    let color = '#3B82F6'; // Default blue
    let size = 25;

    if (type === 'users') {
      if (item.isAspirational) color = '#10B981'; // Green for aspirational
      else if (item.isRural) color = '#F59E0B'; // Orange for rural
      else color = '#3B82F6'; // Blue for urban
      
      size = Math.min(15 + (item.userCount || 1) * 2, 35);
    } else if (type === 'opportunities') {
      if (item.sector === 'technology') color = '#8B5CF6'; // Purple
      else if (item.sector === 'healthcare') color = '#EF4444'; // Red
      else if (item.sector === 'education') color = '#10B981'; // Green
      else color = '#F59E0B'; // Orange for others
    } else if (type === 'clusters') {
      color = item.cluster === -1 ? '#6B7280' : `hsl(${(item.cluster * 137.5) % 360}, 70%, 50%)`;
      size = 30;
    }

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size > 25 ? '12px' : '10px'};
        ">
          ${type === 'users' ? (item.userCount || 1) : 
            type === 'opportunities' ? '💼' : 
            item.cluster === -1 ? '?' : item.cluster}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  const createPopupContent = (item: any, type: string) => {
    if (type === 'users') {
      return `
        <div class="p-2">
          <h3 class="font-bold text-sm">${item.district}, ${item.state}</h3>
          <p class="text-xs text-gray-600">Users: ${item.userCount}</p>
          <div class="mt-2 space-y-1">
            ${item.isRural ? '<span class="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Rural</span>' : ''}
            ${item.isAspirational ? '<span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Aspirational</span>' : ''}
          </div>
          ${item.roleDistribution ? `
            <div class="mt-2 text-xs">
              <p>Applicants: ${item.roleDistribution.applicant || 0}</p>
              <p>Recruiters: ${item.roleDistribution.recruiter || 0}</p>
              <p>Mentors: ${item.roleDistribution.mentor || 0}</p>
            </div>
          ` : ''}
        </div>
      `;
    } else if (type === 'opportunities') {
      return `
        <div class="p-2">
          <h3 class="font-bold text-sm">${item.title}</h3>
          <p class="text-xs text-gray-600">${item.company}</p>
          <p class="text-xs text-gray-600">${item.location}</p>
          <div class="mt-2">
            <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${item.sector}</span>
          </div>
        </div>
      `;
    } else if (type === 'clusters') {
      return `
        <div class="p-2">
          <h3 class="font-bold text-sm">
            ${item.cluster === -1 ? 'Outlier' : `Cluster ${item.cluster}`}
          </h3>
          <p class="text-xs text-gray-600">${item.title}</p>
          <p class="text-xs text-gray-600">${item.company}</p>
          <p class="text-xs text-gray-600">${item.state}, ${item.district}</p>
        </div>
      `;
    }
    return '';
  };

  const exportMapData = () => {
    const exportData = data.map(item => ({
      ...item,
      type,
      exportedAt: new Date().toISOString()
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geospatial-${type}-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-96 rounded-lg border border-gray-200" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <button
          onClick={exportMapData}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Map Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{mapStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Urban</p>
              <p className="text-xl font-bold text-gray-900">{mapStats.urban}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Rural</p>
              <p className="text-xl font-bold text-gray-900">{mapStats.rural}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Aspirational</p>
              <p className="text-xl font-bold text-gray-900">{mapStats.aspirational}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Selected Item Details */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">
                {type === 'users' ? `${selectedItem.district}, ${selectedItem.state}` :
                 type === 'opportunities' ? selectedItem.title :
                 selectedItem.cluster === -1 ? 'Outlier Point' : `Cluster ${selectedItem.cluster}`}
              </h3>
              
              {type === 'users' && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">Total Users: {selectedItem.userCount}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.isRural && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Rural</span>
                    )}
                    {selectedItem.isAspirational && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Aspirational</span>
                    )}
                  </div>
                  {selectedItem.roleDistribution && (
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>Applicants: {selectedItem.roleDistribution.applicant || 0}</div>
                      <div>Recruiters: {selectedItem.roleDistribution.recruiter || 0}</div>
                      <div>Mentors: {selectedItem.roleDistribution.mentor || 0}</div>
                      <div>Admins: {selectedItem.roleDistribution.admin || 0}</div>
                    </div>
                  )}
                </div>
              )}

              {type === 'opportunities' && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">{selectedItem.company}</p>
                  <p className="text-sm text-gray-600">{selectedItem.location}</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {selectedItem.sector}
                  </span>
                </div>
              )}

              {type === 'clusters' && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">{selectedItem.company}</p>
                  <p className="text-sm text-gray-600">{selectedItem.state}, {selectedItem.district}</p>
                  <p className="text-xs text-gray-500">
                    {selectedItem.cluster === -1 ? 'This point is an outlier' : `Part of cluster ${selectedItem.cluster}`}
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          {type === 'users' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Urban Areas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span>Rural Areas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Aspirational Districts</span>
              </div>
            </>
          )}
          
          {type === 'opportunities' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span>Technology</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Healthcare</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Education</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span>Others</span>
              </div>
            </>
          )}
          
          {type === 'clusters' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-full"></div>
                <span>Clusters (colored by group)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span>Outliers</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}