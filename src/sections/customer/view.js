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
import { decryptToken, states } from 'src/utils/common';
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
    backgroundColor: 'lightblue',
    height: '90%',
    overflow: 'auto',
};

const initialCustomerData = {
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
        shippingAddress: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: '',
        },
    },
};

const initialCustomerErr = {
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
        shippingAddress: {
            line1: false,
            line2: false,
            city: false,
            state: false,
            pincode: false,
        },
    },
};

// ----------------------------------------------------------------------

export default function CustomerView() {
    const settings = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();

    // For Modal Open
    const [open, setOpen] = useState(false);

    const [customerLoading, setCustomerLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState(initialCustomerData);
    const [customerErr, setCustomerErr] = useState(initialCustomerErr);
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
        setOpen(true);
        setEditUser(false);
    };

    const handleClose = () => setOpen(false);


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
                setCustomerLoading(false);
                setCustomers(response.data.data);
            }
        } catch (err) {
            enqueueSnackbar('Failed to fetch customers!', { variant: 'error' });
            setCustomerLoading(false);
        }
    };

    useEffect(() => {
        setCustomerLoading(true);
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // You can use setFormData to update the state when user input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        // Clear the error for the field when the user starts typing again
        setCustomerErr((prevErrors) => ({
            ...prevErrors,
            [name]: false,
        }));
    };


    const handleSaveCustomer = async () => {
        const newErrors = { ...initialCustomerErr };

        // Example validation for each field
        if (!customer.name) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!customer.email) {
            newErrors.email = true;
        } else {
            newErrors.email = false;
        }

        if (!customer.mobileNumber) {
            newErrors.mobileNumber = true;
        } else if (!/^[0-9]*$/.test(customer.mobileNumber) || customer.mobileNumber.length !== 10) {
            newErrors.mobileNumber = true;
        } else {
            newErrors.mobileNumber = false;
        }

        if (!customer.type) {
            newErrors.type = true;
        } else {
            newErrors.type = false;
        }

        // Validation for company details
        if (!customer.company.name) {
            newErrors.company.name = true;
        } else {
            newErrors.company.name = false;
        }

        if (!customer.company.gstNumber) {
            newErrors.company.gstNumber = true;
        } else if (customer.company.gstNumber.length !== 15) {
            newErrors.company.gstNumber = true;
        } else {
            newErrors.company.gstNumber = false;
        }
        // Validation for billing address
        const billingAddress = customer.company.billingAddress;
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
        } else if (!/^[0-9]*$/.test(billingAddress.pincode)  || billingAddress.pincode.length !== 6) {
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
        };

        // Validation for shipping address
        const shippingAddress = customer.company.shippingAddress;
        if (!shippingAddress.line1 || !shippingAddress.line2 || !shippingAddress.city ||
            !shippingAddress.state || !shippingAddress.pincode) {
            // If any of the shipping address fields are empty, set errors
            newErrors.company.shippingAddress = {
                line1: !shippingAddress.line1,
                line2: !shippingAddress.line2,
                city: !shippingAddress.city,
                state: !shippingAddress.state,
                pincode: !shippingAddress.pincode,
            };
        } else if (!/^[0-9]*$/.test(shippingAddress.pincode)  || shippingAddress.pincode.length !== 6) {
            // If pincode is not numeric, set error
            newErrors.company.shippingAddress.pincode = true;
        } else {
            // If all shipping address fields are correct, clear errors
            newErrors.company.shippingAddress = {
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
            Object.values(newErrors.company.shippingAddress).some((field) => field === true) ||
            newErrors.company.name || newErrors.company.gstNumber
        ) {
            // If there are errors, set the error state
            setCustomerErr(newErrors);
            return;
        };
        // If no errors, proceed with saving
        const decryptedToken = localStorage.getItem(constants.keyUserToken);
        const accessToken = decryptToken(decryptedToken);
        axios.post(endpoints.customer.add, customer,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            .then((res) => {
                enqueueSnackbar('Customer created successfully!', { variant: 'success' });
                // fetchData();
                handleClose();
                // Reset the error state
                setCustomerErr(initialCustomerErr);

                // Reset the customer  state
                setCustomer(initialCustomerData);

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
                },
                shippingAddress: {
                    line1: tempData.company.shippingAddress.line1,
                    line2: tempData.company.shippingAddress.line2,
                    city: tempData.company.shippingAddress.city,
                    state: tempData.company.shippingAddress.state,
                    pincode: tempData.company.shippingAddress.pincode,
                },
            },
        };

        setCustomer(customerData);
        setOpen(true);

    };

    const handleDeleteDetails = () => {
        setCustomer((prev) => ({ ...prev, id: tempData._id }));
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
        axios.post(endpoints.customer.delete, { id: customer.id }, config)
            .then((res) => {
                if (res) {
                    enqueueSnackbar('Customer deleted successfully!', { variant: 'success' });
                    setOpenDialog(false);
                    setCustomer(initialCustomerData);
                    fetchData();
                };
            }).catch((err) => {
                enqueueSnackbar(err.msg || err.error, { variant: 'error' });
            })
    };

    const handleUpdateCustomer = async () => {
        const newErrors = { ...initialCustomerErr };

        // Example validation for each field
        if (!customer.name) {
            newErrors.name = true;
        }

        if (!customer.email) {
            newErrors.email = true;
        }

        if (!customer.mobileNumber) {
            newErrors.mobileNumber = true;
        }

        if (!customer.type) {
            newErrors.type = true;
        }

        // Validation for company details
        if (!customer.company.name) {
            newErrors.company.name = true;
        }

        if (!customer.company.gstNumber) {
            newErrors.company.gstNumber = true;
        }

        // Validation for billing address
        if (!customer.company.billingAddress.line1) {
            newErrors.company.billingAddress.line1 = true;
        }

        if (!customer.company.billingAddress.line2) {
            newErrors.company.billingAddress.line2 = true;
        }

        if (!customer.company.billingAddress.city) {
            newErrors.company.billingAddress.city = true;
        }

        if (!customer.company.billingAddress.state) {
            newErrors.company.billingAddress.state = true;
        }

        if (!customer.company.billingAddress.pincode) {
            newErrors.company.billingAddress.pincode = true;
        }

        // Validation for shipping address
        if (!customer.company.shippingAddress.line1) {
            newErrors.company.shippingAddress.line1 = true;
        }

        if (!customer.company.shippingAddress.line2) {
            newErrors.company.shippingAddress.line2 = true;
        }

        if (!customer.company.shippingAddress.city) {
            newErrors.company.shippingAddress.city = true;
        }

        if (!customer.company.shippingAddress.state) {
            newErrors.company.shippingAddress.state = true;
        }

        if (!customer.company.shippingAddress.pincode) {
            newErrors.company.shippingAddress.pincode = true;
        }

        // Check if there are any errors
        if (Object.values(newErrors).some((field) => field === true)) {
            // If there are errors, set the error state
            setCustomerErr(newErrors);
        } else {
            // If no errors, proceed with saving

            const decryptedToken = localStorage.getItem(constants.keyUserToken);
            const accessToken = decryptToken(decryptedToken);
            axios.post(endpoints.customer.update, customer,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                })
                .then((res) => {
                    enqueueSnackbar('Customer updated successfully!', { variant: 'success' });
                    // fetchData();
                    handleClose();
                    // Reset the error state
                    setCustomerErr(initialCustomerErr);

                    // Reset the customer  state
                    setCustomer(initialCustomerData);

                    fetchData();
                }).catch((err) => {
                    enqueueSnackbar(err.error || err.msg, { variant: 'error' });
                })



        }
    };

    const customerColumns = [
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

    const filteredCustomers = customers.filter((custData) =>
        custData?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Typography variant="h4"> Customer Master </Typography>

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
                <Button startIcon={<AddIcon />} variant='outlined' color='primary' onClick={handleOpen}>
                    ADD CUSTOMER
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
                                        value={customer.name}
                                        onChange={handleChange}
                                        error={customerErr.name}
                                        helperText={customerErr.name ? 'Invalid customer name!..' : null}
                                        fullWidth
                                        required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Email'
                                        name='email'
                                        value={customer.email}
                                        onChange={handleChange}
                                        error={customerErr.email}
                                        helperText={customerErr.email ? 'Invalid customer email!..' : null}
                                        fullWidth
                                        required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mobile Number"
                                        name="mobileNumber"
                                        value={customer.mobileNumber}
                                        onChange={handleChange}
                                        error={customerErr.mobileNumber}
                                        helperText={customerErr.mobileNumber ? 'Invalid customer mobile number!..' : null}
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
                                            value={customer.type}
                                            label="Type"
                                            name='type'
                                            onChange={handleChange}
                                            error={customerErr.type}
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
                                        value={customer.company.name}
                                        error={customerErr.company.name}
                                        helperText={customerErr.company.name ? 'Invalid company name!..' : null}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.name = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                                        error={customerErr.company.gstNumber}
                                        helperText={customerErr.company.gstNumber ? 'Invalid company name!..' : null}
                                        value={customer.company.gstNumber}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.gstNumber = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                                        error={customerErr.company.billingAddress.line1}
                                        helperText={customerErr.company.billingAddress.line1 ? 'Invalid line1 address!..' : null}
                                        value={customer.company.billingAddress.line1}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.billingAddress.line1 = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                                        error={customerErr.company.billingAddress.line2}
                                        helperText={customerErr.company.billingAddress.line2 ? 'Invalid line2 address!..' : null}
                                        value={customer.company.billingAddress.line2}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.billingAddress.line2 = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                                        error={customerErr.company.billingAddress.city}
                                        helperText={customerErr.company.billingAddress.city ? 'Invalid city name!..' : null}
                                        value={customer.company.billingAddress.city}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.billingAddress.city = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                                            error={customerErr.company.billingAddress.state}
                                            id="demo-simple-select"
                                            value={customer.company.billingAddress.state}
                                            onChange={(e) => {
                                                const prevCustomer = { ...customer };
                                                customer.company.billingAddress.state = e.target.value;
                                                setCustomer(prevCustomer);
                                                setCustomerErr((prev) => ({
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
                                        value={customer.company.billingAddress.pincode}
                                        error={customerErr.company.billingAddress.pincode}
                                        helperText={customerErr.company.billingAddress.pincode ? 'Invalid pincode!..' : null}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.billingAddress.pincode = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                        <div style={{ padding: "10px", backgroundColor: 'white', borderRadius: '10px' }}>
                            <Grid container spacing={2} >
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Shipping Address</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label='Address Line 1'
                                        error={customerErr.company.shippingAddress.line1}
                                        helperText={customerErr.company.shippingAddress.line1 ? 'Invalid line1 address!..' : null}
                                        value={customer.company.shippingAddress.line1}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.shippingAddress.line1 = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                                        error={customerErr.company.shippingAddress.line2}
                                        helperText={customerErr.company.shippingAddress.line2 ? 'Invalid line2 address!..' : null}
                                        value={customer.company.shippingAddress.line2}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.shippingAddress.line2 = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                                        error={customerErr.company.shippingAddress.city}
                                        helperText={customerErr.company.shippingAddress.city ? 'Invalid city name!..' : null}
                                        value={customer.company.shippingAddress.city}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.shippingAddress.city = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                                            error={customerErr.company.shippingAddress.state}
                                            id="demo-simple-select"
                                            value={customer.company.shippingAddress.state}
                                            onChange={(e) => {
                                                const prevCustomer = { ...customer };
                                                customer.company.shippingAddress.state = e.target.value;
                                                setCustomer(prevCustomer);
                                                setCustomerErr((prev) => ({
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
                                        value={customer.company.shippingAddress.pincode}
                                        error={customerErr.company.shippingAddress.pincode}
                                        helperText={customerErr.company.shippingAddress.pincode ? 'Invalid pincode!..' : null}
                                        onChange={(e) => {
                                            const prevCustomer = { ...customer };
                                            customer.company.shippingAddress.pincode = e.target.value;
                                            setCustomer(prevCustomer);
                                            setCustomerErr((prev) => ({
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
                        </div>


                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'flex-end', padding: "10px" }}>
                        <Button variant='contained' onClick={editUser ? handleUpdateCustomer : handleSaveCustomer}>
                            {editUser ? 'Update' : 'Save'}
                        </Button>
                        <Button variant='outlined' onClick={() => {
                            if (editUser) {
                                setCustomer(initialCustomerData);
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
                    columns={customerColumns}
                    data={filteredCustomers}
                    pagination
                    progressPending={customerLoading}
                />
            </div>


            {/* Dialog For Delete */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Remove Customer</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this customer?
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
