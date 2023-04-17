import {
  ICreateNewProperty
} from '@hopehome/interfaces';
import { theme } from '@hopehome/theme';
import {
  KeyboardArrowDownOutlined,
  LocationOnOutlined,
} from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  debounce,
} from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import { useFormik } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { ConfirmDialog } from '../confirmDialog';

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

const autocompleteService = { current: null };

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

export default function NewPropertyDialog({
  open,
  closeDialog,
  handleSubmit,
}: {
  open: boolean;
  closeDialog: () => void;
  handleSubmit: (val: ICreateNewProperty) => void;
}) {
  const { formatMessage } = useIntl();

  const listingReasons = ['Rent', 'Sale'];
  const propertyTypes = ['Home', 'Land'];
  const houseTypes = ['Appartment', 'Hostel', 'Default'];

  const initialValues: ICreateNewProperty = {
    price: 0,
    number_of_baths: 0,
    number_of_rooms: 0,
    area: 0,
    latitude: 0,
    longitude: 0,
    address: '',
    description: '',
    property_type: 'Home',
    listing_reason: 'Sale',
    house_type: 'Appartment',
  };
  const validationSchema = Yup.object().shape({
    price: Yup.number().required(),
    number_of_rooms: Yup.number().required(),
    number_of_baths: Yup.number().required(),
    latitude: Yup.number().required(),
    longitude: Yup.number().required(),
    area: Yup.number().min(1).required(),
    address: Yup.string().required(),
    description: Yup.string().required(),
    listing_reason: Yup.string().oneOf(listingReasons).required(),
    property_type: Yup.string().oneOf(propertyTypes).required(),
    house_type: Yup.string().oneOf(houseTypes).required(),
  });

  const [hasUsedPosition, setHasUsedPosition] = useState<boolean>(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const { longitude: lg, latitude: lt, property_type: pt } = values;
      const nValues: ICreateNewProperty = {
        ...values,
        longitude: lg === 0 && lt === 0 ? null : lg,
        latitude: lg === 0 && lt === 0 ? null : lt,
      };
      const submitValues: ICreateNewProperty =
        pt === 'Land'
          ? {
              ...nValues,
              house_type: null,
              number_of_baths: null,
              number_of_rooms: null,
            }
          : nValues;
      handleSubmit(submitValues);
      setHasUsedPosition(false);
      resetForm();
    },
  });

  const handleAccept = () => {
    if (navigator.geolocation) {
      setHasUsedPosition(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        formik.setFieldValue('longitude', position.coords.longitude);
        formik.setFieldValue('latitude', position.coords.latitude);
      });
    }
  };

  const [isConfirmUsePositionDialogOpen, setIsConfirmUsePositionDialogOpen] =
    useState<boolean>(false);
  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const [value, setValue] = useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const loaded = useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${'AIzaSyDYFQ9bbgFmqBdn_llTxm4gfooXajGYOuE'}&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly PlaceType[]) => void
        ) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback
          );
        },
        400
      ),
    []
  );

  useEffect(() => {
    let active = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current =
        new // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <>
      <ConfirmDialog
        danger
        dialogTitle={formatMessage({ id: 'useCurrentLocation' })}
        confirmButton={formatMessage({ id: 'usePosition' })}
        dialogMessage={formatMessage({
          id: 'confirmUseCurrentPositionMessage',
        })}
        confirm={handleAccept}
        isDialogOpen={isConfirmUsePositionDialogOpen}
        closeDialog={() => setIsConfirmUsePositionDialogOpen(false)}
      />
      <Dialog
        open={open && !isConfirmUsePositionDialogOpen}
        onClose={closeDialog}
      >
        <DialogTitle sx={{ padding: '16px 24px 0 24px' }}>
          {formatMessage({ id: 'addNewProperty' })}
        </DialogTitle>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '16px 24px' }}>
            <Box sx={{ display: 'grid', rowGap: 2 }}>
              <Stack direction={'column'}>
                <Typography variant="body2">
                  {formatMessage({ id: 'propertyType' })}
                </Typography>
                <FormControl fullWidth>
                  <Select
                    IconComponent={KeyboardArrowDownOutlined}
                    error={
                      formik.touched.property_type &&
                      Boolean(formik.errors.property_type)
                    }
                    {...formik.getFieldProps('property_type')}
                    size="small"
                    sx={{ ...theme.typography.caption }}
                    input={<OutlinedInput />}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: 250,
                        },
                      },
                    }}
                  >
                    {propertyTypes.map((_, index) => (
                      <MenuItem
                        key={index}
                        value={_}
                        sx={{
                          ...theme.typography.caption,
                          color: theme.common.CSK50,
                        }}
                      >
                        {formatMessage({ id: _ })}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.property_type &&
                    formik.errors.property_type && (
                      <FormHelperText sx={{ color: theme.palette.error.main }}>
                        {formik.errors.property_type}
                      </FormHelperText>
                    )}
                </FormControl>
              </Stack>

              <Stack direction={'column'}>
                <Typography variant="body2">
                  {formatMessage({ id: 'listingReason' })}
                </Typography>
                <FormControl fullWidth>
                  <Select
                    IconComponent={KeyboardArrowDownOutlined}
                    error={
                      formik.touched.listing_reason &&
                      Boolean(formik.errors.listing_reason)
                    }
                    {...formik.getFieldProps('listing_reason')}
                    size="small"
                    sx={{ ...theme.typography.caption }}
                    input={<OutlinedInput />}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: 250,
                        },
                      },
                    }}
                  >
                    {listingReasons.map((_, index) => (
                      <MenuItem
                        key={index}
                        value={_}
                        sx={{
                          ...theme.typography.caption,
                          color: theme.common.CSK50,
                        }}
                      >
                        {formatMessage({ id: _ })}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.listing_reason &&
                    formik.errors.listing_reason && (
                      <FormHelperText sx={{ color: theme.palette.error.main }}>
                        {formik.errors.listing_reason}
                      </FormHelperText>
                    )}
                </FormControl>
              </Stack>

              {formik.values.property_type === 'Home' && (
                <Stack direction={'column'}>
                  <Typography variant="body2">
                    {formatMessage({ id: 'houseTypes' })}
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      IconComponent={KeyboardArrowDownOutlined}
                      error={
                        formik.touched.house_type &&
                        Boolean(formik.errors.house_type)
                      }
                      {...formik.getFieldProps('house_type')}
                      size="small"
                      sx={{ ...theme.typography.caption }}
                      input={<OutlinedInput />}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 4.5 + 8,
                            width: 250,
                          },
                        },
                      }}
                    >
                      {houseTypes.map((_, index) => (
                        <MenuItem
                          key={index}
                          value={_}
                          sx={{
                            ...theme.typography.caption,
                            color: theme.common.CSK50,
                          }}
                        >
                          {formatMessage({ id: _ })}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.house_type && formik.errors.house_type && (
                      <FormHelperText sx={{ color: theme.palette.error.main }}>
                        {formik.errors.house_type}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              )}

              <Autocomplete
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option.description
                }
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                size="small"
                {...formik.getFieldProps('address')}
                onChange={(event, newValue) => {
                  setOptions(newValue ? [newValue, ...options] : options);
                  setValue(newValue);
                  if (newValue === null) formik.setFieldValue('address', '');
                  else formik.setFieldValue('address', newValue.description);
                }}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`${formatMessage({ id: 'address' })}`}
                    required
                    color="primary"
                    variant="outlined"
                    fullWidth
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                  />
                )}
                renderOption={(props, option) => {
                  const matches =
                    option.structured_formatting.main_text_matched_substrings ||
                    [];

                  const parts = parse(
                    option.structured_formatting.main_text,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    matches.map((match: any) => [
                      match.offset,
                      match.offset + match.length,
                    ])
                  );

                  return (
                    <li {...props}>
                      <Grid container alignItems="center">
                        <Grid item sx={{ display: 'flex', width: 44 }}>
                          <LocationOnOutlined
                            sx={{ color: 'text.secondary' }}
                          />
                        </Grid>
                        <Grid
                          item
                          sx={{
                            width: 'calc(100% - 44px)',
                            wordWrap: 'break-word',
                          }}
                        >
                          {parts.map((part, index) => (
                            <Box
                              key={index}
                              component="span"
                              sx={{
                                fontWeight: part.highlight ? 'bold' : 'regular',
                              }}
                            >
                              {part.text}
                            </Box>
                          ))}
                          <Typography variant="body2" color="text.secondary">
                            {option.structured_formatting.secondary_text}
                          </Typography>
                        </Grid>
                      </Grid>
                    </li>
                  );
                }}
              />

              <TextField
                fullWidth
                required
                size="small"
                type="number"
                label={formatMessage({ id: 'area' })}
                error={formik.touched.area && Boolean(formik.errors.area)}
                helperText={formik.touched.area && formik.errors.area}
                {...formik.getFieldProps('area')}
              />

              <TextField
                fullWidth
                required
                multiline
                size="small"
                rows={3}
                label={formatMessage({ id: 'description' })}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                {...formik.getFieldProps('description')}
              />

              {formik.values.property_type === 'Home' && (
                <>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="number"
                    label={formatMessage({ id: 'numberOfRooms' })}
                    error={
                      formik.touched.number_of_rooms &&
                      Boolean(formik.errors.number_of_rooms)
                    }
                    helperText={
                      formik.touched.number_of_rooms &&
                      formik.errors.number_of_rooms
                    }
                    {...formik.getFieldProps('number_of_rooms')}
                  />

                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="number"
                    label={formatMessage({ id: 'numberOfBaths' })}
                    error={
                      formik.touched.number_of_baths &&
                      Boolean(formik.errors.number_of_baths)
                    }
                    helperText={
                      formik.touched.number_of_baths &&
                      formik.errors.number_of_baths
                    }
                    {...formik.getFieldProps('number_of_baths')}
                  />
                </>
              )}

              <TextField
                fullWidth
                required
                size="small"
                type="number"
                label={formatMessage({ id: 'price' })}
                InputProps={{
                  endAdornment: 'xaf',
                }}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                {...formik.getFieldProps('price')}
              />

              <Box sx={{ display: 'grid', rowGap: 1 }}>
                <Button
                  size="small"
                  color="secondary"
                  disableElevation
                  variant="contained"
                  sx={{ justifySelf: 'start', textTransform: 'none' }}
                  onClick={() => setIsConfirmUsePositionDialogOpen(true)}
                >
                  {formatMessage({ id: 'useCurrentPosition' })}
                </Button>
                <Box sx={{ display: 'grid', rowGap: 2 }}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="number"
                    disabled={hasUsedPosition}
                    label={formatMessage({ id: 'longitude' })}
                    error={
                      formik.touched.longitude &&
                      Boolean(formik.errors.longitude)
                    }
                    helperText={
                      formik.touched.longitude && formik.errors.longitude
                    }
                    {...formik.getFieldProps('longitude')}
                  />

                  <TextField
                    fullWidth
                    required
                    disabled={hasUsedPosition}
                    size="small"
                    type="number"
                    label={formatMessage({ id: 'latitude' })}
                    error={
                      formik.touched.latitude && Boolean(formik.errors.latitude)
                    }
                    helperText={
                      formik.touched.latitude && formik.errors.latitude
                    }
                    {...formik.getFieldProps('latitude')}
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeDialog}
              color="error"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="small"
              sx={{ textTransform: 'none' }}
              variant="contained"
            >
              {formatMessage({ id: 'createProperty' })}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
