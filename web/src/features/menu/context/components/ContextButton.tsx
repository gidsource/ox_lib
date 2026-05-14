import { Box, Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: params.disabled ? theme.colors.dark[4] : '#ececec',
  },
  button: {
    height: 'fit-content',
    width: '100%',
    padding: '12px 14px',
    backgroundColor: theme.colors.dark[8], 
    border: `1px solid transparent`, 
    borderRadius: 4,
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: params.readOnly ? theme.colors.dark[8] : theme.colors.dark[6], 
      borderColor: params.readOnly ? 'transparent' : theme.colors.blue[6], // Hover biru
      transform: params.readOnly ? 'none' : 'translateX(2px)',
    },
  },
  description: {
    color: theme.colors.gray[6],
    fontSize: 12,
  },
  dropdown: {
    padding: 12,
    backgroundColor: theme.colors.dark[9],
    border: `1px solid ${theme.colors.dark[5]}`,
    boxShadow: theme.shadows.md,
  },
  buttonStack: { gap: 4, flex: '1' },
}));

const ContextButton: React.FC<{ option: [string, Option] }> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <HoverCard position="right-start" disabled={button.disabled || !(button.metadata || button.image)} openDelay={150}>
      <HoverCard.Target>
        <Button
          classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
          onClick={() => !button.disabled && !button.readOnly ? (button.menu ? openMenu(button.menu) : clickContext(buttonKey)) : null}
          variant="default"
          disabled={button.disabled}
        >
          <Group position="apart" w="100%" noWrap>
            <Stack className={classes.buttonStack}>
              <Group spacing={8} noWrap>
                {button?.icon && (
                  <LibIcon
                    icon={button.icon as IconProp}
                    fixedWidth
                    style={{ color: button.iconColor || '#ececec' }}
                  />
                )}
                <Text>
                  <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                </Text>
              </Group>
              {button.description && (
                <Text className={classes.description}>
                  <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                </Text>
              )}
              {button.progress !== undefined && (
                <Progress value={button.progress} size="sm" color="blue" />
              )}
            </Stack>
            {(button.menu || button.arrow) && button.arrow !== false && (
              <LibIcon icon="chevron-right" fixedWidth size="sm" />
            )}
          </Group>
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown className={classes.dropdown}>
        {button.image && <Image src={button.image} radius="sm" mb={8} />}
        {Array.isArray(button.metadata) ? (
          button.metadata.map((metadata: any, index: number) => (
            <Box key={index} mb={4}>
              <Text size="sm">
                {typeof metadata === 'string' ? metadata : `${metadata.label}: ${metadata?.value ?? ''}`}
              </Text>
              {metadata.progress !== undefined && <Progress value={metadata.progress} size="xs" color="blue" mt={2} />}
            </Box>
          ))
        ) : (
          typeof button.metadata === 'object' && Object.entries(button.metadata).map(([k, v]: any, i) => (
            <Text key={i} size="sm">{k}: {v}</Text>
          ))
        )}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default ContextButton;