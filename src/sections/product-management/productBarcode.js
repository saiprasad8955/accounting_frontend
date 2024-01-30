// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useState } from 'react';
import { Grid, Tab, Tabs, TextField, Button, InputAdornment, Modal, MenuItem, Menu } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DataTable from 'react-data-table-component';
import { constants } from 'src/utils/constant';
import { color, decryptToken, formatDate } from 'src/utils/common';
import axios, { endpoints } from 'src/utils/axios';
import PrintIcon from '@mui/icons-material/Print';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    p: 3,
};

export default function ProductBarcode() {
    const settings = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();
    const [value, setValue] = useState('one');
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isProductsLoading, setIsProductsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [barcodeValues, setBarcodeValues] = useState({
        _id: '',
        percentageValue: '',
        value: ''
    });

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const fetchBarcodeValues = async () => {

        try {
            const decryptedToken = localStorage.getItem(constants.keyUserToken);
            const accessToken = decryptToken(decryptedToken);
            const response = await axios.post(endpoints.productBarcodeValues.details, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            if (response) {
                console.log(response);
                setIsLoading(false);
                if (response.data.data && Object.keys(response.data.data).length > 0) {
                    setBarcodeValues(response.data.data);
                };
            }
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Failed to fetch Barcode Values!', { variant: 'error' });
            setIsLoading(false);
        }
    };


    const handleChangeBarcodeValues = (name, fieldValue) => {

        setBarcodeValues((prev) => ({
            ...prev,
            [name]: fieldValue
        }));



    };

    const fetchData = async () => {

        try {
            const decryptedToken = localStorage.getItem(constants.keyUserToken);
            const accessToken = decryptToken(decryptedToken);
            const response = await axios.post(endpoints.product.list, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            if (response) {
                setIsProductsLoading(false);
                setProducts(response.data.data);
            }
        } catch (err) {
            enqueueSnackbar('Failed to fetch products!', { variant: 'error' });
            setIsProductsLoading(false);
        }
    };

    // For Actions Dropdown
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    // Temporary State
    const [tempData, setTempData] = useState({});


    useEffect(() => {
        setIsLoading(true);
        fetchBarcodeValues();

        // // Products
        setIsProductsLoading(true);
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = () => {
        if (barcodeValues._id.length > 0) {
            handleBarcodeUpdateValues();
        } else {
            handleBarcodeSaveValues();
        }
    }

    const handleBarcodeSaveValues = async () => {


        // If no errors, proceed with saving
        const decryptedToken = localStorage.getItem(constants.keyUserToken);
        const accessToken = decryptToken(decryptedToken);
        axios.post(endpoints.productBarcodeValues.add, barcodeValues,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            .then((res) => {
                enqueueSnackbar('Barcode Values created successfully!', { variant: 'success' });
                setBarcodeValues(res.data.data);
                handleClose();
            }).catch((err) => {
                enqueueSnackbar(err.error || err.msg, { variant: 'error' });
            })
    };

    const handleBarcodeUpdateValues = async () => {


        // If no errors, proceed with saving
        const decryptedToken = localStorage.getItem(constants.keyUserToken);
        const accessToken = decryptToken(decryptedToken);
        axios.post(endpoints.productBarcodeValues.update, barcodeValues,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            .then((res) => {
                enqueueSnackbar('Barcode Values updated successfully!', { variant: 'success' });
                handleClose();
            }).catch((err) => {
                enqueueSnackbar(err.error || err.msg, { variant: 'error' });
            })
    };

    const productBarcodeColumns = [
        {
            name: 'Product Name',
            selector: row => row.name,
            sortable: true,
            width: 'auto',
        },
        {
            name: 'Product Barcode',
            selector: row => row.barcode,
            sortable: true,
            width: 'auto',
            center: 'true'
        },
        {
            name: 'Last Updated',
            selector: row => formatDate(row.updatedAt),
            sortable: true,
            width: 'auto',
            center: 'true',
        },
        {
            name: 'Actions',
            width: 'auto',
            center: 'true',
            cell: (row) => (
                <Button onClick={() => { }} style={{ color: color.actionButton }} variant='outlined' endIcon={<PrintIcon />}>Print</Button>
            ),
        },
    ];

    const filteredBarcodeProducts =
        products.filter((productBarcodeData) =>
            productBarcodeData?.barcode?.toString().includes(searchQuery)
        );
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Typography variant="h4"> Product Barcode </Typography>


            <Tabs
                sx={{ mt: 2 }}
                value={value}
                onChange={handleChangeTab}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="one" label="Barcode" />
                <Tab value="two" label="Barcode Values" />
            </Tabs>


            {
                value === 'one' &&
                <Box
                    sx={{
                        mt: 2,
                        width: 1,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                        border: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                size="small"
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text"
                                placeholder="Search Barcode"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>

                            <DataTable
                                style={{ borderRadius: "20px" }}
                                title='Barcodes'
                                data={filteredBarcodeProducts}
                                columns={productBarcodeColumns}
                                progressPending={isProductsLoading}
                                pagination
                            />
                        </Grid>
                    </Grid>
                </Box>
            }



            {
                value === 'two' &&
                <Box
                    sx={{
                        mt: 2,
                        width: 1,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                        border: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                >
                    <Grid container spacing={2}>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Percentage Value"
                                name='percentageValue'
                                value={barcodeValues.percentageValue}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Value"
                                name='value'
                                value={barcodeValues.value}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant='contained' onClick={handleOpen} >
                                CONFIGURE
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            }

            <Modal
                open={open}
            >
                <Box sx={style}>
                    <Grid container spacing={2}>

                        <Grid item xs={6}>

                            <TextField
                                fullWidth
                                type='number'
                                label="Percentage Value"
                                name='percentageValue'
                                value={barcodeValues.percentageValue}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                onChange={(e) => handleChangeBarcodeValues('percentageValue', e.target.value)}

                            />
                        </Grid>
                        <Grid item xs={6}>

                            <TextField
                                fullWidth
                                type='number'
                                label="Value"
                                name='value'
                                value={barcodeValues.value}
                                onChange={(e) => handleChangeBarcodeValues('value', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='flex-end' gap='10px' >

                            <Button variant='contained' onClick={handleSave} disabled={!barcodeValues.percentageValue || !barcodeValues.value} >
                                CONFIGURE
                            </Button>
                            <Button variant='contained' color='error' onClick={handleClose} >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

        </Container >
    );
}
