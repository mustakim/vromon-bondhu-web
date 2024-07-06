"use client";
import React, { useEffect } from "react";
import Head from "next/head";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ListPlace from "../../components/ListPlace";

const Home: React.FC = () => {

  return (
    <div>
      <Head>
        <title>CRUD for Vromon Bondhu</title>
        <meta
          name="description"
          content="A simple form using Material-UI in Next.js"
        />
      </Head>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Vromon Bondhu
        </Typography>
        <ListPlace />
      </Container>
    </div>
  );
};

export const dynamic = "force-dynamic";
export default Home;
