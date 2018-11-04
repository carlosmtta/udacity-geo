import React, { Component } from 'react';
import Geocode from 'react-geocode';
import escapeRegExp from 'escape-string-regexp';

Geocode.setApiKey('AIzaSyBJfHvwPwfcnE84Np5u3YXEaDhp-ADsJNE');

class List extends Component {
  state = {
    places: [],
    query: ''
  }

  /**
   * Método de ciclo de vida para componente
   */

  componentDidMount() {
    Geocode.fromAddress("São Paulo, SP").then(
      geoResponse => {
        console.log('geoResponse', geoResponse)
        const { lat, lng } = geoResponse.results[0].geometry.location;
        this.props.foursquare.venues.getVenues({
          'll': `${lat},${lng}`,
          'categoryId': '4d4b7105d754a06374d81259'
        }).then(fsResponse => {
          const venues = fsResponse.response.venues;
          this.props.setMarkers(venues);
          this.setState({ places: venues });
        });
      }
    );
  }
  /**
   * Manipulador de pesquisas
   */
  handleQueryUpdate = (query) => {
    this.setState({ query }, () => {
      const filtered = this.getFilteredPlaces();
      this.props.setMarkers(filtered);
    });
  }

  /**
   * Manipula cliques no botão sanduiche para mostrar 
   * e esconder a barra lateral
   */
  handleSandwichClick = () => {
    const map = document.querySelector('.map-container');
    map.style.marginLeft = map.style.marginLeft === '250px' ? '0' : '250px';

    const sandwich = document.querySelector('.sandwich');
    sandwich.style.left = sandwich.style.left === '250px' ? '0' : '250px';
  }
  /**
   * Retorna lugares filtrados de acordo com a pesquisa
   */
  getFilteredPlaces() {
    const { query, places } = this.state;

    if (!query) {
      return places;
    }

    const match = new RegExp(escapeRegExp(query), 'i');
    return places.filter(p => match.test(p.name));
  }

  /**
   * Returns input field for filter
   */
  getInputField = () => {
    const { query } = this.state;

    return <input
      tabIndex={1}
      className='filter-places'
      type='text'
      value={query}
      onChange={event => this.handleQueryUpdate(event.target.value)}
      placeholder='Filtrar lugares' />
  }

  /**
   * Returna lista com os nomes dos lugares
   */
  getPlaceList = () => {
    let filteredPlaces = this.getFilteredPlaces();

    return (
      <ol className='places' role='listbox' aria-label='Lista de lugares'>
        {filteredPlaces.map((p, index) =>
          <li
            tabIndex={index + 2}
            role='option'
            key={index}
            className='place'
            onClick={() => {this.props.onPlaceClick(index)}}
            onKeyUp={event => {
              if (event.keyCode === 13) {
                this.props.onPlaceClick(index);
              }
            }}>
              {p.name}
          </li>
        )}
      </ol>
    )
  }

  render() {
    return (
      <div>
        <div className='sidebar'>
          <div className='heading' role='heading'>
            <h3 className='title'>
              Restaurantes
            </h3>
            {this.getInputField()}
          </div>
          <div className='place-list' role='region'>
            {this.getPlaceList()}
          </div>
        </div>
        <div
          tabIndex='-1'
          style={{left: '250px'}}
          className='sandwich'
          onClick={this.handleSandwichClick}>
          <img
            src='menu.png'
            alt='Toggle menu' />
        </div>
      </div>
    );
  }
}

export default List;