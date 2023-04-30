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
import { Loader } from '../Loader'
import { Conditions } from './Conditions.tsx'
import './NewSession.scss'
import { Setup } from './Setup'

type Observation = {
    id: string
    fits: string[]
}

export const NewSession = () => {
    const [loadingMessage, setLoadingMessage] = useState('')
    const getFits = (): string[] =>
        JSON.parse(window.sessionStorage.getItem('astrobook.fits') || '[]');

    useEffect(() => {
        let timer: any = null
        if (!!loadingMessage) { // appel en cours
            timer = setInterval(() => {
                fetch(`/api/pictures/status?id=${getFits().join('&id=')}`)
                .then(r => r.json())
                .then(r => {
                    if(r.status === 'DONE'){
                        setLoadingMessage('');
                        alert(`✅ ${getFits().length} images importées`)
                    }
                })
            }, 3000);
        }
        return () => {
            if (timer) clearInterval(timer)
        }
    }, [loadingMessage])

    // @see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()

        const fields = e.target as typeof e.target & {
            location: { value: string }
            path: { value: string }
            weather: { value: string }
            targets: { value: string }
            instrument: { value: string }
            corrred: { value: string }
        }
        if (
            !window.confirm(
                `Confirmez-vous l'import de "${fields.targets.value}" ?`
            )
        ) {
            return
        }

        fetch('/api/observation', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: fields.location.value,
                path: fields.path.value,
                weather: fields.weather.value,
                instrument: fields.instrument.value,
                corrred: fields.corrred.value,
                targets: fields.targets.value,
            }),
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('invalid status : '+response.status)
                } else {
                    return response.json()
                }
            })
            .then((observation: Observation) => {
                window.sessionStorage.setItem(
                    'astrobook.fits',
                    JSON.stringify(observation?.fits)
                )
                setLoadingMessage(
                    `Importation de ${observation?.fits.length} images...`
                )
            })
            .catch(e => alert(`⚠️ Oups \n ${e}`))
    }

    return (
        <form onSubmit={handleSubmit}>
            {!!loadingMessage && (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid
                            item
                            xs={12}
                            style={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                height: '20rem',
                            }}
                        >
                            <Loader message={loadingMessage} />
                        </Grid>
                    </Grid>
                </Box>
            )}
            {!loadingMessage && (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                            {/* emplacement et quantité de fichiers */}
                            <Control>
                                <TextField
                                    label="Cibles"
                                    type="text"
                                    required
                                    defaultValue={''}
                                    name="targets"
                                    helperText="ex: m51, ngc5633"
                                    fullWidth
                                    inputProps={{
                                        maxLength: 256,
                                    }}
                                />
                            </Control>
                        </Grid>

                        <Grid item xs={12} md={6} children={<Conditions />} />
                        <Grid item xs={12} md={6} children={<Setup />} />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            alignContent: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                            marginTop: '2rem',
                        }}
                    >
                        <Button type="submit" variant="contained">
                            Téléverser
                        </Button>
                    </Grid>
                </Box>
            )}
        </form>
    )
}
