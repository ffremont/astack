import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Control } from '../../Control'


export const Setup = () => {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography
                    color="text.secondary"
                    className="card-title"
                    variant="h2"
                    gutterBottom
                >
                    Setup
                </Typography>

                <Control>
                    <TextField
                        label="Instrument"
                        type="text"
                        name="instrument"
                        defaultValue={'SW 250 / 1200'}
                        helperText="Nom et focal de l'instrument"
                        fullWidth
                        inputProps={{
                            maxLength: 256,
                        }}
                    />
                </Control>
                <Control>
                    <TextField
                        label="Correcteur / Reducteur"
                        type="text"
                        name="corrred"
                        defaultValue={'Nexus Starizona x0.75'}
                        helperText="Nom du correcteur et/ou réducteur"
                        fullWidth
                        inputProps={{
                            maxLength: 256,
                        }}
                    />
                </Control>
            </CardContent>
        </Card>
    )
}
