import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text, TextInput } from '@mantine/core'; 
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';
import LibIcon from '../../../components/LibIcon'; // Tambahan Import Icon

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '25%',
    width: 320,
    height: 580,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  titleContainer: {
    borderRadius: 4,
    flex: '1 85%',
    backgroundColor: theme.colors.dark[6],
  },
  titleText: {
    color: theme.colors.dark[0],
    padding: 6,
    textAlign: 'center',
  },
  buttonsContainer: {
    height: 480, // Disesuaikan sedikit agar pas
    overflowY: 'scroll',
    marginTop: 10,
  },
  buttonsFlexWrapper: {
    gap: 3,
  },
  searchBoxContainer: {
    marginBottom: 5,
  }
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;
    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setSearchQuery(''); 
    setVisible(true);
  });

  const filteredOptions = Object.entries(contextMenu.options).filter(([key, value]: any) => {
    const title = value.title || key;
    const desc = value.description || '';
    const searchLower = searchQuery.toLowerCase();
    return title.toLowerCase().includes(searchLower) || desc.toLowerCase().includes(searchLower);
  });

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Flex className={classes.header}>
          {contextMenu.menu && (
            <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
          )}
          <Box className={classes.titleContainer}>
            <Text className={classes.titleText}>
              <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
            </Text>
          </Box>
          <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
        </Flex>
        
        {/* Kolom Pencarian yang Diperbarui */}
        <Box className={classes.searchBoxContainer}>
          <TextInput
            placeholder="Search Menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            variant="filled"
            icon={<LibIcon icon="magnifying-glass" />} // Menambahkan Icon Kaca Pembesar
            styles={(theme) => ({
              input: {
                backgroundColor: theme.colors.dark[5], // Warna background sedikit lebih terang agar Highlighted
                color: theme.colors.gray[2],
                border: `1px solid ${theme.colors.dark[4]}`, // Tambahan border agar lebih tegas
                borderRadius: theme.radius.sm,
                transition: 'border-color 0.15s ease',
                '&:focus': {
                  borderColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
                  backgroundColor: theme.colors.dark[6],
                }
              },
              icon: {
                color: theme.colors.gray[5], // Warna icon agar pas dengan tema abu-abu
              }
            })}
          />
        </Box>

        <Box className={classes.buttonsContainer}>
          <Stack className={classes.buttonsFlexWrapper}>
            {filteredOptions.map((option, index) => (
              <ContextButton option={option} key={`context-item-${index}`} />
            ))}
          </Stack>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;