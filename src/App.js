import React, { Component } from 'react';
import List from './List';
import Map from './Map';
import InfoWindow from './InfoWindow';
import './App.css';

const FOURSQUARE = require('react-foursquare')({
  clientID: '0SBSQO3MDV2CIC4CZCWIR4CGVHDINGHM3HRYSOVH3HJELEXV',
  clientSecret: 'JBYJVPSE3OAGX34IXQT122B0PKAB0ZLKA1CY3ZRH43MKZE2Q'
});

class App extends Component {
  state = {
    places: [],
    selectedPlace: null
  }

  /**
   * Coloca marcadores pelo mapa conforme array de lugares recebido
   */
  handleSetMarkers = (places) => {
    this.setState({ places });
  }

  /**
   * Manipula cliques nos marcadores
   */
  handleMarkerClick = (marker) => {
    // Atualiza os lugares e marca o clicado.
    const places = this.state.places.map((p, index) => {
      if (index === marker) {
        p.clicked = true;
      } else {
        p.clicked = false;
      }
      return p;
    });

    // Recupera detalhes na API externa.
    this.getInfo(this.state.places[marker])
      .then(fsResponse => {
        // Set state of the component
        this.setState({
          places: places,
          selectedPlace: fsResponse.response.venue
        });

        // Coloca foco na janela do modal aberta
        document.querySelector('.info-window').focus();
      })
      .catch(error => {
        this.showError();
        console.log(error);
      });
  }

  /**
   * Esconde o modal 
   */
  handleHidingInfoWindow = () => {
    const places = this.state.places.map((p, index) => {
      p.clicked = false;
      return p;
    });

    // Atualiza o estado do componente
    this.setState({ places: places, selectedPlace: null });
  }

  /**
   * Retorna resposta do Foursquare
   */
  getInfo = (place) => {
    return FOURSQUARE.venues.getVenue({
      'venue_id': place.id
    })
  }

  /**
   * Mostra um modal de erro
   */
  showError = () => {
    const block = document.querySelector('.error');
    block.style.opacity = 1;
    setTimeout(() => {
      block.style.opacity = 0;
    }, 3000);
  }

  render() {
    const placesInfo = this.state.places.map(v => {
      return { lat: v.location.lat, lng: v.location.lng, clicked: v.clicked }
    });

    return (
      <div className='app-container'>
        <List
          foursquare={FOURSQUARE}
          setMarkers={this.handleSetMarkers}
          onPlaceClick={this.handleMarkerClick} />
        <Map
          places={placesInfo}
          hideInfoWindow={this.handleHidingInfoWindow}
          onMarkerClick={this.handleMarkerClick}
          onError={this.showError}
           />
        {this.state.selectedPlace && (<InfoWindow
          place={this.state.selectedPlace}
          foursquare={FOURSQUARE}
          hideInfoWindow={this.handleHidingInfoWindow} />)}
        <div
          style={{ opacity: 0 }}
          className='error'>Something went wrong</div>
      </div>
    );
  }
}

export default App;