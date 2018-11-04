import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

/**
 * Seleciona valor no mapa carregado
 */
function onMapLoaded() {
  window.isMapLoaded = true;
}

/**
 * Component do Mapa
 */
const MapComponent = withScriptjs(withGoogleMap(props => {
    return <GoogleMap
      defaultZoom={10}
      defaultCenter={props.places.length > 0 ? props.places[0] : {lat: -23.5639953, lng: -46.6230968}}
      defaultOptions={{mapTypeControl: false}}
      onClick={props.hideInfoWindow}
      >
      {props.isMarkerShown && (props.places.map((place, index) =>
        <Marker
          key={index}
          position={place}
          animation={place.clicked ?
            window.google.maps.Animation.BOUNCE : 0}
          onClick={() => {props.onMarkerClick(index)}} /> ))
      }
    </GoogleMap>
  }
))

/**
 * Container do Mapa com Mapa dentro
 */
class Map extends Component {
  componentDidMount() {
    // Valor inicial
    window.isMapLoaded = false;

    // Callback
    window.onMapLoaded = onMapLoaded;

    // 10 segundos para carregamento
    setTimeout(() => {
      if (!window.isMapLoaded) {
        this.props.onError();
      }
    }, 10000);
  }

  render() {
    return <div
      role='region'
      aria-label='map'
      className='map-container'
      style={{marginLeft: '250px'}}>
      <MapComponent
        isMarkerShown={this.props.places.length > 0}
        googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyBJfHvwPwfcnE84Np5u3YXEaDhp-ADsJNE&v=3.exp&libraries=geometry,drawing,places&callback=onMapLoaded'
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        places={this.props.places}
        hideInfoWindow={this.props.hideInfoWindow}
        onMarkerClick={this.props.onMarkerClick}
      />
    </div>;
  }
}

export default Map;