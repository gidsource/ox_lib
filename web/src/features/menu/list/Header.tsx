import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    background: 'linear-gradient(to right, #094a8f 0%, #062b54 100%)', // Warna Biru khas GTA
    height: 80,
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    fontWeight: 800,
    color: '#fff',
  },
  subHeader: {
    backgroundColor: '#000',
    height: 38,
    width: 384,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  subHeadingText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: 600,
  }
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box>
      <Box className={classes.container}>
        <Text className={classes.heading}>{title}</Text>
      </Box>
      <Box className={classes.subHeader}>
        <Text className={classes.subHeadingText}>INTERACTION MENU</Text>
      </Box>
    </Box>
  );
};

export default React.memo(Header);