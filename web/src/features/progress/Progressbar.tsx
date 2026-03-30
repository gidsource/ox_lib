import React, { useEffect, useState } from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const TOTAL_SEGMENTS = 25; // Jumlah kotak pixel bar

const useStyles = createStyles((theme) => ({
  wrapper: {
    zIndex: 5,
    width: '15%',
    position: 'fixed',
    bottom: '15%',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: '"Poppins", sans-serif',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: '1.3vh',
    lineHeight: '4vh',
    position: 'relative',
    color: '#ffffff',
    zIndex: 10,
    fontWeight: 600,
    bottom: '-0.5vh',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  },
  progressPercentage: {
    fontSize: '1.3vh',
    right: '-1.9vw',
    lineHeight: '4vh',
    position: 'relative',
    color: '#ffffff',
    zIndex: 10,
    fontWeight: 400,
    bottom: '-0.5vh',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  },
  progressBarContainer: {
    width: '16.8vw',
    height: '2.8vh',
    background: 'rgba(0, 0, 0, 0)',
    overflow: 'hidden',
    position: 'relative',
    display: 'block',
    whiteSpace: 'nowrap',
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgb(61, 63, 79)',
  },
  responsiveBar: {
    background: 'linear-gradient(to right, transparent, rgb(61, 63, 79) 40%, transparent)',
    width: '100%',
    height: '1.8vh',
    position: 'absolute',
    top: '0.5vh',
  },
  responsiveContainer: {
    width: 'calc(100% - 10px)',
    left: '5.5px',
    top: '0.96vh',
    position: 'absolute',
    display: 'flex',
    overflow: 'hidden',
  },
  item: {
    width: '100%',
    height: '0.85vh',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    marginLeft: '1.6px',
    float: 'left',
    display: 'block',
    clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
  },
  itemFilled: {
    backgroundColor: '#4f86c5 !important', // Warna tosca dari script rohkane
  },
}));

const Progressbar: React.FC = () => {
  const { classes, cx } = useStyles();
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [duration, setDuration] = useState(0);
  const [filledSegments, setFilledSegments] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useNuiEvent('progressCancel', () => {
    setVisible(false);
    setFilledSegments(0);
    setPercentage(0);
  });

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setLabel(data.label);
    setDuration(data.duration);
    setFilledSegments(0);
    setPercentage(0);
    setVisible(true); // Memunculkan UI progress
  });

  // Logika interval mengisi kotak-kotak (segments) berdasarkan durasi
  useEffect(() => {
    if (!visible || duration === 0) return;

    const intervalTime = duration / TOTAL_SEGMENTS;
    let currentSegment = 0;

    const timer = setInterval(() => {
      currentSegment++;
      if (currentSegment >= TOTAL_SEGMENTS) {
        clearInterval(timer);
        setFilledSegments(TOTAL_SEGMENTS);
        setPercentage(100);
        setVisible(false); // Sembunyikan UI saat selesai
      } else {
        setFilledSegments(currentSegment);
        setPercentage(Math.round((currentSegment / TOTAL_SEGMENTS) * 100));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [visible, duration]);

  return (
    <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
      <Box className={classes.wrapper}>
        
        <Box className={classes.progressLabels}>
          <Text className={classes.progressLabel}>{label}</Text>
          <Text className={classes.progressPercentage}>{percentage}%</Text>
        </Box>

        <Box className={classes.progressBarContainer}>
          <Box className={classes.responsiveBar} />
          <Box className={classes.responsiveContainer}>
            {/* Melakukan render (loop) sebanyak 25 kotak */}
            {Array.from({ length: TOTAL_SEGMENTS }).map((_, index) => (
              <Box
                key={index}
                className={cx(classes.item, {
                  [classes.itemFilled]: index < filledSegments, // Warna berubah jika terisi
                })}
              />
            ))}
          </Box>
        </Box>

      </Box>
    </ScaleFade>
  );
};

export default Progressbar;