import React360Viewer from 'react-360-view';

const Product360View = () => {
  const basePath = 'https://fastly-production.24c.in/webin/360';
  return (
    <React360Viewer
      amount={75} // Number of images
      imagePath={basePath}
      fileName="output_{index}.jpeg"
      autoplay
      spinReverse
      buttonClass="dark"
    />
  );
};

export default Product360View;
