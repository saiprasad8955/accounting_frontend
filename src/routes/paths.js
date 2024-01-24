// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    purchase: {
      root: `${ROOTS.DASHBOARD}/purchase`,
      order: `${ROOTS.DASHBOARD}/purchase/order`,
      returnOrder: `${ROOTS.DASHBOARD}/purchase/returnOrder`,
    },
    payments: `${ROOTS.DASHBOARD}/payments`,
    receipts: `${ROOTS.DASHBOARD}/receipts`,
    expenditure: `${ROOTS.DASHBOARD}/expenditure`,
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      list: `${ROOTS.DASHBOARD}/product/list`,
      barcode: `${ROOTS.DASHBOARD}/product/barcode`,
      // returnOrder: `${ROOTS.DASHBOARD}/product/returnOrder`,
    },
    vendor: `${ROOTS.DASHBOARD}/vendor`,
    customer: `${ROOTS.DASHBOARD}/customer`,
    user: `${ROOTS.DASHBOARD}/user`,
    offer: `${ROOTS.DASHBOARD}/offer`,
    // two: `${ROOTS.DASHBOARD}/two`,
    // three: `${ROOTS.DASHBOARD}/three`,
    // group: {
    //   root: `${ROOTS.DASHBOARD}/group`,
    //   five: `${ROOTS.DASHBOARD}/group/five`,
    //   six: `${ROOTS.DASHBOARD}/group/six`,
    // },
  },
};
