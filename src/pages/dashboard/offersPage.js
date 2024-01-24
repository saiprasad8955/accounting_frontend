// @mui
import { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, Menu, MenuItem, Modal, Select, TextField } from '@mui/material';
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
const initialOfferData = {
    code: '',
    description: '',
    type: '',
    status: ''
};


const initialOfferErr = {
    type: false,
    status: false
};


export default function OffersView() {


    const [dateValue, setDateValue] = useState(dayjs('2022-04-17'));
    const utcDateFromBackend = '2024-01-14T18:30:00.000+00:00';  // Replace this with the UTC date from your backend
    const utcDateObject = dayjs.utc(utcDateFromBackend);
    const localDateObject = utcDateObject.local();
    console.log("🚀 ~ OffersView ~ localDateObject:", localDateObject)

    const settings = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();

    // For Modal Open
    const [open, setOpen] = useState(false);

    const [offersLoading, setOffersLoading] = useState(false);
    const [offers, setOffers] = useState([]);
    const [offer, setOffer] = useState(initialOfferData);
    const [offerErr, setOfferErr] = useState(initialOfferErr);
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
        setOffer((prev) => ({ ...prev, code: offerCode }));
        setOpen(true);
        setEditUser(false);
    };

    const handleClose = () => setOpen(false);


    const fetchData = async () => {

        try {
            const decryptedToken = localStorage.getItem(constants.keyUserToken);
            const accessToken = decryptToken(decryptedToken);
            const response = await axios.post(endpoints.offer.list, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            if (response) {
                setOffersLoading(false);
                setOffers(response.data.data);
            }
        } catch (err) {
            enqueueSnackbar('Failed to fetch offers!', { variant: 'error' });
            setOffersLoading(false);
        }
    };

    useEffect(() => {
        setOffersLoading(true);
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // You can use setFormData to update the state when user input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOffer((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === 'type' || name === 'status') {
            // Clear the error for the field when the user starts typing again
            setOfferErr((prevErrors) => ({
                ...prevErrors,
                [name]: false,
            }));
        }
    };


    const handleSave = async () => {

        if (!offer.type) {
            setOfferErr((prevErrs) => ({ ...prevErrs, type: true }))
            return;
        }
        setOfferErr((prevErrs) => ({ ...prevErrs, type: false }))

        if (!offer.status) {
            setOfferErr((prevErrs) => ({ ...prevErrs, status: true }))
            return;
        }
        setOfferErr((prevErrs) => ({ ...prevErrs, status: false }))

        // If no errors, proceed with saving
        const decryptedToken = localStorage.getItem(constants.keyUserToken);
        const accessToken = decryptToken(decryptedToken);
        axios.post(endpoints.offer.add, offer,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            .then((res) => {
                enqueueSnackbar('Offer created successfully!', { variant: 'success' });
                // fetchData();
                handleClose();
                // Reset the error state
                setOfferErr(initialOfferErr);

                // Reset the offer  state
                setOffer(initialOfferData);

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

        setOffer(editedOfferData);
        setOpen(true);

    };

    const handleDeleteDetails = () => {
        setOffer((prev) => ({ ...prev, id: tempData._id }));
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

        axios.post(endpoints.offer.delete, { id: offer.id }, config)
            .then((res) => {
                if (res) {
                    enqueueSnackbar('Offer deleted successfully!', { variant: 'success' });
                    setOpenDialog(false);
                    setOffer(initialOfferData);
                    setOfferErr(initialOfferErr);
                    fetchData();
                };
            }).catch((err) => {
                enqueueSnackbar(err.msg || err.error, { variant: 'error' });
            })
    };

    const handleUpdate = async () => {
        if (!offer.type) {
            setOfferErr((prevErrs) => ({ ...prevErrs, type: true }))
            return;
        }
        setOfferErr((prevErrs) => ({ ...prevErrs, type: false }))

        if (!offer.status) {
            setOfferErr((prevErrs) => ({ ...prevErrs, status: true }))
            return;
        }
        setOfferErr((prevErrs) => ({ ...prevErrs, status: false }))

        // If no errors, proceed with saving
        const decryptedToken = localStorage.getItem(constants.keyUserToken);
        const accessToken = decryptToken(decryptedToken);
        axios.post(endpoints.offer.update, offer,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            .then((res) => {
                enqueueSnackbar('Offer updated successfully!', { variant: 'success' });
                handleClose();
                // Reset the error state
                setOfferErr(initialOfferErr);

                // Reset the offer  state
                setOffer(initialOfferData);

                fetchData();
            }).catch((err) => {
                enqueueSnackbar(err.error || err.msg, { variant: 'error' });
            })



    };

    const offerCoumns = [
        {
            name: 'Offer Code',
            selector: row => row.code,
            sortable: true,
        },
        {
            name: 'Offer Type',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Created On',
            selector: row => formatDate(row.createdAt),
            sortable: true,
        },
        {
            name: 'Actions',
            width: '20%',
            // center: true,
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

    const filteredCustomers = offers.filter((offData) =>
        offData?.code?.toLowerCase().includes(searchQuery?.toLowerCase())
    );


    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Helmet>
                <title> Dashboard : Offers</title>
            </Helmet>

            <Typography variant="h4"> Offer Management </Typography>

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
                    ADD OFFER
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
                            Create New Offer
                        </Typography>
                        <div style={{ padding: "10px", backgroundColor: 'white', borderRadius: '10px' }}>
                            <Grid container spacing={2} >
                                <Grid item xs={4}>
                                    <TextField
                                        label='Offer Code'
                                        name='offercode'
                                        value={offer.code}
                                        disabled
                                        fullWidth
                                        required />
                                </Grid>
                                {/* <Grid item xs={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Controlled picker"
                                            value={dateValue}
                                            onChange={(newValue) => {
                                                const utcValue = newValue.utc().startOf('day').format();;
                                                console.log("🚀 ~ OffersView ~ utcValue:", utcValue)
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid> */}

                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Offer Percentage Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={offer.type}
                                            label="Offer Percentage Type"
                                            name='type'
                                            onChange={handleChange}
                                            error={offerErr.type}
                                            required
                                        >
                                            <MenuItem value='PERCENTAGE'>Percentage Discount</MenuItem>
                                            <MenuItem value='VALUE'>Value Discount</MenuItem>
                                        </Select>
                                        {
                                            offerErr.type &&

                                            <FormHelperText sx={{ color: 'red' }}>Please Select Offer Type</FormHelperText>
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Offer Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={offer.status}
                                            label="Offer Status"
                                            name='status'
                                            onChange={handleChange}
                                            error={offerErr.status}
                                            required
                                        >
                                            <MenuItem value='DRAFT'>Draft</MenuItem>
                                            <MenuItem value='LIVE'>Live</MenuItem>
                                            <MenuItem value='PAST'>Past</MenuItem>
                                        </Select>
                                        {
                                            offerErr.status &&

                                            <FormHelperText sx={{ color: 'red' }}>Please Select Offer Status</FormHelperText>
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Description'
                                        multiline
                                        rows={3}
                                        type='text'
                                        name='description'
                                        value={offer.description}
                                        onChange={handleChange}
                                        fullWidth
                                    />
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
                                setOffer(initialOfferData);
                                setEditUser(false);
                            };
                            setOpen(false);
                            setTempData({});
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
                    progressPending={offersLoading}
                />
            </div>


            {/* Dialog For Delete */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Remove Offer</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this offer?
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
