import React from 'react';
import { useConnect, Redirect } from 'nuomi';
import Form from '../Form';

const Layout = () => {
  const [{ data }] = useConnect();

  return data ? <Redirect to="/nginx" /> : <Form />;
};

export default Layout;
