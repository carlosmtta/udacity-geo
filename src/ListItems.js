
import React, { Component } from 'react';

class ListItems extends Component {

    state = {
        places: this.props.places,
        query: ''
    }
    
    handleMarkerClick = (marker) => {
        // 1. Update places and mark the clicked one
        const places = this.state.places.map((p, index) => {
          if (index === marker) {
            p.clicked = true;
          } else {
            p.clicked = false;
          }
          return p;
        });
    }
    

    render() {
    return (
      
    <ol className='places' role='listbox' aria-label='List of places'>
        {this.props.places.map((p, index) =>
          <li
            tabIndex={index + 2}
            role='option'
            key={index}
            className='place'
            onClick={this.handleMarkerClick(index)}
            onKeyUp={event => {
              if (event.keyCode === 13) {
                this.props.onPlaceClick(index);
              }
            }}>
              {p.venue.name}
          </li>
        )}
      </ol>
    )}
}

export default ListItems