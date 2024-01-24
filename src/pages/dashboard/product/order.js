import { Helmet } from 'react-helmet-async';
// sections
import ProductOrder from 'src/sections/product-management/productOrder';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard : Product</title>
      </Helmet>

      <ProductOrder />
    </>
  );
}
