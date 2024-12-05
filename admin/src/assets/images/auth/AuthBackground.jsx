import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Spline from '@splinetool/react-spline';

export default function AuthBackground() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(18px)',
        zIndex: -1,
        bottom: 0,
        transform: 'inherit'
      }}
    >
      <Spline
        scene="https://prod.spline.design/lMTwgRQlrIxw46sB/scene.splinecode"
        onLoad={(spline) => {
          // Disable interactions (e.g., zoom, rotation, dragging)
          spline.setZoom(false); // Zoom control off
          spline.setRotation(false); // Rotation control off
          spline.setDrag(false); // Drag control off
        }}
      />
    </Box>
  );
}/
