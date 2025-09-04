import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
// import FAQ from "../Common/FAQ";
// import WhatCustomerSay from "../Common/WhatCustomerSay";
import Product from "./Product";

const DiwaliDecoration = () => {
  return (
    <>
      <Header />
      {/* <FAQ /> */}
      {/* <WhatCustomerSay /> */}
      <Product categoryName="DIWALI DECORATION" />
      <Footer />
    </>
  );
};

export default DiwaliDecoration;
