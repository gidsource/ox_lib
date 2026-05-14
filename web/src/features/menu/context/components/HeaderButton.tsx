import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  // Ubah penamaan kelas dari 'button' menjadi 'root' agar langsung menimpa bawaan Mantine
  root: {
    borderRadius: 4,
    flex: '1 15%',
    height: 38,
    backgroundColor: theme.colors.dark[8],
    border: 'none', // Memaksa border hilang
    transition: 'background-color 0.15s ease',
    '&:hover': {
      backgroundColor: theme.colors.dark[6],
    }
  },
  label: {
    color: params.canClose === false ? theme.colors.dark[5] : theme.colors.gray[4],
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="subtle" // RAHASIA: Gunakan subtle agar tidak ada kotak bawaan "default"
      classNames={{ root: classes.root, label: classes.label }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;