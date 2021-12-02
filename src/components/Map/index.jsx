import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl'
import {MdLocationPin} from 'react-icons/md'
import {MdIcecream} from 'react-icons/md'
import {MdLocalParking} from 'react-icons/md'
import {MdLocalCafe} from 'react-icons/md'
import 'mapbox-gl/dist/mapbox-gl.css'

import './style.css'




// const token = process.env.REACT_APP_MAP_TOKEN
// mapboxgl.accessToken = token

const geoJsonUrl = 'https://lukrgatt.reykjavik.is/server/rest/services/OpinGognThjonusta/Endurvinnslugamar/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson';

const places = [
	{
		id: 1,
		iconUrl: MdIcecream,
		latitude: 50.08415631476569,
		longitude: 14.423472469019359,
	},
	{
		id: 2,
		iconUrl: MdIcecream,
		latitude: 50.08140252219053,
		longitude: 14.425123690476866,
	},
	{
		id: 3,
		iconUrl: MdLocalParking,
		latitude: 50.08315119880879,
		longitude: 14.42713937555392,
	},
	{
		id: 4,
		iconUrl: MdLocalParking,
		latitude: 50.08147136893371,
		longitude: 14.427310912961879,
	},
]



export const Map = () => {

  const [popupOpen, setPopupOpen] = useState(false)
  const [toggleIcon, setToggleIcon] = useState(false)
  const [open, setOpen] = useState(true)
  const [bins, setBins] = useState([]);

  // const filterBins =(e) => {
  //   console.log(e.target.value)
  // }

  const [dragIcon, setDragIcon] = useState({
    latitude: 50.08147136893371,
    longitude: 14.427310912961879,
  })

  const [viewport, setViewport] = useState({
    latitude: 64.13187000601103,
    longitude: -21.945205972837428,
    zoom: 10,
  })

  // useEffect (
  //   () => {
  //     fetch("https://lukrgatt.reykjavik.is/server/rest/services/OpinGognThjonusta/Endurvinnslugamar/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json")
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data)
  //     })
  //   },
  //   []
  // );


  const fetchBins = () => {
    fetch(geoJsonUrl)
      .then(response => response.json())
      .then(data => {
      console.log(data);
      //  setBins(data)
       setBins({features: data['features'], isLoading: false})
      })
  }


  
  useEffect(() => {
    fetchBins();
  }, []);

  



	return(
    <>
    <ReactMapGL
		{...viewport}
		width="100vw"
		height={400}
		onViewportChange={(nextViewport) => setViewport(nextViewport)}
    onClick={(event) =>
      setDragIcon({
        latitude: event.lngLat[1],
        longitude: event.lngLat[0],
      })
    }



    mapStyle={{
      version: 8,
      sources: {
         'raster-tiles': {
            type: 'raster',
            // tiles: ['https://mapserver.mapy.cz/base-m/{z}-{x}-{y}'],
            tiles: ['https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
         },
      },
      layers: [
         {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
            // maxzoom: 18
         },
      ],
   }}
	>




  <div className="navigation">
    <NavigationControl />
    <GeolocateControl />
  </div>
    
    <Marker 
    latitude={50.0833715} 
    longitude={14.4252452} 
    offsetLeft={-25} 
    offsetTop={-50}>
      <button
      className="marker-button" 
      onClick={() => setPopupOpen(true)}>
        <MdLocationPin size={40} />
      </button>
      
    </Marker>

    {bins.features?.map(bin => ( 
    <Marker
    key={bin.id}
    latitude={bin.geometry.coordinates[1]}
    longitude={bin.geometry.coordinates[0]}
    offsetLeft={-15}
    offsetTop={-15}
    className={open ? "hide" : null}
      >
      <a href="https://stamen-tiles.a.ssl.fastly.net/toner" target="blank">
        <MdLocationPin color="red" size={40}/>
      </a>
    </Marker>
    
      ))}


    <Marker 
      {...dragIcon} 
      offsetLeft={-25} 
      offsetTop={-50} 
      draggable 
      onDragEnd={(event) =>
      setDragIcon({
        latitude: event.lngLat[1],
        longitude: event.lngLat[0],
      })
    }>
    <MdLocalCafe 
    size={40} 
    style={{ pointerEvents: 'none' }} />
    </Marker>

    
    

    {popupOpen && <Popup
      latitude={50.0833715}
      longitude={14.4252452}
      offsetTop={-50}
      onClose={() => setPopupOpen(false)}
    >
      Czechitas
    </Popup>}



      {places
      .filter((place) => toggleIcon === false || place.iconUrl !== MdLocalParking)
      .map((place) => (
      <Marker
        key={place.id}
        latitude={place.latitude}
        longitude={place.longitude}
        offsetLeft={-15}
        offsetTop={-15}
      >
        <place.iconUrl size={40} />
      </Marker>

  ))}
  </ReactMapGL>
  <button 
    onClick={() => setToggleIcon(!toggleIcon)}
    >
    {toggleIcon ? 'show' : 'hide'} parking
  </button>
    {/* <button value="PAPPIR" onClick={filterBins}> filter pappir </button> */}

    <button
        onClick={() => {
          setOpen(!open);
        }}
      >
        {open ? 'show' : 'hide'} bins
    </button>

  </>

  ) 
}