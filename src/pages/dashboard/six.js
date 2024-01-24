import { Helmet } from 'react-helmet-async';
// sections
import SixView from 'src/sections/six/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Purchase Return Order</title>
      </Helmet>

      <SixView />
    </>
  );
}