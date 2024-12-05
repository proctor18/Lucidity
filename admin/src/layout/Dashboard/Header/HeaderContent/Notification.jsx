import { useRef, useState  , useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

import { supabase } from 'lib/supabase.js' ; 

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification( ) {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [read, setRead] = useState(2);
  const [open, setOpen] = useState(false);
  const [ notifications , setNotifications ] = useState({}); 
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };



  useEffect(() => {
    const fetchNotifications = async () => {
      if (!supabase) {
        throw new Error('Supabase is undefined');
      }

      try {
        // Step 1: Fetch data from the 'auth_request' table
        const { data: authRequests, error: authError } = await supabase
          .from('auth_request')
          .select('*');

        if (authError) {
          console.error('Error fetching auth_request data:', authError);
          return;
        }

        if (authRequests && authRequests.length > 0) {
          console.log('Auth requests fetched:', authRequests);

          // Step 2: Extract tutor_ids from authRequests
          const tutorIds = authRequests.map((request) => request.tutor_id);

          // Step 3: Query the 'tutors' table using the extracted tutor_ids
          const { data: tutors, error: tutorError } = await supabase
            .from('tutors')
            .select('*')
            .in('tutor_id', tutorIds); // Use the 'in' operator to fetch multiple tutors

          if (tutorError) {
            console.error('Error fetching tutors data:', tutorError);
            return;
          }

          console.log('Tutors fetched:', tutors);

          // Step 4: Combine data (if needed) and update notifications
          const combinedData = authRequests.map((request) => ({
            ...request,
            tutor: tutors.find((tutor) => tutor.tutor_id === request.tutor_id),
          }));

          setNotifications(combinedData);
          console.log('Successfully updated notifications:', combinedData);
        } else {
          console.log('No auth requests found.');
        }
      } catch (error) {
        console.error('Error occurred while fetching data:', error);
      }
    };

    fetchNotifications();
  }, []); // Add 'supabase' to the dependency array if it's passed from props or context
  
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

useEffect(() => {
  const fetchNotifications = async () => {
    if (!supabase) {
      throw new Error('Supabase is undefined');
    }

    try {
      // Step 1: Fetch data from the 'auth_request' table
      const { data: authRequests, error: authError } = await supabase
        .from('auth_request')
        .select('*');

      if (authError) {
        console.error('Error fetching auth_request data:', authError);
        return;
      }

      if (authRequests && authRequests.length > 0) {
        console.log('Auth requests fetched:', authRequests);

        // Step 2: Extract tutor_ids from authRequests
        const tutorIds = authRequests.map((request) => request.tutor_id);

        // Step 3: Query the 'tutors' table using the extracted tutor_ids
        const { data: tutors, error: tutorError } = await supabase
          .from('tutors')
          .select('*')
          .in('tutor_id', tutorIds); // Use the 'in' operator to fetch multiple tutors

        if (tutorError) {
          console.error('Error fetching tutors data:', tutorError);
          return;
        }

        console.log('Tutors fetched:', tutors);

        // Step 4: Combine data (if needed) and update notifications
        const combinedData = authRequests.map((request) => ({
          ...request,
          tutor: tutors.find((tutor) => tutor.tutor_id === request.tutor_id),
        }));

        setNotifications(combinedData);
        console.log('Successfully updated notifications:', combinedData);
      } else {
        console.log('No auth requests found.');
      }
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
    }
  };

  fetchNotifications();
}, [supabase]); // Add 'supabase' to the dependency array if it's passed from props or context

  const iconBackColorOpen = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={read} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {read > 0 && (
                        <Tooltip title="Mark as all read">
                          <IconButton color="success" size="small" onClick={() => setRead(0)}>
                            <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {Object.entries(notifications).map(([key, value]) => (
                      <ListItemButton key={key} selected={value.read > 0}>
                        <ListItemAvatar>
                          <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                            <GiftOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="h6">
                              <Typography component="span" variant="subtitle1">
                                {`${value.tutor.first_name} ${value.tutor.last_name} `}
                              </Typography>{' '}
                              requested authorization
                            </Typography>
                          }
                          secondary={value.thisval || '2 min ago'}
                        />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" noWrap>
                            {value.created_at.slice(0,10)|| '3:00 AM'}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    ))}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
