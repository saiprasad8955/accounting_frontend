import { Helmet } from 'react-helmet-async';
// sections
import ProductBarcodePage from 'src/sections/product-management/productBarcode';

// ----------------------------------------------------------------------

export default function ProductBarcode() {
    return (
        <>
            <Helmet>
                <title> Dashboard : Barcodes</title>
            </Helmet>

            <ProductBarcodePage />
        </>
    );
}
