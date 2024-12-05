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
import Button from '@mui/material/Button';
import { supabase } from "lib/supabase.js";

// project import
import ProfileTab from './ProfileTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

// assets
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

export default function ProfileRequest({ fname, id }) {

  async function handleRemoval(id) {
    console.log('Attempting to fetch user credentials utilizing UUID:', id);
    
    try {
      if (supabase) {
        console.log('Supabase is defined'); 
        
        const { data, error } = await supabase
          .from('auth_request')
          .update({ status: 2 }) // Write the unsuccessful state.
          .eq('tutor_id', id);

        if (error) {
          console.error('Error updating record:', error.message);
          return;
        }
        
        console.log('Record updated successfully:', data);
      } else {
        console.log('Supabase is undefined');
      }
    } catch (error) {
      console.error('Error occurred while fetching data:', error.message);
    }
  }

  async function handleApproval(id) {
    console.log('Attempting to fetch user credentials utilizing UUID : ' , id ) ; 
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('auth_request')
          .select('tutor_id')
          .eq('tutor_id', id)
          .single(); 

        const { data : dataUpdate , error : errorUpdate } = await supabase
          .from('auth_request')
          .update({ status: 1 }) // Write the unsuccessful state.
          .eq('tutor_id', id);

        if (error) {
          console.error('Error fetching tutor_id:', error);
          return;
        }

        if (data && data.tutor_id) {
          const { error: updateError } = await supabase
            .from('tutors')
            .update({ is_qualified: true })
            .eq('tutor_id', data.tutor_id); // Update the tutor's is_qualified status

          if (updateError) {
            console.error('Error updating tutor:', updateError);
          } else {
            console.log('Tutor qualification status updated successfully.');
          }
        } else {
          console.log('No tutor found for the provided request_id.');
        }
      } else {
        console.log('Supabase is undefined');
      }
    } catch (error) {
      console.log('Error occurred while processing:', error);
    }
  }

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
          <Grid item xs={12}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar alt="profile user" src={avatar1} sx={{ width: 48, height: 48 }} />
              <Stack>
                <Typography variant="h6">{fname}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tutor
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ height: '320px' }} /> 
            <Button size="medium" variant="contained" sx={{ width: '100%', textTransform: 'capitalize' }} onClick={() => handleApproval(id)}>
                Approve
            </Button>
            <Button size="medium" color="error" sx={{ width: '100%', textTransform: 'capitalize'  }}  onClick={() => handleRemoval(id)}>
               Reject 
            </Button>
          </Grid>
        </Grid>
        </CardContent>
      </MainCard>
    </Box>
  );
}

ProfileRequest.propTypes = {
  fname: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
