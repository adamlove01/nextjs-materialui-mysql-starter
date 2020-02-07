import React from "react";
import Layout from "~/components/layout";
import nextCookie from "next-cookies";

const Home = props => (
  <Layout token={props.token} onPage="home">
    <h1>Guest Home Page</h1>

    <p>This is the default landing page.</p>
    <p>
      Users who are logged out will be redirected here if they try to access any
      page or API route inside login.
    </p>
  </Layout>
);

Home.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx);
  return { token };
};

export default Home;
