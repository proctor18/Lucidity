import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import ProfileTab from './ProfileTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

// assets
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

export default function ProfileRequest({ fname, id }) {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <MainCard
        elevation={0} // No additional elevation
        border={false}
        content={false}
        sx={{
          width: '100%', // Ensure it fills the container
          height: '100%', // Make it responsive to the parent container
          boxShadow: theme.customShadows.z1,
          padding : 0 , 
        }}
      >
        <CardContent sx={{ px: 2.5, pt: 3 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                <Stack>
                  <Typography variant="h6">{fname}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tutor
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item>
              <Tooltip title="Approve">
                <IconButton size="large" sx={{ color: 'text.primary' }}>
                  <CheckOutlined />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>

        <CardContent sx={{ pt: 1, px: 2.5 }}>
          {/* Render ProfileTab or any other content */}
          <ProfileTab id={id} />
        </CardContent>
      </MainCard>
    </Box>
  );
}

ProfileRequest.propTypes = {
  fname: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
