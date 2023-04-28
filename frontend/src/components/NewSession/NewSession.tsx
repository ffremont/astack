import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    TextField,
} from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Control } from '../Control'
import { Conditions } from './Conditions.tsx'
import './NewSession.scss'
import { Setup } from './Setup'

export const NewSession = () => {
    const [fileCounter, setFileCounter] = useState<number | null>(24)
    useEffect(() => {}, [])

    // @see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        console.log(e.target);
        const target = e.target as typeof e.target & {
            location: { value: string },
            path: { value: string },
            weather: { value: string },
            force: { checked: boolean },
            instrument: { value: string },
            corrred: { value: string }
          };
          console.log(target.force.checked)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        {/* emplacement et quantité de fichiers */}
                        <Control>
                            <TextField
                                label="Emplacement"
                                type="text"
                                required
                                defaultValue={'/Users/floorent/DSO'}
                                name="path"
                                helperText="ex: /Users/floorent/DSO"
                                fullWidth
                                inputProps={{
                                    maxLength: 256,
                                }}
                            />
                        </Control>
                    </Grid>
                    <Grid item xs={4}>
                        <div className="file-counter">{fileCounter || 0}</div>
                    </Grid>

                    <Grid item xs={12}>
                        {/* Forcer la mise à jour */}
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox defaultChecked name="force" />
                                }
                                label="Forcer la mise jour"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={6} children={<Conditions />} />
                    <Grid item xs={12} md={6} children={<Setup />} />
                </Grid>
                <Grid item xs={12} sx={{
                    alignContent:'center',
                    justifyContent:'center',
                    display:'flex',
                    marginTop:'2rem'
                }}>
                    <Button type="submit" variant="contained">Téléverser</Button>
                </Grid>
            </Box>
        </form>
    )
}
