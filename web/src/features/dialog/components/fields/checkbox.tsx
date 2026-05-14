import { Checkbox } from '@mantine/core';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const CheckboxField: React.FC<Props> = (props) => {
  return (
    <Checkbox
      {...props.register}
      sx={{ display: 'flex' }}
      required={props.row.required}
      label={props.row.label}
      defaultChecked={props.row.checked}
      disabled={props.row.disabled}
      styles={(theme) => ({
        label: { color: theme.colors.gray[3] },
        input: {
          backgroundColor: theme.colors.dark[7],
          borderColor: theme.colors.dark[5],
          '&:checked': {
            backgroundColor: theme.colors.blue[6], // Warna centang biru
            borderColor: theme.colors.blue[6],
          },
        },
      })}
    />
  );
};

export default CheckboxField;