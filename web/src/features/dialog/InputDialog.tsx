import { Button, Group, Modal, Stack } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(index, {
        value: (row.type !== 'checkbox'
          ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
            ? row.default === true
              ? new Date().getTime()
              : Array.isArray(row.default)
              ? row.default.map((date: any) => new Date(date).getTime())
              : row.default && new Date(row.default as any).getTime()
            : row.default
          : row.checked) ?? null,
      });

      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];
      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <>
      <Modal
        opened={visible}
        onClose={handleClose}
        centered
        closeOnEscape={fields.options?.allowCancel !== false}
        closeOnClickOutside={false}
        size={450} // Disesuaikan lebar menjadi 450px
        withCloseButton={false}
        overlayOpacity={0.5}
        transition="fade"
        exitTransitionDuration={150}
        // PENERAPAN TEMA GELAP DAN AKSEN BIRU
        styles={(theme) => ({
          modal: {
            backgroundColor: 'rgba(10, 10, 10, 0.98)',
            border: `1px solid rgba(255, 255, 255, 0.05)`,
            borderRadius: 6,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7)',
            padding: '20px',
          },
          header: {
            backgroundColor: theme.colors.dark[8],
            borderBottom: `2px solid ${theme.colors.blue[6]}`, // Aksen biru
            borderRadius: 4,
            marginBottom: 15,
            padding: '10px',
          },
          title: {
            color: theme.colors.gray[2],
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 18,
            width: '100%',
          }
        })}
        title={fields.heading}
      >
        <form onSubmit={onSubmit}>
          <Stack>
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === 'input' && (
                    <InputField register={form.register(`test.${index}.value`, { required: row.required })} row={row} index={index} />
                  )}
                  {row.type === 'checkbox' && (
                    <CheckboxField register={form.register(`test.${index}.value`, { required: row.required })} row={row} index={index} />
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <SelectField row={row} index={index} control={form.control} />
                  )}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {row.type === 'date' || row.type === 'date-range' ? (
                    <DateField control={form.control} row={row} index={index} />
                  ) : null}
                  {row.type === 'textarea' && (
                    <TextareaField register={form.register(`test.${index}.value`, { required: row.required })} row={row} index={index} />
                  )}
                </React.Fragment>
              );
            })}
            
            {/* TEMA TOMBOL FOOTER DI SINI */}
            <Group position="right" spacing={10} mt={20}>
              <Button
                uppercase
                variant="subtle"
                onClick={() => handleClose()}
                disabled={fields.options?.allowCancel === false}
                sx={(theme) => ({
                  color: theme.colors.gray[4],
                  '&:hover': { backgroundColor: theme.colors.dark[6] }
                })}
              >
                {locale.ui.cancel}
              </Button>
              <Button 
                uppercase 
                type="submit"
                sx={(theme) => ({
                  backgroundColor: theme.colors.blue[6],
                  '&:hover': { backgroundColor: theme.colors.blue[7] }
                })}
              >
                {locale.ui.confirm}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default InputDialog;