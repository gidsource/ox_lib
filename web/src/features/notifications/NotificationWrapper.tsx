import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, createStyles, Group, keyframes, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  container: {
    width: 300,
    height: 'fit-content',
    backgroundColor: '#000000', // Tema Hitam Pekat
    color: '#ececec',
    padding: 12,
    borderRadius: theme.radius.sm,
    fontFamily: 'Roboto',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    border: '1px solid #1a1a1a',
  },
  title: {
    fontWeight: 600,
    lineHeight: 'normal',
    color: '#ffffff',
  },
  description: {
    fontSize: 12,
    color: theme.colors.gray[5],
    fontFamily: 'Roboto',
    lineHeight: 'normal',
  },
  descriptionOnly: {
    fontSize: 14,
    color: theme.colors.gray[3],
    fontFamily: 'Roboto',
    lineHeight: 'normal',
  },
}));

const createAnimation = (from: string, to: string, visible: boolean) => keyframes({
  from: {
    opacity: visible ? 0 : 1,
    transform: `translate${from}`,
  },
  to: {
    opacity: visible ? 1 : 0,
    transform: `translate${to}`,
  },
});

const getAnimation = (visible: boolean, position: string) => {
  // Durasi animasi diatur agar lebih halus saat menumpuk banyak
  const animationOptions = visible ? '0.25s ease-out forwards' : '0.4s ease-in forwards';
  let animation: { from: string; to: string };

  if (visible) {
    animation = { from: 'X(100%)', to: 'X(0px)' };
  } else {
    animation = { from: 'X(0px)', to: 'X(120%)' };
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`;
};

const durationCircle = keyframes({
  '0%': { strokeDasharray: `0, ${15.1 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${15.1 * 2 * Math.PI}, 0` },
});

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;
    let iconColor: string;
    const position = 'top-right'; // Tetap top-right agar tumpukan dari kanan valid

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;
    if (toastId) setToastKey(prevKey => prevKey + 1);

    switch (data.type) {
      case 'error': iconColor = 'red.6'; break;
      case 'success': iconColor = 'teal.6'; break;
      case 'warning': iconColor = 'yellow.6'; break;
      default: iconColor = 'blue.6'; break;
    }
    
    if (!data.icon) {
      data.icon = data.type === 'error' ? 'circle-xmark' : data.type === 'success' ? 'circle-check' : data.type === 'warning' ? 'circle-exclamation' : 'circle-info';
    }

    if (data.iconColor) iconColor = tinycolor(data.iconColor).toRgbString();

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            ...data.style,
          }}
          className={classes.container}
        >
          <Group noWrap spacing={12}>
            {data.icon && (
              <Box>
                {data.showDuration ? (
                  <RingProgress
                    key={toastKey}
                    size={38}
                    thickness={2}
                    sections={[{ value: 100, color: iconColor }]}
                    styles={{
                      root: {
                        '> svg > circle:nth-of-type(2)': {
                          animation: `${durationCircle} linear forwards reverse`,
                          animationDuration: `${duration}ms`,
                        },
                        margin: -3,
                      },
                    }}
                    label={
                      <Center>
                        <ThemeIcon color={iconColor} radius="xl" size={32} variant="light">
                          <LibIcon icon={data.icon} fixedWidth color={iconColor} animation={data.iconAnimation} />
                        </ThemeIcon>
                      </Center>
                    }
                  />
                ) : (
                  <ThemeIcon color={iconColor} radius="xl" size={32} variant="light">
                    <LibIcon icon={data.icon} fixedWidth color={iconColor} animation={data.iconAnimation} />
                  </ThemeIcon>
                )}
              </Box>
            )}
            <Stack spacing={0}>
              {data.title && <Text className={classes.title}>{data.title}</Text>}
              {data.description && (
                <ReactMarkdown
                  components={MarkdownComponents}
                  className={`${!data.title ? classes.descriptionOnly : classes.description}`}
                >
                  {data.description}
                </ReactMarkdown>
              )}
            </Stack>
          </Group>
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: position as any,
      }
    );
  });

  return (
    <Toaster 
      containerStyle={{
        top: '50%', // Fixed di tengah kanan (Center-Right)
        bottom: 'auto',
        right: 20,
        transform: 'translateY(-50%)' 
      }}
      gutter={10} // Jarak antar notifikasi agar saat slide tidak tabrakan
    />
  );
};

export default Notifications;