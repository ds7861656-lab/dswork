import React from 'react';
import QRCodeLogin from './auth/QRCodeLogin';

const WeChatLogin: React.FC = () => {
  return <QRCodeLogin provider="wechat" />;
};

export default WeChatLogin;