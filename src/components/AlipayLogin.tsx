import React from 'react';
import QRCodeLogin from './auth/QRCodeLogin';

const AlipayLogin: React.FC = () => {
  return <QRCodeLogin provider="alipay" />;
};

export default AlipayLogin;