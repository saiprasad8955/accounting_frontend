import { Helmet } from 'react-helmet-async';
// sections
import CustomerView from 'src/sections/customer/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Dashboard : Customer</title>
            </Helmet>

            <CustomerView />
        </>
    );
}
