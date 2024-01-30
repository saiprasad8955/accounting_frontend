import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { Button, Chip, Stack, Box, TextField, InputAdornment, Modal, Grid, IconButton, Autocomplete, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DataTable from 'react-data-table-component';
import { DatePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import PercentIcon from '@mui/icons-material/Percent';
import { color, decryptToken } from 'src/utils/common';
import { constants } from 'src/utils/constant';
import axios, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import PhoneIcon from '@mui/icons-material/Phone';

// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  bgcolor: color.modalbackground,
  borderRadius: '10px',
  height: "90%",
  overflowY: 'auto',
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: '10px',
  p: 2,
};

const initialSaleState = {
  customer: null,
  mobileNumber: '',
  salesMan: null,
  invoiceDate: null,
  invoiceDueDate: null,
  products: [],
  offerId: '',
  totalAmount: 0,
  totalDiscount: 0,
  paymentMode: '',
  paymentStatus: ''

};
export default function SalesView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState(() => [
    dayjs('2022-04-17'),
    dayjs('2022-04-21'),
  ]);


  console.log("DB Date", dayjs('2024-01-16T12:07:08.670+00:00'))
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState(initialSaleState);

  const fetchData = async () => {

    try {
      const decryptedToken = localStorage.getItem(constants.keyUserToken);
      const accessToken = decryptToken(decryptedToken);
      const response = await axios.post(endpoints.customer.list, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (response) {
        setCustomers(response.data.data);
      }
    } catch (err) {
      enqueueSnackbar('Failed to fetch customers!', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      name: 'Customer Name',
      selector: row => row.customerName,
    },
    {
      name: 'Product Name',
      selector: row => row.productName,
    },
    {
      name: 'Amount',
      selector: row => row.amount,
    },
    {
      name: 'Payment Mode',
      selector: row => row.mode,
    },
    {
      name: 'Payment Status',
      selector: row => row.status,
    },
    {
      name: 'Invoice Number',
      selector: row => row.number,
    },
    {
      name: 'Last Updated',
      selector: row => row.lastUpdated,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <Button onClick={() => { }} color='info' variant='outlined' endIcon={<ArrowDropDownIcon />}>Action</Button>
      ),
    },
  ];

  const productColumns = [
    {
      name: 'Product Name',
      selector: row => row.productName,
    },
    {
      name: 'Quantity',
      selector: row => row.quantity,
      cell: (row) => (
        <TextField value={row.quantity} size='small' />
      ),
    },
    {
      name: 'Sell Price',
      selector: row => row.sellPrice,
      cell: (row) => (
        <TextField value={row.sellPrice} size='small' />
      ),
    },
    {
      name: 'GST Value',
      selector: row => row.gstValue,
      cell: (row) => (
        <TextField value={row.gstValue} size='small' InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <PercentIcon fontSize='small' />
            </InputAdornment>
          ),
        }} />
      ),
    },
    {
      name: 'Discount',
      selector: row => row.discount,
      cell: (row) => (
        <TextField value={row.discount} size='small' InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <PercentIcon fontSize='small' />
            </InputAdornment>
          ),
        }} />
      ),
    },
    {
      name: 'Net Amount',
      selector: row => row.netAmount,
      cell: (row) => (
        <TextField value={row.netAmount} size='small' />
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <IconButton onClick={() => { }} color='error' variant='outlined'>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const data = [
    {
      customerName: 'Disha Shaha',
      productName: "XXXXX",
      amount: "XXX",
      mode: "Cash",
      status: "Paid",
      number: "XXX",
      lastUpdated: "28 Dec 2023"

    },
    {
      customerName: 'Disha Shaha',
      productName: "XXXXX",
      amount: "XXX",
      mode: "Cash",
      status: "Paid",
      number: "XXX",
      lastUpdated: "28 Dec 2023"

    },
    {
      customerName: 'Disha Shaha',
      productName: "XXXXX",
      amount: "XXX",
      mode: "Cash",
      status: "Paid",
      number: "XXX",
      lastUpdated: "28 Dec 2023"

    },
    {
      customerName: 'Disha Shaha',
      productName: "XXXXX",
      amount: "XXX",
      mode: "Cash",
      status: "Paid",
      number: "XXX",
      lastUpdated: "28 Dec 2023"

    },
  ];

  const { format } = new Intl.NumberFormat('hi-In', {
    style: 'currency',
    currency: 'INR'
  })


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Sales </Typography>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", marginTop: "20px" }}>
        <Stack direction="row" spacing={1}>
          <Chip label="Total ₹ 13,500.00" variant="contained" sx={{ backgroundColor: '#CBF0FF' }} />
          <Chip label="Paid ₹ 5,500.00" variant="contained" sx={{ backgroundColor: '#CBFFE0' }} />
          <Chip label="Pending ₹ 10,000.00" variant="contained" sx={{ backgroundColor: '#FFF7CB' }} />
        </Stack>

        <Stack>
          <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={handleOpen}>
            CREATE SALES ORDER
          </Button>


        </Stack>
      </div >

      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", flexDirection: 'row', alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", marginTop: "8px" }}>
            <TextField
              placeholder='Search'
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DemoContainer
                components={['SingleInputDateRangeField']}
              >
                <SingleInputDateRangeField
                  size='small'
                  label="Date Range"
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>


        <div style={{ marginTop: "20px" }}>
          <DataTable
            columns={columns}
            data={data}
            pagination
          />
        </div>
      </div>

      {/* <Button onClick={() => {
        // window.location.href = `mailto:rsaiprasad4@gmail.com?subject=Shared Content&body=Hii hello`;
        window.location.href = `https://wa.me/+919922466094?text=Hiii Sourav`;
      }}>
        Send Via Email
      </Button> */}


      {/* Sales Modal */}
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          {/* First Row */}
          <Grid container sx={{ backgroundColor: "white", padding: "15px", borderRadius: "10px", display: 'flex', justifyContent: 'space-between', gap: '10px' }}>

            <Grid item xs={3} >
              <Autocomplete
                value={sales.customer}
                options={customers}
                getOptionLabel={(prop) => prop.name}
                fullWidth
                onChange={(event, newValue) => {
                  setSales((prev) => ({ ...prev, customer: newValue }))
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Search Customers" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={3} >
              <TextField
                label='Mobile Number'
                inputProps={{
                  maxLength: 10,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon /> +91
                    </InputAdornment>
                  )
                }}
                value={sales.mobileNumber}
                fullWidth
                onChange={(event, newValue) => {
                  setSales((prev) => ({ ...prev, mobileNumber: newValue }))
                }}

              />
            </Grid>
            <Grid item xs={3} >
              <Autocomplete
                value={sales.salesMan}
                options={customers}
                getOptionLabel={(prop) => prop.name}
                fullWidth
                onChange={(event, newValue) => {
                  setSales((prev) => ({ ...prev, salesMan: newValue }))
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Sales Man" fullWidth />
                )}
              />
            </Grid>

            <Grid container sx={{ display: 'flex', gap: '134px' }}>
              <Grid item xs={3} >
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DatePicker

                    label="Invoice Date"
                    value={sales.invoiceDate}
                    onChange={(newValue) => {
                      setSales((prev) => ({ ...prev, invoiceDate: newValue }))
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={3} >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Invoice Due Date"
                    value={sales.invoiceDueDate}
                    onChange={(newValue) => {
                      setSales((prev) => ({ ...prev, invoiceDueDate: newValue }))
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>


          {/* Second Row */}
          <Grid container sx={{ backgroundColor: "white", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: 'space-between' }} alignItems='center'>
            <Grid item xs={12} md={7} display='flex'>
              <FormControl sx={{ width: "35%" }} >
                <InputLabel id="demo-simple-select-label">All Categories</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label='All Categories'
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <Autocomplete
                options={[]}
                getOptionLabel={(option) => option.title}
                onInputChange={(_, newInputValue) => setOpen(newInputValue)}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Search Products" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField label='Quantity' type='number' />
            </Grid>
            <Grid item xs={12} md={2} >
              <Button startIcon={<AddIcon />} variant='contained' onClick={() => { console.log('order') }} fullWidth>
                ADD TO ORDER
              </Button>
            </Grid>
          </Grid>


          {
            sales.products.length > 0 &&

            <Grid container sx={{ backgroundColor: "white", padding: "15px", borderRadius: "10px", }} alignItems='center'>
              <Grid item xs={12}>
                <DataTable
                  columns={productColumns}
                  data={sales.products}
                />
              </Grid>
              <Grid item xs={12} display='flex' justifyContent='flex-end' sx={{ mt: 2 }}>
                <div >
                  <div>
                    Apply Offer to all products
                  </div>
                  <div style={{ paddingTop: "5px" }}>
                    <FormControl fullWidth >
                      <InputLabel id="demo-simple-select-label">Select Offer</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label='Select Offer'
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Grid>
            </Grid>
          }

          <Grid container display='flex' justifyContent='flex-end'>
            <Grid item xs={12} md={6} lg={6} sx={{ backgroundColor: "white", padding: "15px", borderRadius: "10px", }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Total Discount</div>
                  <div>{format(sales.totalDiscount)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Total Amount</div>
                  <div>{format(sales.totalAmount)}</div>
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid container display='flex' justifyContent='flex-end'>
            <Grid item xs={12} md={6} lg={6} sx={{ backgroundColor: "white", padding: "15px", borderRadius: "10px", display: 'flex', flexDirection: 'row', gap: '10px' }}>
              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label">Select Payment Mode</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label='Select Payment Mode'
                >
                  <MenuItem value={10}>Cash</MenuItem>
                  <MenuItem value={20}>Card</MenuItem>
                  <MenuItem value={30}>Net Banking</MenuItem>
                  <MenuItem value={30}>EMI</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label">Select Payment Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label='Select Payment Status'
                >
                  <MenuItem value={10}>Pending</MenuItem>
                  <MenuItem value={20}>Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container  >
            <Grid item xs={12} md={12} lg={12} sx={{ backgroundColor: "white", p: "15px", borderRadius: "10px" }} display='flex' justifyContent='space-between' alignItems='center'>
              <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', gap: '20px' }}>
                <div>Total  :</div>
                <div>{format(sales.totalAmount)}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant='contained' >SAVE</Button>
                <Button variant='contained' color='error' onClick={handleClose}>CANCEL</Button>
              </div>
            </Grid>
          </Grid>

        </Box>
      </Modal>

    </Container >
  );
}
