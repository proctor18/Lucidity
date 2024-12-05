import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const OverlappingCard = () => {
  return (
    <Box sx={{ position: 'relative', height: '300px', border: '1px solid gray' }}>
      <Typography variant="h5">Main Content</Typography>

      {/* Card positioned on top */}
      <Box
        sx={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 10,
          backgroundColor: 'white',
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6">Overlapping Card</Typography>
            <Typography>This card is above other content.</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default OverlappingCard;
