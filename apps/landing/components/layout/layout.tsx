import { Box } from '@mui/material';
import Footer from '../footer/footer';
import Navbar from '../navbar/navbar';

export default function LandingLayout({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100vh',
      }}
    >
      <Navbar />
      <Box sx={{ height: '100%' }}>{children}</Box>
      <Footer />
    </Box>
  );
}
