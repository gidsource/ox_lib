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
import LibIcon from '../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  // 1. Kontainer untuk posisi
  positionContainer: {
    position: 'absolute',
    top: '10%',
    right: '25%',
    width: 400, // <--- UBAH ANGKA INI (Sebelumnya 330, sekarang kita jadikan 420 atau sesuai selera)
    zIndex: 100,
  },
  // 2. Kontainer untuk desain (BISA IKUT MENGHILANG SAAT MENU DITUTUP)
  innerWrapper: {
    maxHeight: 700, // Gunakan maxHeight agar otomatis mengecil jika menu sedikit
    height: 'fit-content',
    backgroundColor: 'rgba(10, 10, 10, 0.98)', 
    padding: '12px',
    border: `1px solid rgba(255, 255, 255, 0.05)`,
    borderRadius: 6,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
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
    backgroundColor: theme.colors.dark[8], 
    borderBottom: `2px solid ${theme.colors.blue[6]}`, // Aksen warna biru
  },
  titleText: {
    color: theme.colors.gray[2],
    padding: 8,
    textAlign: 'center',
    fontWeight: 600,
  },
  buttonsContainer: {
    maxHeight: 560, // Gunakan maxHeight agar batas scroll dinamis
    height: 'fit-content',
    overflowY: 'auto', // Berubah jadi auto agar scroll bar hilang jika menu sedikit
    marginTop: 10,
    paddingRight: 4,
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
    },
  },
  buttonsFlexWrapper: {
    gap: 4,
  },
  searchBoxContainer: {
    marginBottom: 8,
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
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || desc.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    // positionContainer berada di luar, innerWrapper berada di DALAM ScaleFade
    <Box className={classes.positionContainer}>
      <ScaleFade visible={visible}>
        <Box className={classes.innerWrapper}>
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
          
          <Box className={classes.searchBoxContainer}>
            <TextInput
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              variant="filled"
              icon={<LibIcon icon="magnifying-glass" />}
              styles={(theme) => ({
                input: {
                  backgroundColor: theme.colors.dark[7],
                  color: theme.colors.gray[2],
                  border: `1px solid ${theme.colors.dark[5]}`,
                  '&:focus': {
                    borderColor: theme.colors.blue[6], 
                  }
                }
              })}
            />
          </Box>

          <Box className={classes.buttonsContainer}>
            <Stack className={classes.buttonsFlexWrapper}>
              {filteredOptions.map((option, index) => (
                <ContextButton option={option} key={`ctx-${index}`} />
              ))}
            </Stack>
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;