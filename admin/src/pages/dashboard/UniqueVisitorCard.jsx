// import { useState , useEffect } from 'react';
//
// // material-ui
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
//
// // project import
// import MainCard from 'components/MainCard';
// import IncomeAreaChart from './IncomeAreaChart';
// import { supabase } from "lib/supabase.js";
//
// // ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //
//
// export default function UniqueVisitorCard() {
//   const [slot, setSlot] = useState('week');
//   return (
//     <>
//       <Grid container alignItems="center" justifyContent="space-between">
//         <Grid item>
//           <Typography variant="h5">User Signups</Typography>
//         </Grid>
//         <Grid item>
//           <Stack direction="row" alignItems="center" spacing={0}>
//             <Button
//               size="small"
//               onClick={() => setSlot('month')}
//               color={slot === 'month' ? 'primary' : 'secondary'}
//               variant={slot === 'month' ? 'outlined' : 'text'}
//             >
//               Month
//             </Button>
//             <Button
//               size="small"
//               onClick={() => setSlot('week')}
//               color={slot === 'week' ? 'primary' : 'secondary'}
//               variant={slot === 'week' ? 'outlined' : 'text'}
//             >
//               Week
//             </Button>
//           </Stack>
//         </Grid>
//       </Grid>
//       <MainCard content={false} sx={{ mt: 1.5 }}>
//         <Box sx={{ pt: 1, pr: 2 }}>
//           <IncomeAreaChart slot={slot} />
//         </Box>
//       </MainCard>
//     </>
//   );
// }
import { useState, useEffect, useMemo } from 'react';
import { supabase } from 'lib/supabase';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //
export default function UniqueVisitorCard() {
  const [slot, setSlot] = useState('week');
  const { userSignups, loading } = useUserSignups();

  // Filter and format the user signup data based on the selected slot (week or month)
  const filteredSignups = useMemo(() => {
    if (loading) return [];

    const today = new Date();
    const startDate = slot === 'week' ? new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) : new Date(today.getFullYear(), today.getMonth(), 1);

    return userSignups.filter(date => new Date(date) >= startDate);
  }, [userSignups, slot, loading]);

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">User Signups</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={0}>
            <Button
              size="small"
              onClick={() => setSlot('month')}
              color={slot === 'month' ? 'primary' : 'secondary'}
              variant={slot === 'month' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setSlot('week')}
              color={slot === 'week' ? 'primary' : 'secondary'}
              variant={slot === 'week' ? 'outlined' : 'text'}
            >
              Week
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart slot={slot} data={filteredSignups} />
        </Box>
      </MainCard>
    </>
  );
}

const useUserSignups = () => {
  const [userSignups, setUserSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSignups = async () => {
      try {
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('date_created');

        const { data: tutors, error: tutorsError } = await supabase
          .from('tutors')
          .select('date_created');

        if (studentsError || tutorsError) {
          console.error('Error fetching user signups:', studentsError || tutorsError);
          setLoading(false);
          return;
        }

        const allSignups = [...students.map(s => s.date_created), ...tutors.map(t => t.date_created)];
        setUserSignups(allSignups);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user signups:', error);
        setLoading(false);
      }
    };

    fetchUserSignups();
  }, []);

  return { userSignups, loading };
};
