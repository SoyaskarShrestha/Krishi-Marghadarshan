import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SoilDataLayer.css';

const SoilDataLayer = () => {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  // Fetch available soil layers
  useEffect(() => {
    const fetchLayers = async () => {
      try {
        const response = await axios.get('/api/soil/raster/layers/');
        setLayers(response.data.layers);
        if (response.data.layers.length > 0) {
          setSelectedLayer(response.data.layers[0].name);
        }
      } catch (error) {
        console.error('Error fetching soil layers:', error);
      }
    };

    fetchLayers();
  }, []);

  // Handle map click to extract soil data at point
  const handleMapClick = async (e) => {
    if (!mapInstance) return;

    const { lat, lng } = e.latlng;
    setLoading(true);

    try {
      const response = await axios.get('/api/soil/raster/point/', {
        params: { lat, lon: lng }
      });
      setPointData(response.data);
    } catch (error) {
      console.error('Error fetching soil data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get color based on parameter value
  const getColor = (value, min, max) => {
    if (value === null) return '#cccccc';
    
    const normalized = (value - min) / (max - min);
    if (normalized < 0.2) return '#d7191c';
    if (normalized < 0.4) return '#fdae61';
    if (normalized < 0.6) return '#ffffbf';
    if (normalized < 0.8) return '#a6d96a';
    return '#1a9641';
  };

  const currentLayer = layers.find(l => l.name === selectedLayer);

  return (
    <div className="soil-data-container">
      <div className="soil-controls">
        <h3>Soil Data Layers</h3>
        
        <div className="layer-selector">
          <label>Select Parameter:</label>
          <select 
            value={selectedLayer || ''} 
            onChange={(e) => setSelectedLayer(e.target.value)}
          >
            {layers.map((layer) => (
              <option key={layer.name} value={layer.name}>
                {layer.display_name} ({layer.unit})
              </option>
            ))}
          </select>
        </div>

        {currentLayer && (
          <div className="layer-info">
            <h4>{currentLayer.display_name}</h4>
            <p className="unit">Unit: <strong>{currentLayer.unit}</strong></p>
            
            <div className="stats">
              <div className="stat-item">
                <label>Min:</label>
                <span>{currentLayer.stats.min.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <label>Max:</label>
                <span>{currentLayer.stats.max.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <label>Mean:</label>
                <span>{currentLayer.stats.mean.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <label>Median:</label>
                <span>{currentLayer.stats.median.toFixed(2)}</span>
              </div>
            </div>

            <div className="color-scale">
              <div className="scale-label">Low</div>
              <div className="scale-gradient"></div>
              <div className="scale-label">High</div>
            </div>
          </div>
        )}

        <button 
          className="click-info-btn"
          onClick={() => alert('Click on the map to extract soil data at that location')}
        >
          Click on Map for Data
        </button>
      </div>

      {pointData && (
        <div className="point-data">
          <h4>Soil Data at Point</h4>
          <p className="coordinates">
            Lat: {pointData.latitude.toFixed(4)}, Lon: {pointData.longitude.toFixed(4)}
          </p>
          
          <div className="parameters-grid">
            {Object.entries(pointData.parameters).map(([param, data]) => (
              <div key={param} className="param-card">
                <div className="param-name">{param.toUpperCase()}</div>
                {data.value !== null ? (
                  <div 
                    className="param-value"
                    style={{
                      color: getColor(
                        data.value,
                        layers.find(l => l.name === param)?.stats.min || 0,
                        layers.find(l => l.name === param)?.stats.max || 100
                      )
                    }}
                  >
                    {data.value.toFixed(2)}
                  </div>
                ) : (
                  <div className="param-error">{data.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading soil data...</div>}
    </div>
  );
};

export default SoilDataLayer;
