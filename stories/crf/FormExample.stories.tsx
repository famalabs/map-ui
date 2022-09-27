import React from 'react';
import { Meta, Story } from '@storybook/react';
import { InputNumber, InputRadio, InputString, useFormState } from '@src/forms';
import { ButtonLoading, checkRegEx } from '@src';
import { Button, Grid, Paper, Typography } from '@material-ui/core';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'forms/Example',
  argTypes: {},
} as Meta;

const Template: Story = (args) => <FormExample />;

export const Primary: Story = Template.bind({});

const FormExample: React.VFC = () => {
  const { Value, setValue, validators, requires, Valid } = useFormState(
    {
      type: 'group',
      value: {
        name: {
          type: 'node',
          value: 'string',
          validators: [
            { id: 'req', f: (x) => x.length > 4, message: 'Too short' },
            { id: 'letters', f: checkRegEx(/^[a-zA-Z]+$/), message: 'Only letters allowed' },
          ],
          required: true,
        },
        surname: {
          type: 'node',
          value: 'string',
          validators: [{ id: 'letters', f: checkRegEx(/^[a-zA-Z]+$/), message: 'Only letters allowed' }],
        },
        addresses: {
          type: 'array',
          value: {
            type: 'group',
            value: {
              via: { type: 'node', value: 'string', required: true },
              cap: { type: 'node', value: 'number', required: true, validators: [{ f: (n) => n > 0 }] },
            },
          },
        },
        privacy: {
          type: 'node',
          value: 'bool',
          required: true,
        },
      },
    },
    { surname: 'cognom', addresses: [{ via: '', cap: null }] }
  );
  const [showAllErrors, setShowAllErrors] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowAllErrors(true);
    console.log(Value);
  };
  return (
    <form noValidate onSubmit={onSubmit}>
      <InputString
        nameid="name"
        required={requires.name}
        value={Value.name}
        setValue={(text) => setValue.name(text)}
        validators={validators.name}
        showError={showAllErrors}
      />
      <InputString
        nameid="surname"
        required={requires.surname}
        value={Value.surname}
        setValue={setValue.surname}
        validators={validators.surname}
        showError={showAllErrors}
      />
      <Paper style={{ margin: 5, padding: 5 }}>
        <Grid container>
          <Grid item xs={9}>
            <Typography variant="h4">Addresses</Typography>
          </Grid>
          <Grid item xs>
            <Button variant="outlined" onClick={() => setValue.addresses.setAll([])}>
              Reset
            </Button>
          </Grid>
        </Grid>
        {Value.addresses.map((val, idx) => (
          <Grid key={idx} container>
            <Grid item xs={6}>
              <InputString
                nameid={`addressvia${idx}`}
                label="via"
                required={requires.addresses.via}
                value={val.via}
                setValue={setValue.addresses.set(idx).via}
                validators={validators.addresses.via}
                showError={showAllErrors}
              />
            </Grid>
            <Grid item xs={3}>
              <InputNumber
                nameid={`addresscap${idx}`}
                label="cap"
                value={val.cap}
                setValue={setValue.addresses.set(idx).cap}
                required={requires.addresses.cap}
                validators={validators.addresses.cap}
                showError={showAllErrors}
              />
            </Grid>
            <Grid item xs={3}>
              <Button variant="outlined" onClick={() => setValue.addresses.remove(idx)}>
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button variant="outlined" onClick={() => setValue.addresses.add()}>
          Add address
        </Button>
        <Button variant="outlined" onClick={() => setValue.addresses.add({ via: 'new' })}>
          Add Initialized
        </Button>
      </Paper>
      <InputRadio
        nameid="Accetti"
        value={Value.privacy}
        options={[
          { value: true, label: 'si' },
          { value: false, label: 'no' },
        ]}
        setValue={setValue.privacy}
        required={requires.privacy}
        showError={showAllErrors}
      />
      <ButtonLoading label="log data" type="submit" variant="contained" loading={false} />
      <div>
        <pre>{JSON.stringify(Value, null, 2)}</pre>
        <pre>{JSON.stringify(setValue, null, 2)}</pre>
        <pre>{JSON.stringify(validators, null, 2)}</pre>
        <pre>{JSON.stringify(requires, null, 2)}</pre>
        <pre>{JSON.stringify(Valid, null, 2)}</pre>
      </div>
    </form>
  );
};
