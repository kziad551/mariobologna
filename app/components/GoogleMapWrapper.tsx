import React, {ReactNode} from 'react';
import {LoadScript} from '@react-google-maps/api';

export interface GoogleMapWrapperProps {
  googleKey: string;
  children: ReactNode;
}

const GoogleMapWrapper = ({googleKey, children}: GoogleMapWrapperProps) => {
  return (
    <LoadScript loadingElement={<></>} googleMapsApiKey={googleKey}>
      {children}
    </LoadScript>
  );
};

export default GoogleMapWrapper;
