import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={() => removeLeastValuable(badApples)}>
      Remove
    </Button>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
