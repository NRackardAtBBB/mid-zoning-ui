import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import ProjectTooltip from './ProjectTooltip';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibnJhY2thcmQiLCJhIjoiY21kYnk0cDhzMDVtcDJ3b2lyaDAwNGd4diJ9.qjnDz61lZT7pqrqUP-SJKA';

function MapView({ projects, onProjectClick, onProjectHover, onProjectLeave }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewState, setViewState] = useState({
    longitude: -73.9857,
    latitude: 40.7589,
    zoom: 15
  });

  // Mock GeoJSON data for Manhattan zoning lots
  const zoningLotsGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { block: "1234", lot: "56", bbl: "1012340056" },
        geometry: {
          type: "Polygon",
          coordinates: [[[
            [-73.9877, 40.7599],
            [-73.9867, 40.7599],
            [-73.9867, 40.7589],
            [-73.9877, 40.7589],
            [-73.9877, 40.7599]
          ]]]
        }
      },
      {
        type: "Feature",
        properties: { block: "5678", lot: "90", bbl: "1056780090" },
        geometry: {
          type: "Polygon",
          coordinates: [[[
            [-73.9847, 40.7579],
            [-73.9837, 40.7579],
            [-73.9837, 40.7569],
            [-73.9847, 40.7569],
            [-73.9847, 40.7579]
          ]]]
        }
      },
      {
        type: "Feature",
        properties: { block: "9012", lot: "34", bbl: "1090120034" },
        geometry: {
          type: "Polygon",
          coordinates: [[[
            [-73.9887, 40.7559],
            [-73.9877, 40.7559],
            [-73.9877, 40.7549],
            [-73.9887, 40.7549],
            [-73.9887, 40.7559]
          ]]]
        }
      }
    ]
  };

  // Create array of project blocks for filtering
  const projectBlocks = projects.map(p => p.block);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    console.log('Initializing map with token:', MAPBOX_TOKEN ? 'Token exists' : 'No token');
    
    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        accessToken: MAPBOX_TOKEN
      });
      
      mapRef.current = map;
      console.log('Map created successfully');

      map.on('load', () => {
        console.log('Map loaded, adding sources and layers');
        
        // Add zoning lots source
        map.addSource('zoning-lots', {
          type: 'geojson',
          data: zoningLotsGeoJSON
        });

        // Add fill layer for lots
        map.addLayer({
          id: 'lots-fill',
          type: 'fill',
          source: 'zoning-lots',
          paint: {
            'fill-color': [
              'case',
              ['in', ['get', 'block'], ['literal', projectBlocks]],
              '#3b82f6', // Blue for project lots
              '#1e293b'  // Dark for regular lots
            ],
            'fill-opacity': [
              'case',
              ['in', ['get', 'block'], ['literal', projectBlocks]],
              0.8,
              0.4
            ]
          }
        });

        // Add border layer for lots
        map.addLayer({
          id: 'lots-border',
          type: 'line',
          source: 'zoning-lots',
          paint: {
            'line-color': [
              'case',
              ['in', ['get', 'block'], ['literal', projectBlocks]],
              '#60a5fa', // Light blue border for projects
              '#475569'  // Gray border for regular lots
            ],
            'line-width': [
              'case',
              ['in', ['get', 'block'], ['literal', projectBlocks]],
              2,
              1
            ]
          }
        });

        // Add click event for lots
        map.on('click', 'lots-fill', (e) => {
          const feature = e.features[0];
          const { block, lot } = feature.properties;
          
          // Find matching project
          const project = projects.find(p => 
            p.block === block && p.lot === lot
          );
          
          if (project && onProjectClick) {
            onProjectClick(project);
          }
        });

        // Add hover events for lots
        map.on('mouseenter', 'lots-fill', (e) => {
          const feature = e.features[0];
          const { block, lot } = feature.properties;
          
          // Find matching project
          const project = projects.find(p => 
            p.block === block && p.lot === lot
          );
          
          if (project) {
            map.getCanvas().style.cursor = 'pointer';
            setHoveredProject(project);
            setMousePosition({ x: e.point.x, y: e.point.y });
            onProjectHover && onProjectHover(project);
          }
        });

        map.on('mouseleave', 'lots-fill', () => {
          map.getCanvas().style.cursor = '';
          setHoveredProject(null);
          onProjectLeave && onProjectLeave();
        });

        // Update mouse position for tooltip
        map.on('mousemove', 'lots-fill', (e) => {
          const feature = e.features[0];
          const { block, lot } = feature.properties;
          
          const project = projects.find(p => 
            p.block === block && p.lot === lot
          );
          
          if (project) {
            setMousePosition({ x: e.point.x, y: e.point.y });
          }
        });
        
        console.log('All layers and events added successfully');
      });

      map.on('error', (e) => {
        console.error('Map error:', e);
      });

      map.on('move', () => {
        const { lng, lat } = map.getCenter();
        setViewState({ longitude: lng, latitude: lat, zoom: map.getZoom() });
      });

      return () => {
        console.log('Cleaning up map');
        map.remove();
      };
      
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const source = mapRef.current.getSource('zoning-lots');
    if (source && source.setData) {
      source.setData(zoningLotsGeoJSON);
    }
  }, [projects]);

  // Show fallback if no Mapbox token
  if (!MAPBOX_TOKEN) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '48px' }}>🗺️</div>
        <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 'bold' }}>
          Mapbox Token Required
        </div>
        <div style={{ color: '#94a3b8', textAlign: 'center', maxWidth: '400px' }}>
          Add your Mapbox token to .env file:<br/>
          <code style={{ color: '#3b82f6' }}>VITE_MAPBOX_TOKEN=your_token_here</code>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Map Controls Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #475569',
        backdropFilter: 'blur(8px)',
        zIndex: 1000
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '4px' }}>
          Midtown Manhattan
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          {projects.length} active projects
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #475569',
        backdropFilter: 'blur(8px)',
        zIndex: 1000
      }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '8px' }}>
          Legend
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#3b82f6',
            border: '1px solid #60a5fa',
            borderRadius: '2px'
          }}></div>
          <span style={{ fontSize: '11px', color: '#e2e8f0' }}>Active Projects</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '2px'
          }}></div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Available Lots</span>
        </div>
      </div>

      {/* Project Tooltip */}
      {hoveredProject && (
        <ProjectTooltip
          project={hoveredProject}
          position={mousePosition}
        />
      )}
    </div>
  );
}

export default MapView;