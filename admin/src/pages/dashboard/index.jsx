// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useLocation } from 'react-router-dom';

//react  import

import { useState , useEffect } from "react";

//database import 

import { supabase } from "lib/supabase.js";

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import UniqueVisitorCard from './UniqueVisitorCard';
import SaleReportCard from './SaleReportCard';
import OrdersTable from './OrdersTable';

// assets
import GiftOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {

  const location = useLocation() ; 
  const { state } = location ;  
  const [ userCount , setUserCount ] = useState(0) ;
  const [ sessionCount, setSessionCount ] = useState(0) ;
  const [ badApples , setBadApples ] = useState(0) ;
  const [ studentData , setStudentData ] = useState(null) ; 
  const [ tutorData, setTutorData ] = useState(null) ; 
  const [ sessionData , setSessionData ] = useState(null) ; 

  useEffect(() => {
    fetchData() ; 
  } , [userCount]) ; 





  console.log('current state : ' , state) ; 
  function calculateBadPerformers(tutorData){
    let badApples = tutorData.sort(( a , b ) => a.rank - b.rank);
    setBadApples(Object.entries(badApples).slice(0,4).map(entry => entry[1])) ; 
  }

  async function removeLeastValuable(badApples) {
    try {
      // Check if badApples is not empty
      if (badApples && badApples.length > 0) {
        // Get the tutor_id of the first (lowest-ranked) tutor
        const tutorToRemove = badApples[0].tutor_id;

        // Delete the tutor from the 'tutors' table
        const { data, error } = await supabase
          .from('tutors')
          .delete()
          .eq('tutor_id', tutorToRemove);

        // Check for errors during deletion
        if (error) {
          console.error('Error occurred while deleting tutor:', error);
          return false;
        }

        console.log(`Removed tutor with ID: ${tutorToRemove}`);
        return true;
      } else {
        console.log('No tutors to remove');
        return false;
      }
    } catch (error) {
      console.error('Unexpected error in removeLeastValuable:', error);
      return false;
    }
  }

  async function fetchData(){
      try {
        // Fetch teacher data
        const { data : tutorData , error : tutorError } = await supabase
          .from('tutors')
          .select('*') ; 

        // Fetch student data
        const { data : studentData, error : studentError} = await supabase
          .from('students')
          .select('*')

        // Fetch session data
        const { data : sessionData  , error : sessionError} = await supabase
          .from('sessions')
          .select('*')
        if (tutorData && studentData && sessionData ) {
          let value = Object.keys(studentData).length + Object.keys(tutorData).length; 
          setUserCount(value) ; 
          setStudentData(studentData) ; 
          setTutorData(tutorData) ; 
          setSessionData(sessionData) ; 
          setSessionCount(Object.keys(sessionData).length) ; 
          calculateBadPerformers(tutorData) ; 
        }else{
          console.log('Data unpopulated')
        }
      } catch (error) { // Might not work 
        console.log('Error occured while fetching data' , error)
      }
    } 
	
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Current Users" count={userCount} percentage={59.3} extra={userCount} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Sessions Completed" count={sessionCount} percentage={70.5} extra={sessionCount} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Average Stars" count="4.3" percentage={1.4} isLoss color="error" extra="5 Stars" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Satisfaction Rate" count="86%" percentage={860} color="success" extra="860%" />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <UniqueVisitorCard />
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Bad apples</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>

{/* ----------------------------------------------------------------------------------------------------------------------------- */}

          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
          {Object.entries(badApples).map(([key, value]) => (
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">{`${value.first_name} ${value.last_name}`}</Typography>} secondary="Bad Performer" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                      {`${value.rank} stars`}
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    {`${value.rank / 5 * 100}%`}
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}

          </List>

{/* ----------------------------------------------------------------------------------------------------------------------------- */}

        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Revoke tutoring rights 
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Remove the low performing tutors
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={() => removeLeastValuable(badApples)}>
              Remove
            </Button>
          </Stack>
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Verification Requests</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Database Reads" />
              <Typography variant="h5">43</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Microservices Expenses" />
              <Typography variant="h5">TBD</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="User Traffic" />
              <Typography variant="h5">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid>
    </Grid>
  );
}
