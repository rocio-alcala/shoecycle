import { useFormik } from 'formik';
import { useRef } from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import countries from '../src/countries+cities.json';
import Select from 'react-select';
import Button from './styled/Button';

const sizeOptions = [
  6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13,
].map((size) => ({ value: size, label: size }));

const kilometersOptions = [
  { value: 0, label: 'new' },
  { value: 5, label: '<5' },
  { value: 10, label: '<10' },
  { value: 15, label: '<15' },
  { value: 20, label: '<20' },
  { value: 30, label: '<30' },
  { value: 40, label: '<40' },
  { value: 50, label: '<50' },
  { value: 60, label: '<60' },
  { value: 70, label: '<70' },
  { value: 90, label: '<90' },
  { value: 120, label: '<120' },
  { value: 150, label: '<150' },
  { value: 199, label: '<199' },
  { value: 200, label: '>200' },
];

const Form = styled.form`
  margin: 0 auto;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Field = styled.div`
  margin-bottom: 0.6em;

  > input {
    padding: 0.3em;
    vertical-align: middle;
    border: none;
    border-radius: 0.1em;
    background-color: ${(props) => props.theme.colours.white};
  }

  > input:focus {
    outline: none;
    outline-offset: none;
    box-shadow: inset 0 0 0.3em ${(props) => props.theme.colours.primary};
    -moz-box-shadow: inset 0 0 0.3em ${(props) => props.theme.colours.primary};
    -webkit-box-shadow: inset 0 0 0.3em
      ${(props) => props.theme.colours.primary};
  }

  > input[type='text'] {
    width: 18em;
    max-width: 65vw;
  }

  > input[type='checkbox'] {
    -webkit-appearance: none;
    width: 0.9em;
    height: 0.9em;
    background-color: ${(props) => props.theme.colours.white};
    border-radius: 0.2em;
    margin-right: 0.1em;
  }

  > input[type='checkbox']:checked {
    background: ${(props) => props.theme.colours.secondary};
  }

  > input[type='checkbox']:disabled {
    background-color: ${(props) =>
      props.disabled ? props.theme.colours.disabled : null};
  }

  > select {
    padding: 0.15em;
    border: none;
    border-radius: 0.1em;
    background-color: ${(props) => props.theme.colours.white};
    margin-right: 0.2em;
  }

  > select:focus {
    outline: none;
    outline-offset: none;
    box-shadow: inset 0 0 0.3em ${(props) => props.theme.colours.primary};
  }

  > label {
    vertical-align: middle;
    margin-left: 0.2em;
    color: ${(props) => (props.disabled ? props.theme.colours.disabled : null)};
  }
`;

const ShoeForm = ({ addShoe }) => {
  const refCity = useRef(null);
  const refCountry = useRef(null);
  const refSize = useRef(null);
  const refKilometers = useRef(null);

  const formik = useFormik({
    initialValues: {
      ownerName: '',
      email: '',
      brand: '',
      model: '',
      size: 8,
      isFemaleShoe: false,
      isTrailShoe: false,
      kilometers: 0,
      country: '',
      city: '',
      ships: false,
      intShipping: false,
      paidShipping: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      brand: Yup.string().required('Required'),
      model: Yup.string().required('Required'),
      country: Yup.string().required('Required'),
      size: Yup.number().required('Required'),
      kilometers: Yup.number().required('Required'),
    }),
    onSubmit: (values) => {
      /* NOTE: Clear fields dependent on shipping if it got unchecked */
      if (!values.ships) {
        values.intShipping = false;
        values.paidShipping = false;
      }

      addShoe({
        variables: {
          shoe: {
            ...values,
            size: parseFloat(values.size),
            kilometers: parseFloat(values.kilometers),
          },
        },
      });
    },
  });

  console.log("@city",formik.values.city)
  console.log("@country",formik.values.country)
  console.log("@kilometers",formik.values.kilometers)
  console.log("@size",formik.values.size)

  const countryDetails = !formik.values.country ? null : countries.find(
    (country) => country.name === formik.values.country
  );
  const citiesInSetCountry = !countryDetails
    ? null
    : countryDetails.cities.map((city) => ({
        value: city.name,
        label: city.name,
      }));

  const countryArray = countries.map((country) => ({
    value: country.name,
    label: country.name,
  }));

  const clearForm = (ref) => {
    const input = ref.current;
    if (!input) return;
    input.clearValue();
    formik.setFieldValue(input.props.name, "");
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      'backgroundColor': 'white', // Cambia el color de fondo del control
      'borderColor': state.isFocused ? 'blue' : 'gray', // Cambia el color del borde
      '&:hover': {
        borderColor: state.isFocused ? 'blue' : 'gray', // Cambia el color del borde al pasar el mouse por encima
      },
      'width': '15rem',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'blue' : 'white', // Cambia el color de fondo de la opción seleccionada
      color: state.isFocused ? 'white' : 'black', // Cambia el color del texto de la opción seleccionada
    }),
  };

  const _renderError = (id) =>
    formik.touched[id] && formik.errors[id] ? (
      <div>{formik.errors[id]}</div>
    ) : null;

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Field>
        <input
          placeholder="how would you like to be called?"
          name="ownerName"
          {...formik.getFieldProps('ownerName')}
          type="text"
        />
        {_renderError('ownerName')}
      </Field>

      <Field>
        <input
          placeholder="email"
          name="email"
          {...formik.getFieldProps('email')}
          type="text"
        />
        {_renderError('email')}
      </Field>

      <Field>
        <input
          placeholder="brand"
          name="brand"
          {...formik.getFieldProps('brand')}
          type="text"
        />
        {_renderError('brand')}
      </Field>

      <Field>
        <input
          placeholder="model"
          name="model"
          {...formik.getFieldProps('model')}
          type="text"
        />
        {_renderError('model')}
      </Field>

      <Field>
        <Select
          ref={refSize}
          placeholder="size"
          name="size"
          onChange={(option) => {
            !option ? '' : formik.setFieldValue('size', option.value);
          }}
          options={sizeOptions}
          styles={customStyles}></Select>
        <label htmlFor="size">size</label>
        {_renderError('size')}
      </Field>

      <Field>
        <input
          name="isFemaleShoe"
          {...formik.getFieldProps('isFemaleShoe')}
          type="checkbox"
        />
        <label htmlFor="isFemaleShoe">female</label>
      </Field>

      <Field>
        <input
          name="isTrailShoe"
          {...formik.getFieldProps('isTrailShoe')}
          type="checkbox"
        />
        <label htmlFor="isTrailShoe">trail shoe</label>
      </Field>

      <Field>
        <Select
          ref={refKilometers}
          placeholder="kilometers"
          name="kilometers"
          onChange={(option) =>
            !option ? '' : formik.setFieldValue('kilometers', option.value)
          }
          options={kilometersOptions}
          styles={customStyles}></Select>
        <label htmlFor="kilometers">kilometers</label>
        {_renderError('kilometers')}
      </Field>

      <Field>
        <Select
          ref={refCountry}
          placeholder="country"
          name="country"
          onChange={(option) =>
            !option ? '' : formik.setFieldValue('country', option.value)
          }
          options={countryArray}
          styles={customStyles}
          isClearable></Select>
        {_renderError('country')}
      </Field>

      <Field>
        <Select
          ref={refCity}
          placeholder="city"
          name="city"
          onChange={(option) =>
            !option ? '' : formik.setFieldValue('city', option.value)
          }
          options={citiesInSetCountry ? citiesInSetCountry : []}
          styles={customStyles}
          isClearable
        />
        {_renderError('city')}
      </Field>

      <Field>
        <input
          name="ships"
          {...formik.getFieldProps('ships')}
          type="checkbox"
        />
        <label htmlFor="ships">ships?</label>
      </Field>

      <Field disabled={!formik.values.ships}>
        <input
          name="intShipping"
          {...formik.getFieldProps('intShipping')}
          type="checkbox"
          disabled={!formik.values.ships}
        />
        <label htmlFor="intShipping">ships internationally?</label>
      </Field>

      <Field disabled={!formik.values.ships}>
        <input
          name="paidShipping"
          {...formik.getFieldProps('paidShipping')}
          type="checkbox"
          disabled={!formik.values.ships}
        />
        <label htmlFor="paidShipping">paid shipping?</label>
      </Field>

      <Field>
        <Button type="submit" margin="1em 0" primary>
          submit
        </Button>
      </Field>

      <Field>
        <Button
          onClick={() => {
            clearForm(refCity);
            clearForm(refCountry);
            clearForm(refKilometers);
            clearForm(refSize);
          }}
          type="reset"
          margin="1em 0"
          primary>
          X
        </Button>
      </Field>
    </Form>
  );
};

export default ShoeForm;
