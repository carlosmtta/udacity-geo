import React, { Component } from 'react';
import Draggable from 'react-draggable';

/**
 * Modal com detalhes do lugar
 */
class InfoWindow extends Component {
  render() {
    const { place } = this.props;

    return (
    <Draggable>
      <article className='info-window' role='article' tabIndex='1'>
        <h2 className='info-name'>{place.name}</h2>
        <p
          onClick={() => {this.props.hideInfoWindow()}}
          className='close-window'>X</p>
        <p className='info-category'>{place.categories[0].name}</p>
        <p className='info-address'>{place.location.address}, {place.location.city}</p>
      </article>
    </Draggable>
    )
  }
}

export default InfoWindow;