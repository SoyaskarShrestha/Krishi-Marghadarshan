import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { apiRequest } from '../../lib/api';
import './MapLocationSelector.css';

const selectedPointIcon = L.divIcon({
  className: 'selected-location-marker',
  html: '<div class="selected-location-marker-inner"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const MapLocationSelector = ({ onLocationSelect, onClose, soilTypes }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [soilData, setSoilData] = useState(null);
  const [districtGuess, setDistrictGuess] = useState('');
  const [error, setError] = useState('');

  const selectLocation = async (lat, lng) => {
    if (!map.current) {
      return;
    }

    console.log('Map selected at:', lat, lng);
    setSelectedCoords({ lat, lng });
    setLoading(true);
    setError('');

    try {
      if (markerRef.current) {
        map.current.removeLayer(markerRef.current);
      }

      markerRef.current = L.marker([lat, lng], { icon: selectedPointIcon })
        .addTo(map.current)
        .bindPopup(`<div style="font-weight: 600;">Selected Location</div><div style="font-size: 12px;">Lat: ${lat.toFixed(4)}<br/>Lon: ${lng.toFixed(4)}</div>`)
        .openPopup();

      const [payload, districtPayload] = await Promise.all([
        apiRequest(`/soil/raster/point/?lat=${lat}&lon=${lng}`),
        apiRequest(`/soil/reverse-district/?lat=${lat}&lon=${lng}`),
      ]);

      setSoilData(payload);
      setDistrictGuess(districtPayload?.district_guess || '');
      setError('');
    } catch (err) {
      setError('Failed to fetch soil data. Please try again.');
      console.error('Error fetching soil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMapMouseDown = (event) => {
    if (!map.current) {
      return;
    }

    const { lat, lng } = map.current.mouseEventToLatLng(event.nativeEvent);
    selectLocation(lat, lng);
  };

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = L.map(mapContainer.current).setView([27.7, 85.3], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    setTimeout(() => {
      map.current?.invalidateSize();
    }, 0);

    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      selectLocation(lat, lng);
    };

    map.current.on('click', handleClick);

    return () => {
      if (map.current) {
        map.current.off('click', handleClick);
      }
    };
  }, []);

  const handleConfirm = () => {
    if (!selectedCoords) {
      setError('Please select a location and wait for data to load');
      return;
    }

    // Transform soil data to match form fields
    const params = soilData?.parameters || {};
    const processedData = {
      latitude: selectedCoords.lat,
      longitude: selectedCoords.lng,
      District: districtGuess,
      Altitude_m: estimateAltitude(selectedCoords.lat, selectedCoords.lng),
      Soil_pH: params.ph?.value || '',
      Nitrogen_kg_ha: convertNitrogenToKgHa(params.nitrogen?.value),
      Phosphorus_kg_ha: convertPhosphorusToKgHa(params.phosphorus?.value),
      Potassium_kg_ha: convertPotassiumToKgHa(params.potassium?.value),
      Soil_Type: estimateSoilType(params.clay?.value, params.sand?.value, params.silt?.value, soilTypes),
    };

    onLocationSelect(processedData);
  };

  return (
    <div className="map-modal-overlay">
      <div className="map-modal">
        <div className="map-modal-header">
          <h2>Select Location on Map</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="map-modal-body">
          <div className="map-instructions">
            <p>📍 Click anywhere on the map to select a location</p>
            <p>Zoom using scroll wheel or +/- buttons</p>
          </div>
          <div ref={mapContainer} className="map-container" onMouseDownCapture={handleMapMouseDown}></div>

          {selectedCoords ? (
            <div className="selected-coordinates-banner">
              Selected: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
            </div>
          ) : null}

          {selectedCoords && soilData && (
            <div className="soil-preview">
              <h3>Extracted Soil Data</h3>
              <p className="soil-preview-note">
                {soilData?.parameters ? 'Values found below. Missing fields are marked N/A.' : 'No soil values could be extracted for this point.'}
              </p>
              <div className="preview-item">
                <label>District Guess:</label>
                <span>{districtGuess || 'N/A'}</span>
              </div>
              <div className="soil-preview-grid">
                <div className="preview-item">
                  <label>pH Level:</label>
                  <span>{soilData?.parameters?.ph?.value?.toFixed(2) || 'N/A'}</span>
                  {soilData?.parameters?.ph?.error ? <small>{soilData.parameters.ph.error}</small> : null}
                </div>
                <div className="preview-item">
                  <label>Nitrogen (%):</label>
                  <span>{soilData?.parameters?.nitrogen?.value?.toFixed(2) || 'N/A'}</span>
                  {soilData?.parameters?.nitrogen?.error ? <small>{soilData.parameters.nitrogen.error}</small> : null}
                </div>
                <div className="preview-item">
                  <label>Phosphorus (mg/kg):</label>
                  <span>{soilData?.parameters?.phosphorus?.value?.toFixed(2) || 'N/A'}</span>
                  {soilData?.parameters?.phosphorus?.error ? <small>{soilData.parameters.phosphorus.error}</small> : null}
                </div>
                <div className="preview-item">
                  <label>Potassium (mg/kg):</label>
                  <span>{soilData?.parameters?.potassium?.value?.toFixed(2) || 'N/A'}</span>
                  {soilData?.parameters?.potassium?.error ? <small>{soilData.parameters.potassium.error}</small> : null}
                </div>
                <div className="preview-item">
                  <label>Clay (%):</label>
                  <span>{soilData?.parameters?.clay?.value?.toFixed(2) || 'N/A'}</span>
                  {soilData?.parameters?.clay?.error ? <small>{soilData.parameters.clay.error}</small> : null}
                </div>
                <div className="preview-item">
                  <label>Sand (%):</label>
                  <span>{soilData?.parameters?.sand?.value?.toFixed(2) || 'N/A'}</span>
                  {soilData?.parameters?.sand?.error ? <small>{soilData.parameters.sand.error}</small> : null}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-spinner">
              <p>Fetching soil data...</p>
            </div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}
        </div>

        <div className="map-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={!selectedCoords || loading}
          >
            {loading ? 'Loading...' : 'Confirm Location'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function estimateAltitude(lat, lng) {
  // Estimate altitude based on latitude (Nepal ranges from ~70m to ~8848m)
  // This is a rough estimate; for accuracy, use a DEM API
  const baseAltitude = 100;
  const variation = Math.abs((lat - 26.5) * 100);
  return Math.round(baseAltitude + variation);
}

function convertNitrogenToKgHa(nitrogenPercent) {
  // Rough conversion: % to kg/ha (assuming 20cm soil depth, 1.3 g/cm³ bulk density)
  if (!nitrogenPercent) return '';
  return Math.round(nitrogenPercent * 1000 * 13 / 100); // Simplified conversion
}

function convertPhosphorusToKgHa(phosphorusMgKg) {
  // mg/kg to kg/ha: 1 mg/kg ≈ 1 kg/ha at 20cm depth
  if (!phosphorusMgKg) return '';
  return Math.round(phosphorusMgKg);
}

function convertPotassiumToKgHa(potassiumMgKg) {
  // mg/kg to kg/ha
  if (!potassiumMgKg) return '';
  return Math.round(potassiumMgKg);
}

function estimateSoilType(clay, sand, silt, soilTypes) {
  if (!clay || !sand || !silt) return soilTypes?.[0] || '';

  // USDA soil texture classification
  if (clay > 40) return 'Clay';
  if (sand > 70) return 'Sand';
  if (silt > 50 && clay < 27) return 'Silt Loam';
  if (clay > 20 && clay < 35 && sand > 45) return 'Sandy Loam';
  if (clay > 20 && clay < 35) return 'Loam';
  
  // Return first available soil type if no match
  return soilTypes?.[0] || 'Loam';
}

export default MapLocationSelector;
