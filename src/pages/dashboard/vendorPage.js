import { Helmet } from 'react-helmet-async';
// sections
import VendorView from 'src/sections/vendor/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Dashboard : Vendor</title>
            </Helmet>

            <VendorView />
        </>
    );
}
