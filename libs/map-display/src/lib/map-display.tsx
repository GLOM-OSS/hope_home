import { Box } from '@mui/material';
import GoogleMapReact from 'google-map-react';
import Image from 'next/image';

export function MapDisplay({
  location: { lat, lng },
  location,
  zoomLevel,
}: {
  location: GoogleMapReact.Coords;
  zoomLevel: number;
}) {
  return (
    <Box style={{ height: '50vh', width: '60vw' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDYFQ9bbgFmqBdn_llTxm4gfooXajGYOuE' }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >
        <LocationPin text={`${lat}, ${lng}`} />
      </GoogleMapReact>
    </Box>
  );
}

const LocationPin = ({ text }: { text: string }) => (
  <div
    style={{
      display: 'flex',
      textAlign: 'center',
      alignItems: 'center',
      transform: 'translate(-50%, -50%)',
    }}
  >
    <Image alt="hope home" width={40} height={60} src={'/favicon_green.png'} />
    {text}
  </div>
);
