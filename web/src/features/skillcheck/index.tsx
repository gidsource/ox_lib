import { useRef, useState, useEffect, useCallback } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { Box, createStyles, Text } from '@mantine/core';
import type { GameDifficulty } from '../../typings';
import ScaleFade from '../../transitions/ScaleFade';

const BAR_WIDTH = 400; 

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(10, 10, 10, 0.98)',
    padding: '25px 35px',
    borderRadius: 4,
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
  },
  headerText: {
    color: '#00e5ff',
    fontSize: 14,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
  },
  barContainer: {
    position: 'relative',
    width: BAR_WIDTH,
    height: 40,
    backgroundColor: '#050505',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  // Jejak titik latar belakang agar pemain tahu batas bar
  trackDots: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10px',
    opacity: 0.1,
  },
  targetZone: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(0, 229, 255, 0.25)',
    borderLeft: '2px solid #00e5ff',
    borderRight: '2px solid #00e5ff',
    zIndex: 1,
    boxShadow: 'inset 0 0 15px rgba(0, 229, 255, 0.2)',
  },
  movingBar: {
    position: 'absolute',
    height: '80%',
    width: 4,
    backgroundColor: '#fff',
    boxShadow: '0 0 15px #fff, 0 0 5px #fff',
    zIndex: 3,
    borderRadius: 2,
  },
  buttonContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#111',
    border: '2px solid #00e5ff',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#00e5ff',
    fontSize: 24,
    fontWeight: 900,
    textShadow: '0 0 10px rgba(0, 229, 255, 0.8)',
    boxShadow: '0 4px 0 #008ba3',
  }
}));

const TimedBarSkillCheck: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [target, setTarget] = useState({ start: 40, size: 20 });
  const [key, setKey] = useState('E');
  
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const directionRef = useRef<1 | -1>(1);
  const currentProgressRef = useRef(0);

  const difficultyMap = {
    easy: { size: 22, speed: 0.02 }, // Speed dalam persen per milidetik
    medium: { size: 16, speed: 0.035 },
    hard: { size: 10, speed: 0.05 }
  };

  const animate = useCallback((time: number) => {
    if (startTimeRef.current === undefined) startTimeRef.current = time;
    
    const deltaTime = time - startTimeRef.current;
    startTimeRef.current = time;

    // Ambil speed berdasarkan kesulitan (default ke easy jika tidak ada)
    const speed = 0.03; // Base speed

    let nextProgress = currentProgressRef.current + (speed * deltaTime) * directionRef.current;

    if (nextProgress >= 100) {
      nextProgress = 100;
      directionRef.current = -1;
    } else if (nextProgress <= 0) {
      nextProgress = 0;
      directionRef.current = 1;
    }

    currentProgressRef.current = nextProgress;
    setProgress(nextProgress);
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty; inputs?: string[] }) => {
    const diff = Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty;
    // @ts-ignore
    const setting = difficultyMap[diff] || difficultyMap.easy;
    
    const randomStart = Math.floor(Math.random() * 50) + 15;
    
    setTarget({ start: randomStart, size: setting.size });
    setKey((data.inputs ? data.inputs[Math.floor(Math.random() * data.inputs.length)] : 'E').toUpperCase());
    
    currentProgressRef.current = 0;
    setProgress(0);
    directionRef.current = 1;
    startTimeRef.current = undefined;
    
    setVisible(true);
    requestRef.current = requestAnimationFrame(animate);
  });

  const stopGame = useCallback((success: boolean) => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setVisible(false);
    fetchNui('skillCheckOver', success);
  }, []);

  useNuiEvent('skillCheckCancel', () => stopGame(false));

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === key) {
        const isSuccess = currentProgressRef.current >= target.start && 
                          currentProgressRef.current <= (target.start + target.size);
        stopGame(isSuccess);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, key, target, stopGame]);

  return (
    <ScaleFade visible={visible}>
      <Box className={classes.wrapper}>
        <Text className={classes.headerText}>Timed Action</Text>

        <Box className={classes.barContainer}>
          <Box className={classes.trackDots}>
            {Array.from({ length: 20 }).map((_, i) => <Box key={i} sx={{ width: 2, height: 2, backgroundColor: '#fff' }} />)}
          </Box>

          <Box 
            className={classes.targetZone} 
            style={{ left: `${target.start}%`, width: `${target.size}%` }} 
          />
          
          <Box 
            className={classes.movingBar} 
            style={{ left: `${progress}%`, transform: 'translateX(-50%)' }} 
          />
        </Box>

        <Box className={classes.buttonContainer}>{key}</Box>
        
        <Text color="dimmed" size="xs" sx={{ textTransform: 'uppercase', opacity: 0.5 }}>
          Press when indicator is in the blue zone
        </Text>
      </Box>
    </ScaleFade>
  );
};

export default TimedBarSkillCheck;