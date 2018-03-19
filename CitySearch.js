import React, { Component } from 'react';
import render from 'react-dom'
import GoogleMap from './GoogleMap'
import {Link} from 'react-router-dom'

 const CitySearch = (props) => {

     return(
      <div>

      <input id='center-point' className='controls' type = 'text' placeholder ='search for location' />
      <button onClick = {(event) => {
        const {google} = props.props
        var input = document.getElementById('center-point');
        var geocoder =  new google.maps.Geocoder();
        geocoder.geocode( { 'address': input.value},  function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                console.log(results, '!!!!!!!!!!!!!')
                  var newCenter = {lat:results[0].geometry.location.lat(),lng:results[0].geometry.location.lng()}
                //console.log(newCenter)
                return newCenter
              } else {
                alert("Something got wrong " + status);
              }
            })}} />

    </div>
     )


}


export default CitySearch
