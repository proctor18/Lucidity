import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Modal,
  Card,
  CardContent,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { supabase } from 'lib/supabase.js';
import Dot from 'components/@extended/Dot';
import ProfileRequest from '../../layout/Dashboard/Header/HeaderContent/Profile/ProfileRequest.jsx' ; 

function createData(id, name, totalSessions, status, requestDate) {
  return { id, name, totalSessions, status, requestDate };
}

const headCells = [
  { id: 'id', align: 'left', disablePadding: false, label: 'User ID' },
  { id: 'name', align: 'left', disablePadding: true, label: 'Tutor Name' },
  { id: 'totalSessions', align: 'right', disablePadding: false, label: 'Total Sessions' },
  { id: 'status', align: 'left', disablePadding: false, label: 'Status' },
  { id: 'requestDate', align: 'right', disablePadding: false, label: 'Request Date' },
];

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  const statusMap = {
    0: { color: 'warning', title: 'Pending' },
    1: { color: 'success', title: 'Approved' },
    2: { color: 'error', title: 'Rejected' },
  };

  const { color, title } = statusMap[status] || { color: 'primary', title: 'None' };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function OrderTable() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  function handleRequest(request) {
    setSelectedRequest(request);
    setModalVisible(true);
  }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('auth_request')
          .select('*, tutors:tutor_id(*)')
          .order('created_at', { ascending: false });

        if (!error) {
          const formattedData = data.map((request) =>
            createData(
              request.tutor_id,
              `${request.tutors.first_name} ${request.tutors.last_name}`,
              0,
              request.status,
              request.created_at
            )
          );
          setRequests(formattedData);
        } else {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <Box>
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order="asc" orderBy="id" />
          <TableBody>
            {requests.map((row) => (
              <TableRow
                hover
                key={row.id}
                onClick={() => handleRequest(row)}
              >
                <TableCell>
                  <Link color="secondary">{row.id}</Link>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.totalSessions}</TableCell>
                <TableCell>
                  <OrderStatus status={row.status} />
                </TableCell>
                <TableCell align="right">
                  <NumericFormat value={row.requestDate} displayType="text" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        aria-labelledby="modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: '70%', 
            minWidth: '320px', 
            width: 'auto', 
            height: 'auto', 
            borderRadius : "2%" , 
          }}
        >
          {selectedRequest && (
            <Card elevation={0} sx={{ width: '100%' }}>
              <ProfileRequest fname={selectedRequest.name} id={selectedRequest.id} />
            </Card>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
};

OrderStatus.propTypes = {
  status: PropTypes.number,
};
