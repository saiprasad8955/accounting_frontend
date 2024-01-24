// @mui
import { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputAdornment, InputLabel, Menu, MenuItem, Modal, Select, Switch, TextField } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import { decryptToken, formatDate, generateOfferCode, states } from 'src/utils/common';
import axios, { endpoints } from 'src/utils/axios';
import { constants } from 'src/utils/constant';
import { useSnackbar } from 'src/components/snackbar';
import DataTable from 'react-data-table-component';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';  // Import the UTC plugin


dayjs.extend(utc);  // Enable the UTC plugin

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 2,
  backgroundColor: 'lightblue',
  height: 'auto',
  overflow: 'auto',
};


// ----------------------------------------------------------------------
const initialData = {
  price: '',
  date: null,
  category: '',
  paymentStatus: '',
  paymentMode: ''
};


const initialErr = {
  price: false,
  date: false,
  category: false,
  paymentStatus: false,
  paymentMode: false
};

const categories = [
  'ELECTRICITY BILL',
  'REPAIR AND MAINTAINANCE',
  'INTERNET BILLS',
  'RAW MATERIAL',
  'RENT',
  'PRINTING',
  'EMPLOYEE SALARIES',
];
const paymentModes = [
  'CASH',
  'CARD',
  'UPI',
  'NET BANKING',
  'CHEQUE',
  'EMI',
];

export default function ExpenditureView() {



  const [dateValue, setDateValue] = useState(dayjs('2022-04-17'));
  const utcDateFromBackend = '2024-01-14T18:30:00.000+00:00';  // Replace this with the UTC date from your backend
  const utcDateObject = dayjs.utc(utcDateFromBackend);
  const localDateObject = utcDateObject.local();
  // console.log("🚀 ~ ExpenditureView ~ localDateObject:", localDateObject)

  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  // For Modal Open
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [data, setData] = useState(initialData);
  const [dataErr, setDataErr] = useState(initialErr);
  const [editUser, setEditUser] = useState(false);

  // Temporary State
  const [tempData, setTempData] = useState({});

  const [searchQuery, setSearchQuery] = useState('');


  // For Actions Dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);


  // For Delete Customer
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => {
    const offerCode = generateOfferCode();
    setData((prev) => ({ ...prev, code: offerCode }));
    setOpen(true);
    setEditUser(false);
  };

  const handleClose = () => setOpen(false);


  const fetchData = async () => {

    try {
      const decryptedToken = localStorage.getItem(constants.keyUserToken);
      const accessToken = decryptToken(decryptedToken);
      const response = await axios.post(endpoints.expenditure.list, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (response) {
        setIsLoading(false);
        setDataArray(response.data.data);
      }
    } catch (err) {
      enqueueSnackbar('Failed to fetch dataArray!', { variant: 'error' });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // You can use setFormData to update the state when user input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Clear the error for the field when the user starts typing again
    setDataErr((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };


  const handleSave = async () => {
    const payload = {};
    if (!data.price) {
      setDataErr((prevErrs) => ({ ...prevErrs, price: true }))
      return;
    }
    setDataErr((prevErrs) => ({ ...prevErrs, price: false }))

    if (!data.date) {
      setDataErr((prevErrs) => ({ ...prevErrs, date: true }))
      return;
    }
    setDataErr((prevErrs) => ({ ...prevErrs, date: false }))

    if (!data.category) {
      setDataErr((prevErrs) => ({ ...prevErrs, category: true }))
      return;
    }
    setDataErr((prevErrs) => ({ ...prevErrs, category: false }))

    if (!data.paymentMode) {
      setDataErr((prevErrs) => ({ ...prevErrs, paymentMode: true }))
      return;
    }
    setDataErr((prevErrs) => ({ ...prevErrs, paymentMode: false }));


    const utcValue = data.date.utc().format();


    payload.price = data.price;
    payload.date = utcValue;
    payload.category = data.category;
    payload.paymentStatus = data.paymentStatus;
    payload.paymentMode = data.paymentMode;
    console.log("🚀 ~ handleSave ~ payload:", payload)

    // If no errors, proceed with saving
    const decryptedToken = localStorage.getItem(constants.keyUserToken);
    const accessToken = decryptToken(decryptedToken);
    axios.post(endpoints.expenditure.add, payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })
      .then((res) => {
        enqueueSnackbar('Expense created successfully!', { variant: 'success' });
        // fetchData();
        handleClose();
        // Reset the error state
        setDataErr(initialErr);

        // Reset the data  state
        setData(initialData);

        fetchData();
      }).catch((err) => {
        enqueueSnackbar(err.error || err.msg, { variant: 'error' });
      })
  };

  const handleEditDetails = () => {
    setEditUser(true);
    setAnchorEl(null);
    const editedOfferData = {
      id: tempData._id,
      code: tempData.code,
      status: tempData.status,
      type: tempData.type,
      description: tempData.description
    };

    setData(editedOfferData);
    setOpen(true);

  };

  const handleDeleteDetails = () => {
    setData((prev) => ({ ...prev, id: tempData._id }));
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {

    const decryptedToken = localStorage.getItem(constants.keyUserToken);
    const accessToken = decryptToken(decryptedToken);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    axios.post(endpoints.expenditure.delete, { id: data.id }, config)
      .then((res) => {
        if (res) {
          enqueueSnackbar('Offer deleted successfully!', { variant: 'success' });
          setOpenDialog(false);
          setData(initialData);
          setDataErr(initialErr);
          fetchData();
        };
      }).catch((err) => {
        enqueueSnackbar(err.msg || err.error, { variant: 'error' });
      })
  };

  const handleUpdate = async () => {
    if (!data.type) {
      setDataErr((prevErrs) => ({ ...prevErrs, type: true }))
      return;
    }
    setDataErr((prevErrs) => ({ ...prevErrs, type: false }))

    if (!data.status) {
      setDataErr((prevErrs) => ({ ...prevErrs, status: true }))
      return;
    }
    setDataErr((prevErrs) => ({ ...prevErrs, status: false }))

    // If no errors, proceed with saving
    const decryptedToken = localStorage.getItem(constants.keyUserToken);
    const accessToken = decryptToken(decryptedToken);
    axios.post(endpoints.expenditure.update, data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })
      .then((res) => {
        enqueueSnackbar('Offer updated successfully!', { variant: 'success' });
        handleClose();
        // Reset the error state
        setDataErr(initialErr);

        // Reset the data  state
        setData(initialData);

        fetchData();
      }).catch((err) => {
        enqueueSnackbar(err.error || err.msg, { variant: 'error' });
      })



  };

  const offerCoumns = [
    {
      name: 'Category',
      selector: row => row.category,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: row => row.price,
      sortable: true,
    },
    {
      name: 'Payment Mode',
      selector: row => row.paymentMode,
      sortable: true,
    },
    {
      name: 'Payment Status',
      selector: row => row.paymentStatus,
      sortable: true,
      center: 'true'
    },
    {
      name: 'Expense Date',
      selector: row => formatDate(row.date),
      sortable: true,
      width: '20%',
    },
    {
      name: 'Actions',
      width: '20%',
      cell: (row) => (
        <>
          <Button onClick={(event) => {
            setAnchorEl(event.currentTarget);
            setTempData(row)
          }} color='info' variant='outlined' endIcon={<ArrowDropDownIcon />}>Action</Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={() => {
              setAnchorEl(null);
              setTempData({});
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => handleEditDetails()}>Edit Details</MenuItem>
            <MenuItem onClick={() => handleDeleteDetails()}>Remove</MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  const filteredCustomers = dataArray.filter((offData) =>
    offData?.category?.toLowerCase().includes(searchQuery?.toLowerCase())
  );


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Helmet>
        <title> Dashboard : Offers</title>
      </Helmet>

      <Typography variant="h4"> Expenditure </Typography>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <div style={{ display: "flex", flexDirection: 'row', alignItems: "center", gap: "10px" }}>
          <TextField
            placeholder='Search'
            size='small'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <SingleInputDateRangeField
              size='small'
              label="Date Range"
            // value={value}
            // onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider>
        </div>
        <Button startIcon={<AddIcon />} variant='outlined' color='primary' onClick={handleOpen}>
          ADD EXPENSE
        </Button>
      </div>

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            <Typography id="modal-modal-title" variant="h4" component="h2">
              Basic Details
            </Typography>
            <div style={{ padding: "10px", backgroundColor: 'white', borderRadius: '10px' }}>
              <Grid container spacing={2} >
                <Grid item xs={6}>
                  <TextField
                    label='Expense in rupees'
                    name='price'
                    type='number'
                    value={data.price}
                    onChange={handleChange}
                    error={dataErr.price}
                    helperText={dataErr.price ? 'Please enter expense in rupees' : null}
                    fullWidth
                    required />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Expense Date"

                      value={data.date}
                      // error={dataErr.date}
                      // helperText='Please enter expense date'
                      onChange={(newValue) => {
                        setData((prev) => ({ ...prev, date: newValue }))
                        setDataErr((prev) => ({ ...prev, date: false }))
                      }}
                      slotProps={{ textField: { fullWidth: true, error: dataErr.date, helperText: dataErr.date ? 'Please select expense date!.' : null } }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.category}
                      label="Category"
                      name='category'
                      onChange={(e) => {
                        setData((prev) => ({ ...prev, category: e.target.value }))
                        setDataErr((prev) => ({ ...prev, category: false }))
                      }}
                      error={dataErr.category}
                      required
                    >
                      {
                        categories.map((category, i) => (
                          <MenuItem key={i} value={category}>{category}</MenuItem>
                        ))
                      }
                    </Select>
                    {
                      dataErr.category &&
                      <FormHelperText sx={{ color: 'red' }}>Please Select Expense Category</FormHelperText>
                    }
                  </FormControl>
                </Grid>

              </Grid>
            </div>
            <div style={{ padding: "10px", backgroundColor: 'white', borderRadius: '10px' }}>
              <Grid container spacing={2} >
                <Grid item xs={12}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Payments
                  </Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='flex-start' alignItems='center'>
                  <FormControl component="fieldset" variant="standard">
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Switch checked={data?.paymentStatus === 'PAID'} onChange={(e) => {
                            setData((prev) => ({ ...prev, paymentStatus: e.target.checked ? 'PAID' : 'PENDING' }))
                          }} name="paymentStatus" />
                        }
                        label="Mark as Paid"
                        labelPlacement='start'
                      />
                    </FormControl>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Payment Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.paymentMode}
                      label="Payment Type"
                      name='paymentMode'
                      onChange={handleChange}
                      error={dataErr.paymentMode}
                      required
                    >
                      {
                        paymentModes.map((mode, i) => (
                          <MenuItem key={i} value={mode}>{mode}</MenuItem>
                        ))
                      }
                      <MenuItem value='EMI'>EMI</MenuItem>
                    </Select>
                    {
                      dataErr.paymentMode &&

                      <FormHelperText sx={{ color: 'red' }}>Please Select Expense Payment Type</FormHelperText>
                    }
                  </FormControl>
                </Grid>

              </Grid>
            </div>


          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'flex-end', padding: "10px" }}>
            <Button variant='contained' onClick={editUser ? handleUpdate : handleSave}>
              {editUser ? 'Update' : 'Save'}
            </Button>
            <Button variant='outlined' onClick={() => {
              if (editUser) {
                setData(initialData);
                setEditUser(false);
              };
              setOpen(false);
              setTempData({});
              setData(initialData);
              setDataErr(initialErr)
            }}>
              Cancel
            </Button>
          </div>
        </Box>

      </Modal>

      <div style={{ marginTop: "20px" }}>
        <DataTable
          columns={offerCoumns}
          data={filteredCustomers}
          pagination
          progressPending={isLoading}
        />
      </div>


      {/* Dialog For Delete */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Remove Offer</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this data?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}
