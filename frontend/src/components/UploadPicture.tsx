import { Box, Button, Grid, TextField } from "@mui/material"
import { SyntheticEvent, useState } from "react";
import { Control } from "./Control"

export const UploadPicture = () => {
    const [fit, setFit] = useState('');
    const [img, setImg] = useState('');

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

    };
    return <form onSubmit={handleSubmit}><Box sx={{ flexGrow: 1 }}>
        <Grid item xs={12}>
            <Control>
                <TextField
                    label="FIT file location"
                    type="text"
                    required
                    onChange={(e) => setFit(e.target.value)}
                    name="fit"
                    helperText="ex: /Users/floorent/DSO"
                    fullWidth
                    inputProps={{
                        maxLength: 256,
                    }}
                />
            </Control>
        </Grid>
        <Grid item xs={12}>
            <Control>
                <TextField
                    label="Image file location"
                    type="text"
                    required
                    onChange={(e) => setImg(e.target.value)}
                    name="img"
                    helperText="ex: /Users/floorent/DSO"
                    fullWidth
                    inputProps={{
                        maxLength: 256,
                    }}
                />
            </Control>
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
                Load file
            </Button>
        </Grid>
    </Box>
    </form>

}