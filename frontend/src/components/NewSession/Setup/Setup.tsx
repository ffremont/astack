import { Card, CardContent, TextField, Typography } from '@mui/material'
import { Control } from '../../Control'
import { myStore } from '../myStore'


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
                        defaultValue={myStore('instrument') || 'SW 250 / 1200'}
                        onChange={(e) => myStore('instrument', e.target.value)}
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
                        defaultValue={myStore('corrred') || 'Nexus Starizona x0.75'}
                        onChange={(e) => myStore('corrred', e.target.value)}
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
