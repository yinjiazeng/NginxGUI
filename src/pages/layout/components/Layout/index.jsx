import React from 'react';
import { useConnect } from 'nuomi';
import Form from '../Form';

const Layout = ({ nginx: Nginx }) => {
  const [{ data }] = useConnect();

  return data ? <Nginx /> : <Form />;
};

export default Layout;
