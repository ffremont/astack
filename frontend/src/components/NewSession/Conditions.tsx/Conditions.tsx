import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Control } from '../../Control'
import { myStore } from '../myStore'


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
                        defaultValue={myStore('location') || 'maison'}
                        onChange={(e) => myStore('location', e.target.value)}
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
                        defaultValue={myStore('weather') || 'GOOD'}
                        onChange={(e, v) => myStore('weather', e.target.value)}
                        required
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
