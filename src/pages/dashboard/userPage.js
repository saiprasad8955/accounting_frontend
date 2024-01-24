import { Helmet } from 'react-helmet-async';
// sections
import UserView from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Dashboard : User</title>
            </Helmet>

            <UserView />
        </>
    );
}
