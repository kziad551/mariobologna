import React, {useState} from 'react';
import {GoogleMap, InfoWindowF, MarkerF} from '@react-google-maps/api';
import {TFunction} from 'i18next';
import {Link} from '@remix-run/react';

export interface Position {
  position: {
    lat: number;
    lng: number;
  };
  name?: string; // Optional name for the marker
  locations?: string[];
}

export type GoogleMapType = {
  t: TFunction<'translation', undefined>;
  containerStyle: object;
  center: {lat: number; lng: number};
  zoom: number;
  positions: Position[];
};

const GoogleMapComponent = ({
  t,
  containerStyle,
  center,
  zoom,
  positions,
}: GoogleMapType) => {
  const [selectedMarker, setSelectedMarker] = useState<Position | null>(null);
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
      {positions.map((location, index) => (
        <MarkerF
          key={index}
          position={location.position}
          title={location.name ?? ''}
          onClick={() => setSelectedMarker(location)}
        />
      ))}
      {selectedMarker && (
        <InfoWindowF
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="flex flex-col items-start justify-start gap-4">
            {selectedMarker.locations ? (
              <div className="flex flex-col max-h-20 px-2 overflow-y-auto scrollbar-track-neutral-N-98 scrollbar-thumb-neutral-N-96 scrollbar-thin">
                {selectedMarker.locations.map((loc) => (
                  <h4 className="text-sm">{loc}</h4>
                ))}
              </div>
            ) : (
              <h4 className="text-sm">{selectedMarker.name}</h4>
            )}
            <Link
              to={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.position.lat},${selectedMarker.position.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-P-90 self-center text-sm font-medium rounded active:text-primary-P-40 hover:underline transition-colors"
            >
              Get Directions
            </Link>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
