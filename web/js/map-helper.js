/**
 * TamirHanem Web - Google Maps Helper
 * Simple Google Maps integration
 */

class MapHelper {
  constructor() {
    this.map = null;
    this.markers = [];
    this.defaultCenter = CONFIG.DEFAULT_LOCATION;
    this.defaultZoom = 12;
  }

  /**
   * Initialize Google Maps
   * Note: Google Maps API key required
   */
  async init(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Map element not found');
      return null;
    }

    // Check if Google Maps is loaded
    if (typeof google === 'undefined' || !google.maps) {
      console.warn('Google Maps not loaded. Using placeholder.');
      this.showPlaceholder(element, options.center);
      return null;
    }

    const mapOptions = {
      center: options.center || this.defaultCenter,
      zoom: options.zoom || this.defaultZoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      ...options.mapOptions
    };

    this.map = new google.maps.Map(element, mapOptions);
    return this.map;
  }

  /**
   * Show placeholder when Google Maps not available
   */
  showPlaceholder(element, location) {
    const lat = location?.lat || this.defaultCenter.lat;
    const lng = location?.lng || this.defaultCenter.lng;

    element.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f0f0f0; color: #666;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
        <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Harita</div>
        <div style="font-size: 0.875rem; color: #999;">Konum: ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}"
          target="_blank"
          style="margin-top: 1rem; padding: 0.5rem 1rem; background: #ffc507; color: #1a1a1a; border-radius: 8px; text-decoration: none; font-weight: 600;"
        >
          Google Maps'te Aç
        </a>
      </div>
    `;
  }

  /**
   * Add marker
   */
  addMarker(location, options = {}) {
    if (!this.map) return null;

    const marker = new google.maps.Marker({
      map: this.map,
      position: location,
      title: options.title || '',
      icon: options.icon || null,
      ...options
    });

    this.markers.push(marker);

    // Add info window if content provided
    if (options.infoWindow) {
      const infoWindow = new google.maps.InfoWindow({
        content: options.infoWindow
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    }

    return marker;
  }

  /**
   * Clear all markers
   */
  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  /**
   * Center map to location
   */
  centerTo(location, zoom) {
    if (!this.map) return;
    this.map.setCenter(location);
    if (zoom) this.map.setZoom(zoom);
  }

  /**
   * Fit bounds to markers
   */
  fitBounds() {
    if (!this.map || this.markers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach(marker => bounds.extend(marker.getPosition()));
    this.map.fitBounds(bounds);
  }

  /**
   * Get user location
   */
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }

  /**
   * Calculate distance between two points
   */
  calculateDistance(point1, point2) {
    return Utils.calculateDistance(
      point1.lat,
      point1.lng,
      point2.lat,
      point2.lng
    );
  }
}

// Create singleton instance
const mapHelper = new MapHelper();
