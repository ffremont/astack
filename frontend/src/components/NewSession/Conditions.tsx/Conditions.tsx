import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Control } from '../../Control'


export const Conditions = () => {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography
                    color="text.secondary"
                    className="card-title"
                    variant="h2"
                    gutterBottom
                >
                    Conditions
                </Typography>

                <Control>
                    <TextField
                        label="Lieu"
                        type="text"
                        name="location"
                        defaultValue={'maison'}
                        required
                        helperText="Nom de l'endroit d'observation"
                        fullWidth
                        inputProps={{
                            maxLength: 256,
                        }}
                    />
                </Control>
                <FormControl className='app-control-form' fullWidth>
                    <InputLabel id="weather">Météo</InputLabel>
                    <Select
                        labelId="weather"
                        id="weather-select"
                        name="weather"
                        required
                        defaultValue={'VERY_GOOD'}
                        label="weather"
                    >
                        <MenuItem value={'VERY_GOOD'}>Excellente</MenuItem>
                        <MenuItem value={'GOOD'}>Bonne</MenuItem>
                        <MenuItem value={'FAVORABLE'}>Favorable</MenuItem>
                        <MenuItem value={'BAD'}>Mauvaise</MenuItem>
                    </Select>
                </FormControl>
            </CardContent>
        </Card>
    )
}
