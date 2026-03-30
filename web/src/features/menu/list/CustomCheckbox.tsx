import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles((theme, params: { isSelected: boolean }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: params.isSelected ? '#000' : '#fff',
    borderRadius: 0, // Kotak tajam (bukan membulat)
    cursor: 'pointer',
    '&:checked': {
      backgroundColor: params.isSelected ? '#000' : '#fff',
      borderColor: params.isSelected ? '#000' : '#fff',
    },
  },
  inner: {
    '> svg > path': {
      fill: params.isSelected ? '#fff' : '#000', // Warna tanda centang
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean; isSelected?: boolean }> = ({ checked, isSelected = false }) => {
  const { classes } = useStyles({ isSelected });
  return (
    <Checkbox
      checked={checked}
      size="sm"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;