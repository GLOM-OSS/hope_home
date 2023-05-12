import { Box, Typography } from '@mui/material';
import GoogleMapReact from 'google-map-react';
import Image from 'next/image';

function LocationPin({ text }: { text: string }) {
  return (
    <Box
      sx={{
        display: 'grid',
        justifyContent: 'start',
        justifyItems: 'center',
        alignSelf: 'start',
        textAlign: 'center',
      }}
    >
      <Image
        alt="hope home"
        width={50}
        height={60}
        src={'/favicon_green.png'}
      />
      <Typography>{text}</Typography>
    </Box>
  );
}

export function MapDisplay({
  location: { lat, lng },
  location,
  zoomLevel,
}: {
  location: GoogleMapReact.Coords;
  zoomLevel: number;
}) {
  return (
    <Box style={{ height: '50vh', width: '100%' }}>
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
