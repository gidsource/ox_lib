import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
  isSelected: boolean; // Tambahan prop untuk mendeteksi pilihan
}

const useStyles = createStyles((theme, params: { iconColor?: string; isSelected: boolean }) => {
  const textColor = params.isSelected ? '#000' : '#fff'; // Teks hitam saat dipilih, putih jika tidak
  return {
    buttonContainer: {
      backgroundColor: params.isSelected ? '#fff' : 'rgba(0, 0, 0, 0.75)',
      padding: '0 10px',
      height: 38,
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      scrollMargin: 8,
      cursor: 'pointer',
      '&:focus': { outline: 'none' },
    },
    iconImage: { maxWidth: 24 },
    buttonWrapper: { height: '100%' },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      width: 24,
      height: 24,
    },
    icon: {
      fontSize: 18,
      color: params.isSelected ? '#000' : (params.iconColor || '#fff'),
    },
    label: {
      color: textColor,
      textTransform: 'uppercase',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'Arial, sans-serif',
    },
    valueText: {
      color: textColor,
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'Arial, sans-serif',
    },
    chevronIcon: {
      fontSize: 12,
      color: textColor,
    },
    scrollIndexValue: {
      color: textColor,
      textTransform: 'uppercase',
      fontSize: 13,
      fontWeight: 500,
    },
    progressStack: {
      width: '100%',
      marginRight: 5,
      justifyContent: 'center',
    },
    progressLabel: {
      color: textColor,
      fontSize: 13,
      textTransform: 'uppercase',
      marginBottom: 2,
    },
  };
});

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked, isSelected }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor, isSelected });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={10} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="icon" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Text className={classes.label}>{item.label}</Text>
            <Group spacing={5}>
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.valueText}>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text className={classes.label}>{item.label}</Text>
            <CustomCheckbox checked={checked} isSelected={isSelected} />
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || 'blue.6'}
              size="sm"
              styles={{ root: { backgroundColor: isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', borderRadius: 0 }, bar: { borderRadius: 0 } }}
            />
          </Stack>
        ) : (
          <Text className={classes.label}>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);