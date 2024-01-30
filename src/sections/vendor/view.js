// @mui
import { useEffect, useState } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputAdornment, InputLabel, Menu, MenuItem, Modal, Select, TextField } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import { color, decryptToken, states } from 'src/utils/common';
import axios, { endpoints } from 'src/utils/axios';
import { constants } from 'src/utils/constant';
import { useSnackbar } from 'src/components/snackbar';
import DataTable from 'react-data-table-component';

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
    backgroundColor: color.modalbackground,
    height: '90%',
    overflow: 'auto',
};

const initialVendorData = {
    id: '',
    name: '',
    email: '',
    mobileNumber: '',
    type: '',
    company: {
        name: '',
        gstNumber: '',
        billingAddress: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: '',
        },
        // shippingAddress: {
        //     line1: '',
        //     line2: '',
        //     city: '',
        //     state: '',
        //     pincode: '',
        // },
    },
};

const initialVendorErr = {
    name: false,
    email: false,
    mobileNumber: false,
    type: false,
    company: {
        name: false,
        gstNumber: false,
        billingAddress: {
            line1: false,
            line2: false,
            city: false,
            state: false,
            pincode: false,
        },
    },
};

// ----------------------------------------------------------------------

export default function VendorView() {
    const settings = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();

    // For Modal Open
    const [open, setOpen] = useState(false);

    // Temporary State
    const [tempData, setTempData] = useState({});

    const [isLoading, setVendorLoading] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [vendor, setVendor] = useState(initialVendorData);
    console.log({ vendor })
    const [vendorErr, setVendorErr] = useState(initialVendorErr);
    const [editUser, setEditUser] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');


    // For Actions Dropdown
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);


    // For Delete Customer
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        setEditUser(false);
    };

    const handleClose = () => setOpen(false);


    const fetchData = async () => {

        try {
            const decryptedToken = localStorage.getItem(constants.keyUserToken);
            const accessToken = decryptToken(decryptedToken);
            const response = await axios.post(endpoints.vendor.list, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            if (response) {
                setVendorLoading(false);
                setVendors(response.data.data);
            }
        } catch (err) {
            enqueueSnackbar('Failed to fetch vendors!', { variant: 'error' });
            setVendorLoading(false);
        }
    };

    useEffect(() => {
        setVendorLoading(true);
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // You can use setFormData to update the state when user input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVendor((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        // Clear the error for the field when the user starts typing again
        setVendorErr((prevErrors) => ({
            ...prevErrors,
            [name]: false,
        }));
    };


    const handleSaveUser = async () => {
        const newErrors = { ...initialVendorErr };


        // Example validation for each field
        if (!vendor.name) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!vendor.email) {
            newErrors.email = true;
        } else {
            newErrors.email = false;
        }

        if (!vendor.mobileNumber) {
            newErrors.mobileNumber = true;
        } else if (!/^[0-9]*$/.test(vendor.mobileNumber) || vendor.mobileNumber.length !== 10) {
            newErrors.mobileNumber = true;
        } else {
            newErrors.mobileNumber = false;
        }

        if (!vendor.type) {
            newErrors.type = true;
        } else {
            newErrors.type = false;
        }

        // Validation for company details
        if (!vendor.company.name) {
            newErrors.company.name = true;
        } else {
            newErrors.company.name = false;
        }

        if (!vendor.company.gstNumber) {
            newErrors.company.gstNumber = true;
        } else if (vendor.company.gstNumber.length !== 15) {
            newErrors.company.gstNumber = true;
        } else {
            newErrors.company.gstNumber = false;
        }
        // Validation for billing address
        const billingAddress = vendor.company.billingAddress;
        if (!billingAddress.line1 || !billingAddress.line2 || !billingAddress.city ||
            !billingAddress.state || !billingAddress.pincode) {
            // If any of the billing address fields are empty, set errors
            newErrors.company.billingAddress = {
                line1: !billingAddress.line1,
                line2: !billingAddress.line2,
                city: !billingAddress.city,
                state: !billingAddress.state,
                pincode: !billingAddress.pincode,
            };
        } else if (!/^[0-9]*$/.test(billingAddress.pincode)) {
            // If pincode is not numeric, set error
            newErrors.company.billingAddress.pincode = true;
        } else {
            // If all billing address fields are correct, clear errors
            newErrors.company.billingAddress = {
                line1: false,
                line2: false,
                city: false,
                state: false,
                pincode: false,
            };
        }

        // Check if there are any errors
        if (Object.values(newErrors).some((field) => field === true) ||
            Object.values(newErrors.company.billingAddress).some((field) => field === true) ||
            newErrors.company.name || newErrors.company.gstNumber
        ) {
            // If there are errors, set the error state
            setVendorErr(newErrors);
            return;
        };



        // If no errors, proceed with saving
        const decryptedToken = localStorage.getItem(constants.keyUserToken);
        const accessToken = decryptToken(decryptedToken);
        axios.post(endpoints.vendor.add, vendor,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            .then((res) => {
                enqueueSnackbar('Vendor created successfully!', { variant: 'success' });
                // fetchData();
                handleClose();
                // Reset the error state
                setVendorErr(initialVendorErr);

                // Reset the vendor  state
                setVendor(initialVendorData);

                fetchData();
            }).catch((err) => {
                enqueueSnackbar(err.error || err.msg, { variant: 'error' });
            })
    };

    const handleEditDetails = () => {
        setEditUser(true);
        setAnchorEl(null);
        const customerData = {
            id: tempData._id,
            name: tempData.name,
            email: tempData.email,
            mobileNumber: tempData.mobileNumber.slice(3),
            type: tempData.type,
            company: {
                name: tempData.company.name,
                gstNumber: tempData.company.gstNumber,
                billingAddress: {
                    line1: tempData.company.billingAddress.line1,
                    line2: tempData.company.billingAddress.line2,
                    city: tempData.company.billingAddress.city,
                    state: tempData.company.billingAddress.state,
                    pincode: tempData.company.billingAddress.pincode,
                }
            },
        };

        setVendor(customerData);
        setOpen(true);
        setTempData({});
    };

    const handleDeleteDetails = () => {
        setVendor((prev) => ({ ...prev, id: tempData._id }));
        setOpenDialog(true);
        setAnchorEl(null);
        setTempData({});
    };

    const handleConfirmDelete = () => {

        const decryptedToken = localStorage.getItem(constants.keyUserToken);
        const accessToken = decryptToken(decryptedToken);
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        axios.post(endpoints.vendor.delete, { id: vendor.id }, config)
            .then((res) => {
                if (res) {
                    enqueueSnackbar('Vendor deleted successfully!', { variant: 'success' });
                    setOpenDialog(false);
                    setVendor(initialVendorData);
                    fetchData();
                };
            }).catch((err) => {
                enqueueSnackbar(err.msg || err.error, { variant: 'error' });
            })
    };

    const handleUpdateCustomer = async () => {
        const newErrors = { ...initialVendorErr };

        // Example validation for each field
        if (!vendor.name) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!vendor.email) {
            newErrors.email = true;
        } else {
            newErrors.email = false;
        }

        if (!vendor.mobileNumber) {
            newErrors.mobileNumber = true;
        } else if (!/^[0-9]*$/.test(vendor.mobileNumber) || vendor.mobileNumber.length !== 10) {
            newErrors.mobileNumber = true;
        } else {
            newErrors.mobileNumber = false;
        }

        if (!vendor.type) {
            newErrors.type = true;
        } else {
            newErrors.type = false;
        }

        // Validation for company details
        if (!vendor.company.name) {
            newErrors.company.name = true;
        } else {
            newErrors.company.name = false;
        }

        if (!vendor.company.gstNumber) {
            newErrors.company.gstNumber = true;
        } else if (vendor.company.gstNumber.length !== 15) {
            newErrors.company.gstNumber = true;
        } else {
            newErrors.company.gstNumber = false;
        }
        // Validation for billing address
        const billingAddress = vendor.company.billingAddress;
        if (!billingAddress.line1 || !billingAddress.line2 || !billingAddress.city ||
            !billingAddress.state || !billingAddress.pincode) {
            // If any of the billing address fields are empty, set errors
            newErrors.company.billingAddress = {
                line1: !billingAddress.line1,
                line2: !billingAddress.line2,
                city: !billingAddress.city,
                state: !billingAddress.state,
                pincode: !billingAddress.pincode,
            };
        } else if (!/^[0-9]*$/.test(billingAddress.pincode)) {
            // If pincode is not numeric, set error
            newErrors.company.billingAddress.pincode = true;
        } else {
            // If all billing address fields are correct, clear errors
            newErrors.company.billingAddress = {
                line1: false,
                line2: false,
                city: false,
                state: false,
                pincode: false,
            };
        }

        // Check if there are any errors
        if (Object.values(newErrors).some((field) => field === true) ||
            Object.values(newErrors.company.billingAddress).some((field) => field === true) ||
            newErrors.company.name || newErrors.company.gstNumber
        ) {
            // If there are errors, set the error state
            setVendorErr(newErrors);
            return;
        };

        const decryptedToken = localStorage.getItem(constants.keyUserToken);
        const accessToken = decryptToken(decryptedToken);
        axios.post(endpoints.vendor.update, vendor,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            .then((res) => {
                enqueueSnackbar('Vendor updated successfully!', { variant: 'success' });
                // fetchData();
                handleClose();
                // Reset the error state
                setVendorErr(initialVendorErr);

                // Reset the vendor  state
                setVendor(initialVendorData);

                fetchData();
            }).catch((err) => {
                enqueueSnackbar(err.error || err.msg, { variant: 'error' });
            })
    };

    const vendorColumns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Company Name',
            selector: row => row.company.name,
            sortable: true,
        },
        {
            name: 'Email Address',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Contact Number',
            selector: row => row.mobileNumber,
            sortable: true,
        },
        {
            name: 'GST Number',
            selector: row => row.company.gstNumber,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row, index) => (
                <>
                    <Button onClick={(event) => {
                        setAnchorEl(event.currentTarget);
                        setTempData(row);
                    }} style={{ color: color.actionButton }} variant='outlined' endIcon={<ArrowDropDownIcon />}>Action</Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={() => {
                            setAnchorEl(null);
                            setTempData({});
                        }}
                        MenuListProps={{
                            'aria-labelledby': `basic-button-${index}`,
                        }}
                    >
                        <MenuItem onClick={() => handleEditDetails()}>Edit Details</MenuItem>
                        <MenuItem onClick={() => handleDeleteDetails()}>Remove</MenuItem>
                    </Menu>
                </>
            ),
        },
    ];

    const filteredUsers = vendors.length > 0 ?
        vendors.filter((custData) =>
            custData?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
        )
        : vendors

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Typography variant="h4"> Vendor Master </Typography>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <TextField
                    size="small"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Search"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button startIcon={<AddIcon />} variant='contained' color='primary' onClick={handleOpen}>
                    ADD VENDOR
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
                                        label='Name'
                                        name='name'
                                        value={vendor.name}
                                        onChange={handleChange}
                                        error={vendorErr.name}
                                        helperText={vendorErr.name ? 'Invalid vendor name!..' : null}
                                        fullWidth
                                        required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Email'
                                        name='email'
                                        value={vendor.email}
                                        onChange={handleChange}
                                        error={vendorErr.email}
                                        helperText={vendorErr.email ? 'Invalid vendor email!..' : null}
                                        fullWidth
                                        required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mobile Number"
                                        name="mobileNumber"
                                        value={vendor.mobileNumber}
                                        onChange={handleChange}
                                        error={vendorErr.mobileNumber}
                                        helperText={vendorErr.mobileNumber ? 'Invalid vendor mobile number!..' : null}
                                        fullWidth
                                        required
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
                                    />

                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={vendor.type}
                                            label="Type"
                                            name='type'
                                            onChange={handleChange}
                                            error={vendorErr.type}
                                        >
                                            <MenuItem value='TAXABLE'>Taxable</MenuItem>
                                            <MenuItem value='EXEMPTED'>Exempted</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                            </Grid>
                        </div>
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            Company Details
                        </Typography>

                        <div style={{ padding: "10px", backgroundColor: 'white', borderRadius: '10px' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Company Name'
                                        fullWidth
                                        value={vendor.company.name}
                                        error={vendorErr.company.name}
                                        helperText={vendorErr.company.name ? 'Invalid company name!..' : null}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.name = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    name: false
                                                }
                                            }))
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='GST Number'
                                        fullWidth
                                        error={vendorErr.company.gstNumber}
                                        helperText={vendorErr.company.gstNumber ? 'Invalid GST Number!..' : null}
                                        value={vendor.company.gstNumber}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.gstNumber = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    gstNumber: false
                                                }
                                            }))
                                        }}
                                        inputProps={{
                                            maxLength: 15,
                                        }}
                                    />
                                </Grid>

                            </Grid>
                        </div>


                        <div style={{ padding: "10px", backgroundColor: 'white', borderRadius: '10px' }}>
                            <Grid container spacing={2} >
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Billing Address</Typography>
                                </Grid>


                                <Grid item xs={6}>
                                    <TextField label='Address Line 1'
                                        error={vendorErr.company.billingAddress.line1}
                                        helperText={vendorErr.company.billingAddress.line1 ? 'Invalid line1 address!..' : null}
                                        value={vendor.company.billingAddress.line1}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.billingAddress.line1 = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    billingAddress: {
                                                        ...prev.company.billingAddress,
                                                        line1: false
                                                    }
                                                }
                                            }))
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='Address Line 2'
                                        error={vendorErr.company.billingAddress.line2}
                                        helperText={vendorErr.company.billingAddress.line2 ? 'Invalid line2 address!..' : null}
                                        value={vendor.company.billingAddress.line2}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.billingAddress.line2 = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    billingAddress: {
                                                        ...prev.company.billingAddress,
                                                        line2: false
                                                    }
                                                }
                                            }))
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='City'
                                        error={vendorErr.company.billingAddress.city}
                                        helperText={vendorErr.company.billingAddress.city ? 'Invalid city name!..' : null}
                                        value={vendor.company.billingAddress.city}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.billingAddress.city = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    billingAddress: {
                                                        ...prev.company.billingAddress,
                                                        city: false
                                                    }
                                                }
                                            }))
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select State</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            error={vendorErr.company.billingAddress.state}
                                            id="demo-simple-select"
                                            value={vendor.company.billingAddress.state}
                                            onChange={(e) => {
                                                const prevVendor = { ...vendor };
                                                vendor.company.billingAddress.state = e.target.value;
                                                setVendor(prevVendor);
                                                setVendorErr((prev) => ({
                                                    ...prev, company: {
                                                        ...prev.company,
                                                        billingAddress: {
                                                            ...prev.company.billingAddress,
                                                            state: false
                                                        }
                                                    }
                                                }))
                                            }}
                                            label="Select State"
                                        >
                                            {
                                                states.map((state, index) => (
                                                    <MenuItem key={index} value={state}>{state}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Pincode"
                                        name="pincode"
                                        value={vendor.company.billingAddress.pincode}
                                        error={vendorErr.company.billingAddress.pincode}
                                        helperText={vendorErr.company.billingAddress.pincode ? 'Invalid pincode!..' : null}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.billingAddress.pincode = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    billingAddress: {
                                                        ...prev.company.billingAddress,
                                                        pincode: false
                                                    }
                                                }
                                            }))
                                        }
                                        }
                                        fullWidth
                                        required
                                        inputProps={{
                                            maxLength: 6, // Set maximum length to 4 characters
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        {/* <div style={{ padding: "10px", backgroundColor: 'white', borderRadius: '10px' }}>
                            <Grid container spacing={2} >
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Shipping Address</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='Address Line 1'
                                        error={vendorErr.company.shippingAddress.line1}
                                        helperText={vendorErr.company.shippingAddress.line1 ? 'Invalid line1 address!..' : null}
                                        value={vendor.company.shippingAddress.line1}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.shippingAddress.line1 = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    shippingAddress: {
                                                        ...prev.company.shippingAddress,
                                                        line1: false
                                                    }
                                                }
                                            }))
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='Address Line 2'
                                        error={vendorErr.company.shippingAddress.line2}
                                        helperText={vendorErr.company.shippingAddress.line2 ? 'Invalid line2 address!..' : null}
                                        value={vendor.company.shippingAddress.line2}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.shippingAddress.line2 = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    shippingAddress: {
                                                        ...prev.company.shippingAddress,
                                                        line2: false
                                                    }
                                                }
                                            }))
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='City'
                                        error={vendorErr.company.shippingAddress.city}
                                        helperText={vendorErr.company.shippingAddress.city ? 'Invalid city name!..' : null}
                                        value={vendor.company.shippingAddress.city}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.shippingAddress.city = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    shippingAddress: {
                                                        ...prev.company.shippingAddress,
                                                        city: false
                                                    }
                                                }
                                            }))
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select State</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            error={vendorErr.company.shippingAddress.state}
                                            id="demo-simple-select"
                                            value={vendor.company.shippingAddress.state}
                                            onChange={(e) => {
                                                const prevVendor = { ...vendor };
                                                vendor.company.shippingAddress.state = e.target.value;
                                                setVendor(prevVendor);
                                                setVendorErr((prev) => ({
                                                    ...prev, company: {
                                                        ...prev.company,
                                                        shippingAddress: {
                                                            ...prev.company.shippingAddress,
                                                            state: false
                                                        }
                                                    }
                                                }))
                                            }}
                                            label="Select State"
                                        >
                                            {
                                                states.map((state, index) => (
                                                    <MenuItem key={index} value={state}>{state}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Pincode"
                                        name="pincode"
                                        value={vendor.company.shippingAddress.pincode}
                                        error={vendorErr.company.shippingAddress.pincode}
                                        helperText={vendorErr.company.shippingAddress.pincode ? 'Invalid pincode!..' : null}
                                        onChange={(e) => {
                                            const prevVendor = { ...vendor };
                                            vendor.company.shippingAddress.pincode = e.target.value;
                                            setVendor(prevVendor);
                                            setVendorErr((prev) => ({
                                                ...prev, company: {
                                                    ...prev.company,
                                                    shippingAddress: {
                                                        ...prev.company.shippingAddress,
                                                        pincode: false
                                                    }
                                                }
                                            }))
                                        }
                                        }
                                        fullWidth
                                        required
                                        inputProps={{
                                            maxLength: 6, // Set maximum length to 4 characters
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </div> */}


                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'flex-end', padding: "10px" }}>
                        <Button variant='contained' color='primary' onClick={editUser ? handleUpdateCustomer : handleSaveUser}>
                            {editUser ? 'Update' : 'Save'}
                        </Button>
                        <Button variant='outlined' onClick={() => {
                            setVendorErr(initialVendorErr)
                            if (editUser) {
                                setVendor(initialVendorData);
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
                    columns={vendorColumns}
                    data={filteredUsers}
                    pagination
                    progressPending={isLoading}
                />
            </div>


            {/* Dialog For Delete */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Remove Vendor</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this vendor?
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
